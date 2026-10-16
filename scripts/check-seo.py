"""Check the actual server-rendered SEO output after `npm run build`."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path

BASE = 'https://www.actprove.com'
BUILD = Path('.next/server/app')
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.canonicals=[]; self.meta={}; self.links=set(); self.ids=set(); self.schemas=[]; self.ld=False; self.buffer=''; self.h1=0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='link' and a.get('rel')=='canonical': self.canonicals.append(a['href'])
        if tag=='meta': self.meta[a.get('name',a.get('property'))]=a.get('content','')
        if tag=='a': self.links.add(a.get('href',''))
        if 'id' in a: self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='script' and a.get('type')=='application/ld+json': self.ld=True; self.buffer=''
    def handle_data(self, data):
        if self.ld: self.buffer+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.ld:
            self.schemas.append(json.loads(self.buffer)); self.ld=False

def read(path):
    file=BUILD/('index.html' if path=='/' else path.lstrip('/')+'.html')
    return Page(file.read_text())

sitemap=(BUILD/'sitemap.xml.body').read_text()
urls=re.findall(r'<loc>(.*?)</loc>',sitemap)
assert len(urls)==len(set(urls))
assert '<lastmod>' not in sitemap, 'Do not invent last-modified dates per build'
checked=0
for url in urls:
    assert url.startswith(BASE+'/'), url
    assert not any(x in url for x in ['investment-deck','pitchdeck','admin-pro','/api/','/submit'])
    path=url[len(BASE):]
    # Contact is server-rendered on request; verify it separately over HTTP.
    if path=='/contact': continue
    page=read(path)
    assert [value.rstrip('/') for value in page.canonicals]==[url.rstrip('/')], (path,page.canonicals)
    assert 'noindex' not in page.meta.get('robots',''), path
    assert page.meta.get('description'), path
    assert page.meta.get('og:url','').rstrip('/')==url.rstrip('/'), path
    assert page.meta.get('og:image')==BASE+'/social-image', path
    assert page.meta.get('twitter:card')=='summary_large_image', path
    assert page.h1==1, (path,page.h1)
    checked+=1

careers=read('/careers')
roles=[url[len(BASE):] for url in urls if '/careers/' in url]
assert len(roles)==58
assert set(roles)<=careers.links, 'Every role must be crawlable without clicking Show more'
assert any(s.get('@type')=='CollectionPage' for s in careers.schemas)
for path in roles:
    page=read(path)
    assert '#apply' in page.links and 'apply' in page.ids, path
    assert any(s.get('@type')=='BreadcrumbList' for s in page.schemas), path
    assert not any(s.get('@type')=='JobPosting' for s in page.schemas), 'Future role profiles are not confirmed openings'
for path in ['/investment-deck','/investment-deck/brief','/pitchdeck']:
    assert 'noindex' in read(path).meta.get('robots',''), path
home=read('/')
assert any(s.get('@graph') for s in home.schemas)
robots=(BUILD/'robots.txt.body').read_text()
assert f'Sitemap: {BASE}/sitemap.xml' in robots
assert 'Disallow: /pitchdeck' not in robots, 'Let crawlers read the noindex directive'
print(f'PASS: {checked} public pages, 58 crawlable role/application links, JSON-LD, canonical/social metadata, sitemap and private-deck noindex.')

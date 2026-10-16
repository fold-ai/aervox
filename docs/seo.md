# Public search setup

The public canonical origin is https://www.actprove.com. Vercel redirects the apex domain to it.

## Implemented

- Unique titles, descriptions, canonical URLs and social previews for public pages and all 58 role profiles.
- Organization and WebSite structured data on the homepage; CollectionPage/ItemList on careers; BreadcrumbList on role and system pages.
- All role links render in the initial careers HTML. Filters remain available.
- Direct application anchors on individual role pages.
- Sitemap of public pages only. No artificial lastModified timestamps.
- Private decks retain noindex and are excluded from the sitemap. Crawlers must be allowed to fetch their HTML to see noindex. This does not provide access control.
- No applicant records, resumes or private contact submissions appear in structured data or the sitemap.

Run `npm run build` and `python3 scripts/check-seo.py` to check actual generated HTML.

## Google Jobs: facts still required

Role profiles currently mix hiring priorities with future expressions of interest. Do not add JobPosting to all profiles. Confirm each actual opening, original posting date, work location (or fully remote status and eligible countries) and employment terms first. Do not infer remote work from undecided office locations.

Once confirmed, publish those facts visibly on the corresponding role page and add matching JobPosting JSON-LD there only. Do not add it to the directory. Use actual dates and remove the markup or set a past validThrough when a job closes. Do not invent salaries, addresses or rolling expiry dates. Update the SEO regression check when verified postings are introduced.

## Search engine accounts

The code release does not verify Search Console ownership or submit URLs to Google.

1. Verify actprove.com in Google Search Console using the account owner's DNS verification token.
2. Submit https://www.actprove.com/sitemap.xml.
3. Inspect the homepage, careers and priority role URLs, then request indexing.
4. Monitor indexing, search queries and click-through rates. Check JobPosting enhancements and Rich Results Test once eligible job markup is added.
5. Add the same sitemap in Bing Webmaster Tools, or import the verified Search Console property.

Google decides indexing and rankings. Technical eligibility does not guarantee rich results or first positions. Improve discovery over time through accurate product information, useful role descriptions and credible public links to the site.

References:
- https://developers.google.com/search/docs/appearance/structured-data/job-posting
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

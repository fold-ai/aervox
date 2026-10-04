"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import wordmark from "@/public/actprove-wordmark.png";
import styles from "./SiteChrome.module.css";

const navigation = [
  { href: "/systems", label: "Systems" },
  { href: "/platform", label: "Platform" },
  { href: "/company", label: "Company" },
  { href: "/contact", label: "Contact" },
];

export function Arrow({ diagonal = false, className = "", ...props }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.3" /></svg>;
}

function Brand({ light = false, priority = false, className = "" }) {
  return <Link href="/" className={`${styles.brand} ${light ? styles.brandLight : ""} ${className}`} aria-label="Actprove home">
    <Image src={wordmark} alt="Actprove" priority={priority} sizes="(max-width: 760px) 148px, 178px" />
    <span>DEFENSE TECHNOLOGIES</span>
  </Link>;
}

export function SiteHeader({ theme = "dark", overlay = false }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const navigationId = `site-navigation-${useId().replace(/:/g, "")}`;
  const light = theme === "light";

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = event => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return <>
    <a className={styles.skipLink} href="#main">Skip to content</a>
    <header className={styles.header} data-theme={light ? "light" : "dark"} data-overlay={overlay} data-open={menuOpen}>
      <Brand light={light} priority />
      <button type="button" ref={menuButton} className={styles.menuButton} aria-expanded={menuOpen} aria-controls={navigationId} onClick={() => setMenuOpen(open => !open)}><span>{menuOpen ? "Close" : "Menu"}</span><span className={styles.menuIcon} aria-hidden="true"><i /><i /></span></button>
      <nav id={navigationId} className={styles.navigation} aria-label="Main navigation">
        {navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href || pathname?.startsWith(`${item.href}/`) ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}{item.href === "/contact" && <Arrow diagonal />}</Link>)}
      </nav>
    </header>
  </>;
}

export function SiteFooter() {
  return <footer className={styles.footer}>
    <div className={styles.footerInvitation}>
      <span className={styles.footerIndex}>ACTPROVE / NEXT STEPS</span>
      <Link href="/contact" className={styles.footerHeading}>Bring intelligence<br />to your aircraft.<Arrow diagonal /></Link>
    </div>
    <div className={styles.footerMain}>
      <div className={styles.footerIdentity}><Brand /><p>Onboard intelligence.<br />Ground software.<br />Aircraft-specific integration.</p></div>
      <div className={styles.footerNav}><span>EXPLORE</span><nav aria-label="Footer navigation">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></div>
      <div className={styles.footerConnect}><span>CONNECT</span><a href="mailto:contact@actprove.com">contact@actprove.com<Arrow diagonal /></a><Link href="/investment-deck">Investment deck<Arrow diagonal /></Link></div>
    </div>
    <div className={styles.footerBottom}><span>© 2026 ACTPROVE DEFENSE TECHNOLOGIES</span><span>BUILT AROUND THE AIRCRAFT.</span><Link href="/">ACTPROVE<Arrow /></Link></div>
  </footer>;
}

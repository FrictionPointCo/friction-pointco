"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { search as searchProducts } from "@/lib/products";

const NAV = [
  { label: "HOME", href: "/" },
  { label: "PULL THE TRIGGER", href: "/pull-the-trigger" },
  { label: "EDC", href: "/edc" },
  { label: "KNIVES", href: "/knives" },
  { label: "RANGE", href: "/range" },
  { label: "GEAR", href: "/gear" },
];

export const INSTAGRAM_URL = "https://instagram.com/Frictionpointco"; // <-- single place to update Instagram link

export default function Header({ products = [], activeOverride = null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = query ? searchProducts(products, query) : [];

  function closeAll() {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <>
      <header className="site-header">
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="site-header__inner container">
          <Link className="brand" href="/" aria-label="Friction Point home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/logo-mark.png" alt="Friction Point logo" width="36" height="36" />
            <span>FRICTION <em>POINT</em></span>
          </Link>
          <nav className="main-nav" aria-label="Primary">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={(activeOverride || pathname) === item.href ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} onKeyDown={(e) => e.key === "Escape" && closeAll()}>
        <div className="mobile-menu__inner">
          <div className="mobile-menu__top">
            <Link className="brand" href="/" onClick={closeAll}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/logo-mark.png" alt="Friction Point logo" width="32" height="32" />
              <span>FRICTION <em>POINT</em></span>
            </Link>
            <button className="icon-btn" aria-label="Close menu" onClick={closeAll}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}><Link href={item.href} onClick={closeAll}>{item.label}</Link></li>
            ))}
            <li><Link className="secondary" href="/about" onClick={closeAll}>ABOUT</Link></li>
          </ul>
        </div>
      </div>

      <div className={`search-overlay ${searchOpen ? "is-open" : ""}`}>
        <div className="search-overlay__inner">
          <div className="search-overlay__top">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <input
              type="text"
              placeholder="Search gear, brands, categories…"
              aria-label="Search"
              value={query}
              autoFocus={searchOpen}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && closeAll()}
            />
            <button className="icon-btn" aria-label="Close search" onClick={closeAll}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className="search-results">
            {query && results.length === 0 && (
              <p style={{ color: "var(--text-secondary)", padding: "12px 8px" }}>
                No gear matches &quot;{query}&quot;.
              </p>
            )}
            {results.map((p) => (
              <Link key={p.id} className="search-result" href={`/product/${p.id}`} onClick={closeAll}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image || "/images/products/_placeholder.jpg"} alt=""

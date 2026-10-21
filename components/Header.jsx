'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav } from '../lib/data';

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  function toggleTheme() {
    const el = document.documentElement;
    const next = el.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    el.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  }

  return (
    <header className="hdr">
      <nav className="wrap" aria-label="Primary">
        <a href="/" className="logo"><img src="/logo.svg" alt="" width="30" height="30" />shakir<b>.</b>dev</a>
        <ul className={'navl' + (open ? ' open' : '')}>
          {nav.map((n) => (
            <li key={n.href}><a href={n.href} aria-current={path === n.href ? 'page' : undefined}>{n.label}</a></li>
          ))}
        </ul>
        <div className="navr">
          <button type="button" className="iconbtn" onClick={toggleTheme} aria-label="Toggle light and dark mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" /></svg>
          </button>
          <a href="/contact.html" className="btn primary sm">Start a project</a>
          <button type="button" className="iconbtn burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

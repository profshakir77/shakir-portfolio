'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { nav } from '../lib/data';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);
  const path = usePathname();
  const navRef = useRef(null);

  useEffect(() => { setOpen(false); setDrop(null); }, [path]);
  useEffect(() => {
    const onDoc = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setDrop(null); };
    const onKey = (e) => { if (e.key === 'Escape') { setDrop(null); setOpen(false); } };
    document.addEventListener('pointerdown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  function toggleTheme() {
    const el = document.documentElement;
    const next = el.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    el.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  }

  const isCur = (href) => path === href || path === href.replace(/\.html$/, '');

  return (
    <header className="hdr">
      <nav className="wrap" aria-label="Primary" ref={navRef}>
        <a href="/" className="logo" aria-label="Shakir Hussain, home"><img src="/logo.svg" alt="" width="38" height="38" /><span className="lt"><b>Shakir Hussain</b><small>Full-stack developer</small></span></a>
        <ul className={'navl' + (open ? ' open' : '')}>
          {nav.map((n) => n.children ? (
            <li key={n.label} className={'has-drop' + (drop === n.label ? ' show' : '')}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse' && window.innerWidth > 900) setDrop(n.label); }}
              onPointerLeave={(e) => { if (e.pointerType === 'mouse' && window.innerWidth > 900) setDrop(null); }}>
              <button type="button" className="drop-btn" aria-expanded={drop === n.label} aria-haspopup="true"
                aria-current={n.children.some((c) => isCur(c.href)) ? 'page' : undefined}
                onClick={(e) => { if (e.nativeEvent.pointerType === 'mouse' && window.innerWidth > 900) { setDrop(n.label); return; } setDrop(drop === n.label ? null : n.label); }}>
                {n.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="drop">
                {n.children.map((c) => (
                  <a key={c.href} href={c.href} aria-current={isCur(c.href) ? 'page' : undefined}>
                    <b>{c.label}</b>{c.desc && <small>{c.desc}</small>}
                  </a>
                ))}
              </div>
            </li>
          ) : (
            <li key={n.href}><a href={n.href} aria-current={isCur(n.href) ? 'page' : undefined}>{n.label}</a></li>
          ))}
        </ul>
        <div className="navr">
          <button type="button" className="iconbtn" onClick={toggleTheme} aria-label="Toggle light and dark mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4.5" /><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" /></svg>
          </button>
          <a href="/contact.html" className="btn primary sm">Get a quote</a>
          <button type="button" className="iconbtn burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

// Live client reviews from /api/reviews (approved only), shown as a 3D ring
// carousel. Add ?reviewsPreview=1 to the URL to see the design with clearly
// labelled sample cards; those never show to normal visitors.

const SAMPLES = [1, 2, 3, 4, 5].map((n) => ({
  id: `sample-${n}`, sample: true, name: `Sample review ${n}`, role: 'Design preview only', rating: 5,
  content: 'This card shows where a real client review will appear: their words, their photo and a link to the project.',
}));

const initials = (name) => (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
function hue(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360; return h; }
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

function Card({ r, active }) {
  const h = hue(r.name || '');
  const photo = r.photo && /^data:image\/(jpeg|png|webp);base64,/.test(r.photo) ? r.photo : '';
  return (
    <article className={'rcard card' + (active ? ' on' : '') + (r.sample ? ' sample' : '')} aria-hidden={!active}>
      {r.sample && <span className="rsample">Sample</span>}
      <span className="rquote" aria-hidden="true">&ldquo;</span>
      <div className="stars" aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating || 0)}<span className="off">{'★'.repeat(5 - (r.rating || 0))}</span></div>
      <p className="rtext">{r.content}</p>
      <div className="rwho">
        <span className="rava" style={{ '--h1': `hsl(${h} 70% 55%)`, '--h2': `hsl(${(h + 50) % 360} 75% 42%)` }}>
          {photo ? <img src={photo} alt="" width="52" height="52" loading="lazy" /> : <span>{initials(r.name)}</span>}
        </span>
        <span className="rmeta">
          <b>{r.name}</b>
          {r.role && <small>{r.role}</small>}
          {r.project && host(r.project) && <a href={r.project} target="_blank" rel="noopener nofollow" tabIndex={active ? 0 : -1}>{host(r.project)} ↗</a>}
        </span>
      </div>
    </article>
  );
}

function Ring({ items }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [w, setW] = useState(1000);
  const wrap = useRef(null);
  const drag = useRef(null);
  const n = items.length;

  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth)); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => x + 1), 5200);
    return () => clearInterval(t);
  }, [paused]);

  const card = Math.min(360, w - 48);
  const step = 360 / n;
  const radius = Math.round((card / 2) / Math.tan(Math.PI / n)) + (w < 640 ? 24 : 70);
  const cur = ((i % n) + n) % n;

  const down = (e) => { drag.current = e.clientX; setPaused(true); };
  const up = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current; drag.current = null;
    if (Math.abs(dx) > 40) setI((x) => x + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="ring-wrap" ref={wrap} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') setI(i + 1); if (e.key === 'ArrowLeft') setI(i - 1); }}
      role="region" aria-roledescription="carousel" aria-label="Client reviews">
      <div className="ring-stage" style={{ '--card': `${card}px` }} onPointerDown={down} onPointerUp={up} onPointerCancel={() => { drag.current = null; }}>
        <div className="ring" style={{ transform: `translateZ(-${radius}px) rotateY(${-i * step}deg)` }}>
          {items.map((r, k) => (
            <div key={r.id || k} className="ring-slot" style={{ transform: `rotateY(${k * step}deg) translateZ(${radius}px)` }}>
              <Card r={r} active={k === cur} />
            </div>
          ))}
        </div>
      </div>
      <div className="ring-nav">
        <button type="button" className="iconbtn" onClick={() => setI(i - 1)} aria-label="Previous review">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <div className="ring-dots">
          {items.map((r, k) => <button key={k} type="button" aria-label={`Review ${k + 1}`} aria-current={k === cur} onClick={() => setI(i + (((k - cur) % n) + n) % n)} />)}
        </div>
        <button type="button" className="iconbtn" onClick={() => setI(i + 1)} aria-label="Next review">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{`Review ${cur + 1} of ${n}: ${items[cur].name}`}</p>
    </div>
  );
}

export default function Reviews() {
  const [state, setState] = useState({ loading: true, reviews: [], preview: false });
  useEffect(() => {
    const preview = /[?&]reviewsPreview=1/.test(window.location.search);
    fetch('/api/reviews').then((r) => r.json())
      .then((d) => setState({ loading: false, reviews: d.reviews || [], preview }))
      .catch(() => setState({ loading: false, reviews: [], preview }));
  }, []);
  if (state.loading) return <div className="card skel" style={{ height: 320 }} />;

  let items = state.reviews;
  if (state.preview && items.length < 5) items = [...items, ...SAMPLES.slice(0, 5 - items.length)];

  if (!items.length) {
    return (
      <div className="review-empty card">
        <div className="re-stack" aria-hidden="true"><i /><i /><i /></div>
        <div>
          <h3>Your review could be the first one here.</h3>
          <p>Worked with me on a website, store or app? Share a few lines and, if you like, a photo or your logo. Reviews go live after a quick check.</p>
          <a className="btn primary" href="/leave-review.html">Leave a review</a>
        </div>
      </div>
    );
  }
  if (items.length < 3) {
    return (
      <div className="rgrid3d">{items.map((r) => <Card key={r.id} r={r} active />)}</div>
    );
  }
  return <Ring items={items} />;
}

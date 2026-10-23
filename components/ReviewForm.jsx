'use client';
import { useRef, useState } from 'react';
import Tilt from './Tilt';
import { Card } from './Reviews';

const labels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export default function ReviewForm() {
  const [f, setF] = useState({ name: '', role: '', project: '', content: '', rating: 5 });
  const [hover, setHover] = useState(0);
  const [photo, setPhoto] = useState('');
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const fileRef = useRef(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function loadPhoto(file) {
    if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
      setStatus({ state: 'idle', msg: 'Please choose a JPG, PNG or WebP image under 10 MB.' });
      return;
    }
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height); const c = document.createElement('canvas');
      c.width = c.height = 160;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 160, 160);
      setPhoto(c.toDataURL('image/jpeg', 0.82)); setStatus({ state: 'idle', msg: '' });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    if (f.name.trim().length < 2) return setStatus({ state: 'idle', msg: 'Please enter your name.' });
    if (f.content.trim().length < 20) return setStatus({ state: 'idle', msg: 'Your review needs at least 20 characters.' });
    setStatus({ state: 'sending', msg: '' });
    try {
      const r = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, photo }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return setStatus({ state: 'idle', msg: d.error || 'Could not submit your review.' });
      setStatus({ state: 'done', msg: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus({ state: 'idle', msg: 'Could not reach the server. Please try again.' });
    }
  }

  const preview = {
    id: 'preview', name: f.name.trim() || 'Your name', role: f.role.trim(), rating: f.rating,
    content: f.content.trim() || 'Your review will appear here as you type. Mention the project, how working together felt and any results you noticed.',
    photo, project: f.project.trim() ? (/^https?:\/\//i.test(f.project.trim()) ? f.project.trim() : `https://${f.project.trim()}`) : '',
  };

  if (status.state === 'done') {
    return (
      <div className="rv-done card">
        <div className="rv-burst" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--a': `${i * 25.7}deg`, '--d': `${(i % 4) * 60}ms` }} />)}</div>
        <div className="rv-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
        <h2>Thank you, {f.name.trim().split(' ')[0]}!</h2>
        <p>Your review has been received. It will appear on the homepage after a quick check. I really appreciate you taking the time.</p>
        <div className="rv-done-card"><Card r={preview} active /></div>
        <div className="rv-acts"><a className="btn primary" href="/">Back to homepage</a><a className="btn" href="/work">See recent work</a></div>
      </div>
    );
  }

  const shown = hover || f.rating;
  return (
    <div className="rv-grid">
      <form className="rv-form card" onSubmit={submit} noValidate>
        <div className="rv-step"><span>1</span>How would you rate the project?</div>
        <div className="rv-stars" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((v) => (
            <button key={v} type="button" role="radio" aria-checked={f.rating === v} aria-label={`${v} star${v > 1 ? 's' : ''}`}
              className={v <= shown ? 'on' : ''} style={{ '--i': v }} onMouseEnter={() => setHover(v)} onClick={() => setF({ ...f, rating: v })}>★</button>
          ))}
          <span className="rv-label">{labels[shown]}</span>
        </div>

        <div className="rv-step"><span>2</span>Tell visitors about it</div>
        <label className="fld">
          <textarea value={f.content} onChange={set('content')} maxLength={1000} rows={6} placeholder=" " required />
          <span>Your review</span>
          <small className="count">{f.content.length}/1000</small>
        </label>
        <p className="rv-tip">Tip: say what we built, how the process felt and any results (more enquiries, faster site, easier admin).</p>

        <div className="rv-step"><span>3</span>Who&apos;s it from?</div>
        <div className="rv-two">
          <label className="fld"><input value={f.name} onChange={set('name')} maxLength={80} placeholder=" " required /><span>Your name</span></label>
          <label className="fld"><input value={f.role} onChange={set('role')} maxLength={80} placeholder=" " /><span>Role or company (optional)</span></label>
        </div>
        <label className="fld"><input value={f.project} onChange={set('project')} maxLength={200} inputMode="url" placeholder=" " /><span>Project or website link (optional)</span></label>

        <div
          className={'rv-drop' + (drag ? ' drag' : '') + (photo ? ' has' : '')}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); loadPhoto(e.dataTransfer.files[0]); }}
        >
          <span className="rv-drop-ava">{photo ? <img src={photo} alt="Your photo preview" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="9" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>}</span>
          <span className="rv-drop-txt">
            <b>{photo ? 'Looking good!' : 'Add your photo or logo'}</b>
            <small>{photo ? 'Shown next to your review.' : 'Optional. Drag an image here or choose one. JPG, PNG or WebP.'}</small>
          </span>
          <span className="rv-drop-btns">
            <button type="button" className="btn sm" onClick={() => fileRef.current?.click()}>{photo ? 'Change' : 'Choose image'}</button>
            {photo && <button type="button" className="btn sm" onClick={() => { setPhoto(''); if (fileRef.current) fileRef.current.value = ''; }}>Remove</button>}
          </span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => loadPhoto(e.target.files?.[0])} />
        </div>

        {status.msg && <p className="rv-err" role="alert">{status.msg}</p>}
        <button type="submit" className="btn primary rv-submit" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Sending…' : 'Submit review'}<span aria-hidden="true">→</span>
        </button>
        <p className="rv-note">Reviews are checked before they go live. Your details are only used to show your review.</p>
      </form>

      <aside className="rv-side">
        <div className="rv-live"><i />Live preview</div>
        <div className="rv-preview">
          <Tilt className="rv-tilt" max={12}><Card r={preview} active /></Tilt>
          <span className="rv-orb o1" aria-hidden="true" /><span className="rv-orb o2" aria-hidden="true" />
        </div>
        <p className="rv-side-note">This is how your review will look on the homepage. Hover to tilt it.</p>
      </aside>
    </div>
  );
}

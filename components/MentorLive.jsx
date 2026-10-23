'use client';
import { useEffect, useState } from 'react';
import Tilt from './Tilt';

function useApi(url, key) {
  const [state, setState] = useState({ loading: true, items: [] });
  useEffect(() => {
    let live = true;
    fetch(url)
      .then((r) => (r.ok ? r.json() : { [key]: [] }))
      .then((d) => live && setState({ loading: false, items: d[key] || [] }))
      .catch(() => live && setState({ loading: false, items: [] }));
    return () => { live = false; };
  }, [url, key]);
  return state;
}

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
function hue(str) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360; return h; }

function Member({ m, i }) {
  const [flip, setFlip] = useState(false);
  const h = hue(m.name);
  const since = m.joined ? new Date(m.joined).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : null;
  return (
    <div className={'member' + (flip ? ' flipped' : '')} style={{ '--d': `${i * 70}ms` }}>
      <button type="button" className="member-in" onClick={() => setFlip(!flip)} aria-pressed={flip} aria-label={`${m.name}, show ${flip ? 'summary' : 'details'}`}>
        <span className="face front card">
          <span className="avatar" style={{ '--h1': `hsl(${h} 70% 55%)`, '--h2': `hsl(${(h + 50) % 360} 75% 45%)` }}>
            <span>{initials(m.name)}</span>
          </span>
          <b className="mname">{m.name}</b>
          <span className="mrole">Mentee{since ? ` since ${since}` : ''}</span>
          <span className="mstat"><strong>{m.projects}</strong> {m.projects === 1 ? 'project' : 'projects'} shipped</span>
          <span className="mhint">Tap to flip</span>
        </span>
        <span className="face back card">
          <b className="mname">{m.name}</b>
          <span className="mbio">{m.bio || 'Building real projects with guidance on code quality, Git workflow and deployment.'}</span>
          <span className="mhint">Tap to flip back</span>
        </span>
      </button>
      {(m.github || m.linkedin) && (
        <div className="mlinks">
          {m.github && <a href={m.github} target="_blank" rel="noopener nofollow">GitHub ↗</a>}
          {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener nofollow">LinkedIn ↗</a>}
        </div>
      )}
    </div>
  );
}

export function Team() {
  const { loading, items } = useApi('/api/team', 'team');
  if (loading) return <div className="mgrid">{[0, 1, 2, 3].map((i) => <div key={i} className="card skel" />)}</div>;
  return (
    <div className="mgrid">
      {items.map((m, i) => <Member key={m.id || m.name} m={m} i={i} />)}
      <a className="member join card" href="/student-portal.html">
        <span className="join-plus" aria-hidden="true">+</span>
        <b className="mname">Your name here</b>
        <span className="mrole">Join the team as a mentee and get your work on this page.</span>
        <span className="go">Join as a student →</span>
      </a>
    </div>
  );
}

export function StudentProjects() {
  const { loading, items } = useApi('/api/projects', 'projects');
  if (loading) return <div className="pgrid">{[0, 1, 2].map((i) => <div key={i} className="card skel tall" />)}</div>;
  if (!items.length) {
    return (
      <div className="empty-3d card">
        <div className="cube" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div>
          <h3>The showcase is warming up.</h3>
          <p>Approved mentee projects appear here automatically. Be the first to ship one.</p>
          <a href="/student-portal.html" className="btn primary">Submit your project</a>
        </div>
      </div>
    );
  }
  return (
    <div className="pgrid">
      {items.map((p) => (
        <Tilt key={p.id} className="card proj">
          <div className="ph mono">
            {p.imageUrl ? <img src={p.imageUrl} alt={p.title} loading="lazy" /> : <span>{initials(p.title || 'P')}</span>}
          </div>
          <div className="body lift">
            <span className="tag">by {p.studentName}</span>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            {p.tech?.filter(Boolean).length > 0 && <div className="chips">{p.tech.filter(Boolean).map((t) => <span key={t}>{t.trim()}</span>)}</div>}
            {(p.githubUrl || p.liveUrl) && (
              <div className="go-row">
                {p.liveUrl && <a className="go" href={p.liveUrl} target="_blank" rel="noopener nofollow">Live site ↗</a>}
                {p.githubUrl && <a className="go" href={p.githubUrl} target="_blank" rel="noopener nofollow">GitHub ↗</a>}
              </div>
            )}
          </div>
        </Tilt>
      ))}
    </div>
  );
}

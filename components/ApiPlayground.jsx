'use client';
import { useState } from 'react';

// Calls this site's own API routes from the browser and shows the real
// response and timing. Read-only GET endpoints only.
const ENDPOINTS = [
  { path: '/api/reviews', note: 'Client reviews from Redis' },
  { path: '/api/posts', note: 'Blog posts from Redis' },
  { path: '/api/projects', note: 'Student project showcase' },
];

export default function ApiPlayground() {
  const [sel, setSel] = useState(null);
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(ep) {
    setSel(ep.path); setBusy(true);
    const t0 = performance.now();
    try {
      const r = await fetch(ep.path, { cache: 'no-store' });
      const ms = Math.round(performance.now() - t0);
      const text = await r.text();
      let body; try { body = JSON.stringify(JSON.parse(text), null, 2); } catch { body = text; }
      const counts = (() => { try { const j = JSON.parse(text); const k = Object.keys(j).find((x) => Array.isArray(j[x])); return k ? `${j[k].length} ${k}` : '-'; } catch { return '-'; } })();
      setOut({ status: r.status, ms, size: text.length, counts, body: body.length > 4000 ? body.slice(0, 4000) + '\n…' : body, type: r.headers.get('content-type') || '' });
    } catch (e) {
      setOut({ status: 'error', ms: Math.round(performance.now() - t0), size: 0, counts: '-', body: String(e), type: '' });
    }
    setBusy(false);
  }

  return (
    <div className="card play">
      <div className="play-bar" role="group" aria-label="Choose an endpoint">
        {ENDPOINTS.map((ep) => (
          <button key={ep.path} type="button" aria-pressed={sel === ep.path} onClick={() => run(ep)}>GET {ep.path}</button>
        ))}
      </div>
      <div className="play-out">
        <div className="play-meta" aria-live="polite">
          {!out && !busy && <span>Pick an endpoint to send a real request to this site&apos;s serverless API.</span>}
          {busy && <span>Requesting…</span>}
          {out && !busy && (
            <>
              <div>status <b>{out.status}</b></div>
              <div>time <b>{out.ms} ms</b></div>
              <div>items <b>{out.counts}</b></div>
              <div>size <b>{out.size} B</b></div>
              <div style={{ marginTop: 8, fontSize: 12 }}>{ENDPOINTS.find((e) => e.path === sel)?.note}</div>
            </>
          )}
        </div>
        <pre>{out ? out.body : '// response appears here'}</pre>
      </div>
    </div>
  );
}

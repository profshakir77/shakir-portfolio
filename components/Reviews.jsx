'use client';
import { useEffect, useState } from 'react';

// Live client reviews from the /api/reviews route (Redis-backed).
export default function Reviews() {
  const [state, setState] = useState({ loading: true, reviews: [] });
  useEffect(() => {
    fetch('/api/reviews').then((r) => r.json())
      .then((d) => setState({ loading: false, reviews: d.reviews || [] }))
      .catch(() => setState({ loading: false, reviews: [] }));
  }, []);
  if (state.loading) return <p style={{ color: 'var(--muted)' }}>Loading reviews…</p>;
  if (!state.reviews.length) return <p className="empty-note">Reviews from recent clients will appear here. Worked with me? <a className="inline-link" href="/leave-review.html">Leave a review</a>.</p>;
  return (
    <div className="rgrid">
      {state.reviews.map((r, i) => (
        <div className="card review" key={r.id || i}>
          <div className="stars" aria-label={`${r.rating} out of 5`}>{'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}</div>
          <p>“{r.content}”</p>
          <div className="who"><b style={{ color: 'var(--text)' }}>{r.name}</b>{r.role ? ` · ${r.role}` : ''}</div>
        </div>
      ))}
    </div>
  );
}

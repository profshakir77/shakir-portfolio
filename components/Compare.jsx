'use client';
import { useState } from 'react';

// Drag to compare a wireframe with the finished UI.
export default function Compare() {
  const [pos, setPos] = useState(50);
  return (
    <div className="compare" style={{ '--pos': `${pos}%` }}>
      <div className="pane">
        <div className="wire" aria-hidden="true">
          <div className="r"><i style={{ width: '18%', height: 18 }} /><i style={{ width: '40%', height: 18, marginLeft: 'auto' }} /></div>
          <div><i style={{ width: '70%', height: 34, marginBottom: 10 }} /><i style={{ width: '45%', height: 14 }} /></div>
          <div className="r" style={{ height: '100%' }}><i style={{ flex: 1 }} /><i style={{ flex: 1 }} /><i style={{ flex: 1 }} /></div>
        </div>
      </div>
      <div className="pane top">
        <div className="mock" aria-hidden="true">
          <div className="nav">wrenpaw<span>Shop now</span></div>
          <h5>Everything your pet needs,<br />shipped across the US.</h5>
          <div className="tiles"><div /><div /><div /></div>
        </div>
      </div>
      <span className="lbl" style={{ left: 12 }}>Wireframe</span>
      <span className="lbl" style={{ right: 12 }}>Final UI</span>
      <div className="handle" aria-hidden="true" />
      <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Drag to compare wireframe and final design" />
    </div>
  );
}

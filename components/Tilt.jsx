'use client';
import { useRef } from 'react';

// 3D tilt on pointer hover. Plain transforms, no library.
export default function Tilt({ as: Tag = 'div', className = '', max = 8, children, ...rest }) {
  const ref = useRef(null);
  function move(e) {
    if (e.pointerType === 'touch') return;
    const el = ref.current; const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateZ(0)`;
    el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
  }
  function leave() { if (ref.current) ref.current.style.transform = ''; }
  return (
    <Tag ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
      <span className="shine" aria-hidden="true" />
    </Tag>
  );
}

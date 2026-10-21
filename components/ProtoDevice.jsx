'use client';
import { useState } from 'react';
import Tilt from './Tilt';

// A tiny clickable prototype in a 3D phone frame: the kind of thing a client
// clicks through before any production code exists.
const screens = {
  Home: (
    <>
      <div className="bar" style={{ width: '40%' }} />
      <div className="tile"><span style={{ color: 'var(--muted)' }}>Orders today</span><b>128</b></div>
      <div className="tile"><span style={{ color: 'var(--muted)' }}>Revenue</span><b>$4,920</b></div>
      <div className="bar" /><div className="bar" style={{ width: '70%' }} />
    </>
  ),
  Orders: (
    <>
      {['#1042 · Shipped', '#1041 · Packing', '#1040 · Delivered', '#1039 · Delivered'].map((o) => (
        <div className="tile" key={o} style={{ display: 'flex', justifyContent: 'space-between' }}><span>{o.split(' · ')[0]}</span><span style={{ color: 'var(--accent)' }}>{o.split(' · ')[1]}</span></div>
      ))}
    </>
  ),
  Profile: (
    <>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--accent-2))' }} />
      <div className="bar" style={{ width: '55%' }} /><div className="bar" style={{ width: '35%' }} />
      <div className="tile">Notifications <b style={{ fontSize: 15, display: 'inline', float: 'right' }}>On</b></div>
      <div className="tile">Dark mode <b style={{ fontSize: 15, display: 'inline', float: 'right' }}>Auto</b></div>
    </>
  ),
};

export default function ProtoDevice() {
  const [tab, setTab] = useState('Home');
  return (
    <div style={{ perspective: 1200 }}>
      <Tilt className="device" max={14}>
        <div className="scr">
          <div className="proto-screen" key={tab}>
            <div style={{ font: '700 18px var(--display)' }}>{tab}</div>
            {screens[tab]}
          </div>
          <div className="proto-tabs">
            {Object.keys(screens).map((k) => <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}>{k}</button>)}
          </div>
        </div>
      </Tilt>
    </div>
  );
}

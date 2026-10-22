import { ImageResponse } from 'next/og';

// Social share card (LinkedIn, WhatsApp, Facebook, X). Rendered once at build time.
export const alt = 'Shakir Hussain, full-stack web developer for European businesses';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0B1F3A', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#FFFFFF" />
            <path d="M29 19.5h-8.5a6.25 6.25 0 0 0 0 12.5h3a6.25 6.25 0 0 1 0 12.5H14.5" fill="none" stroke="#0B1F3A" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M36.5 19.5v25M49.5 19.5v25M36.5 32h13" fill="none" stroke="#0B1F3A" strokeWidth="4.6" strokeLinecap="round" />
            <rect x="14.5" y="50" width="35" height="3.6" rx="1.8" fill="#E8603C" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Shakir Hussain</div>
            <div style={{ fontSize: 18, letterSpacing: 4, color: '#F7A285' }}>FULL-STACK DEVELOPER</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>Websites and web apps</div>
          <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, color: '#F07A57' }}>for European businesses.</div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 24, color: 'rgba(255,255,255,.85)' }}>
          {['213+ websites', 'Fixed quotes in EUR', 'CET-friendly hours', 'AI chatbots'].map((t) => (
            <div key={t} style={{ padding: '10px 20px', borderRadius: 10, border: '2px solid rgba(255,255,255,.25)' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

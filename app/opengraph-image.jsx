import { ImageResponse } from 'next/og';

// Social share card (Facebook, LinkedIn, WhatsApp, X). Rendered once at build time.
export const alt = 'Shakir Hussain, full-stack web developer: websites, online stores and AI chatbots';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 70, color: '#fff',
        background: 'linear-gradient(125deg,#0E1014 0%,#1E1B4B 45%,#4C1D95 75%,#9D174D 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: '#C8F25A', color: '#14161A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>SH</div>
          shakir.dev
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Websites, online stores</div>
          <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: '#C8F25A' }}>and AI chatbots.</div>
          <div style={{ fontSize: 30, marginTop: 24, color: 'rgba(255,255,255,.8)' }}>Shakir Hussain · Full-stack web developer · Islamabad, Pakistan</div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 24 }}>
          {['213+ websites', 'Next.js & React', 'PHP & WordPress', 'AI integration'].map((t) => (
            <div key={t} style={{ padding: '10px 20px', borderRadius: 999, border: '2px solid rgba(255,255,255,.35)' }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

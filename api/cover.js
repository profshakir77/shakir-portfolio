// GET /api/cover?title=...&category=...&slug=...
// Returns a styled SVG cover image for a blog post.
// No npm dependencies, no external APIs, no API keys required.
// The gradient colour is seeded by the slug so the same post always
// gets the same colour scheme regardless of when the image is requested.

const { setCors } = require('./_util');

// Six distinct dark palettes: [bg-top, bg-bottom, accent-hex]
const PALETTES = [
  ['#0f172a', '#1e293b', '#6366f1'], // slate + indigo
  ['#0a2218', '#0d2f1c', '#10b981'], // dark green + emerald
  ['#16072c', '#0f0520', '#8b5cf6'], // dark purple + violet
  ['#041c2c', '#062236', '#06b6d4'], // dark teal + cyan
  ['#1c0a16', '#2a0d1e', '#f43f5e'], // dark rose + pink
  ['#170c01', '#221204', '#f59e0b'], // dark amber + orange
];

// Wrap text at word boundaries; returns at most maxLines lines.
function wrapText(text, charsPerLine, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const candidate = cur ? cur + ' ' + w : w;
    if (candidate.length <= charsPerLine) {
      cur = candidate;
    } else {
      if (cur) lines.push(cur);
      cur = w.length > charsPerLine ? w.slice(0, charsPerLine - 1) + '…' : w;
    }
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Simple non-crypto hash — deterministic across restarts.
function hash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (Math.imul(h, 0x01000193) >>> 0);
  }
  return h;
}

module.exports = function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const { title = 'Blog Post', category = 'Blog', slug = '' } = req.query;
  const seed = hash32(slug || title);
  const [bg1, bg2, accent] = PALETTES[seed % PALETTES.length];

  const cat = String(category || 'Blog').toUpperCase();
  const lines = wrapText(title, 30, 3);

  // Vertical layout: category at ~160, title centred in 220-450 band, author at 560.
  const lineH = 72;
  const totalH = lines.length * lineH;
  const titleStartY = Math.round(320 - totalH / 2 + lineH * 0.75);

  const titleSvg = lines
    .map((line, i) =>
      `  <text x="80" y="${titleStartY + i * lineH}" ` +
      `font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" ` +
      `font-size="58" font-weight="700" fill="#ffffff">${esc(line)}</text>`
    )
    .join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1100" cy="80" r="240" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.18"/>
  <circle cx="1050" cy="130" r="170" fill="none" stroke="${accent}" stroke-width="1" opacity="0.12"/>
  <rect x="80" y="112" width="56" height="5" rx="2.5" fill="${accent}"/>
  <text x="80" y="155"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"
    font-size="17" font-weight="600" letter-spacing="4.5" fill="${accent}">${esc(cat)}</text>
${titleSvg}
  <text x="80" y="566"
    font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"
    font-size="21" fill="rgba(255,255,255,0.4)">Shakir Hussain</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  return res.end(svg);
};

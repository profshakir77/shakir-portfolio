// Small line icons for services (no icon font, nothing extra to download).
const paths = {
  code: <><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></>,
  ai: <><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  cart: <><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></>,
  pen: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18M7 12h5M7 15h8" /></>,
  cube: <><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="m3 7 9 5 9-5M12 12v10" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 10h8M8 13h5" /></>,
  bolt: <><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></>,
  doc: <><path d="M6 2h9l4 4v16H6z" /><path d="M14 2v5h5M9 13h7M9 17h5" /></>,
  plug: <><path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0zM12 17v5" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
};

export default function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.code}
    </svg>
  );
}

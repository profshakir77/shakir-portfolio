export default function NotFound() {
  return (
    <div className="wrap pagehead" style={{ minHeight: '50vh' }}>
      <div className="kicker"><b>404</b> / Not found</div>
      <h1>This page moved or never existed.</h1>
      <p className="lede">Try the <a href="/" style={{ color: 'var(--accent)' }}>home page</a> or <a href="/work" style={{ color: 'var(--accent)' }}>my work</a>.</p>
    </div>
  );
}

import Tilt from './Tilt';

export default function ProjectCard({ p, wide }) {
  const inner = (
    <>
      <div className={'ph' + (p.mono ? ' mono' : '')}>
        {p.mono ? <span>{p.mono}</span> : <img src={p.img} alt={p.alt} loading="lazy" />}
      </div>
      <div className="body lift">
        <span className="tag">{p.tag}</span>
        <h3>{p.title}{p.isNew && <span className="new">NEW</span>}</h3>
        <p>{p.desc}</p>
        <div className="chips">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
        {p.repo ? (
          <div className="go-row">
            <a className="go" href={p.href} target="_blank" rel="noopener">Live demo ↗</a>
            <a className="go" href={p.repo} target="_blank" rel="noopener">Code on GitHub ↗</a>
          </div>
        ) : p.href && <span className="go">{p.href.includes('github.com') ? 'View on GitHub' : 'Visit site'} ↗</span>}
      </div>
    </>
  );
  const cls = 'card proj' + (wide ? ' wide' : '');
  return p.href && !p.repo
    ? <Tilt as="a" className={cls} href={p.href} target="_blank" rel="noopener">{inner}</Tilt>
    : <Tilt className={cls}>{inner}</Tilt>;
}

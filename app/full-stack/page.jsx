import ApiPlayground from '../../components/ApiPlayground';

export const metadata = {
  title: 'Full-Stack Development',
  description: 'How Shakir Hussain builds full-stack web apps: Next.js and React front ends, Node.js APIs, SQL and NoSQL databases, auth, and Vercel deployment. Includes a live API demo.',
  alternates: { canonical: '/full-stack' },
};

const layers = [
  ['Front end', 'Next.js and React with server rendering where it helps SEO, client components where it helps UX. Accessible, responsive, fast.', 'Next.js · React · Three.js'],
  ['API', 'Route handlers and Node.js services with validation, rate limits, auth (JWT/sessions) and clear error messages.', 'Node.js · Express · REST'],
  ['Data', 'Schema design that fits the product: relational for orders and money, key-value for speed, document stores where shape varies.', 'PostgreSQL · MySQL · Redis · MongoDB'],
  ['Integrations', 'Payments, couriers, email, file storage and AI APIs wired in with retries and logging.', 'Stripe · PostEx · Resend · Blob'],
  ['Deploy & run', 'Git-based deploys on Vercel, preview links for every change, monitoring and caching to keep bills small.', 'Vercel · GitHub · Analytics'],
];

export default function FullStack() {
  return (
    <div className="wrap">
      <div className="split" style={{ alignItems: 'center' }}>
        <div className="pagehead">
          <div className="kicker"><b>API</b> / Full-stack</div>
          <h1>Every layer, one developer.</h1>
          <p className="lede">From the button a customer taps to the database row it writes, I design, build and deploy the whole path. Hover the stack to pull it apart.</p>
        </div>
        <div className="iso big" aria-label="Stack diagram: database, API, UI and deployment layers" role="img">
          <div className="iso-in"><div className="layer l1">DATABASE</div><div className="layer l2">API</div><div className="layer l3">UI</div><div className="layer l4">DEPLOY</div></div>
        </div>
      </div>

      <section id="layers" style={{ paddingTop: 48 }}>
        <div className="shead"><div><div className="kicker"><b>01</b> / The layers</div><h2>What goes into a production app.</h2></div></div>
        <div className="layers">
          {layers.map(([t, d, s]) => <div className="card lrow" key={t}><b>{t}</b><p>{d}</p><div className="chips"><span>{s}</span></div></div>)}
        </div>
      </section>

      <section>
        <div className="shead">
          <div><div className="kicker"><b>02</b> / Live demo</div><h2>Call this site&apos;s real API.</h2></div>
          <p>This portfolio runs on Next.js with serverless API routes backed by Redis. These buttons send real requests from your browser right now.</p>
        </div>
        <ApiPlayground />
      </section>

      <section>
        <div className="split">
          <div>
            <div className="kicker"><b>03</b> / Under the hood</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '12px 0' }}>Small, readable, cheap to run.</h2>
            <p className="lede">The reviews endpoint you just called is a few lines: read IDs from a Redis sorted set, load each review, return only approved ones as JSON. No framework lock-in, no idle servers. The site also runs a student portal with JWT login, file uploads and an admin panel on the same pattern.</p>
          </div>
          <pre className="code"><span className="c">{'// pages/api/reviews.js (simplified)'}</span>{`
`}<span className="k">module.exports = async function</span>{` handler(req, res) {
  `}<span className="k">const</span>{` ids = `}<span className="k">await</span>{` kvRequest([`}<span className="s">&apos;ZREVRANGE&apos;</span>{`, `}<span className="s">&apos;reviews&apos;</span>{`, `}<span className="s">&apos;0&apos;</span>{`, `}<span className="s">&apos;49&apos;</span>{`]);
  `}<span className="k">const</span>{` reviews = `}<span className="k">await</span>{` Promise.all(ids.map(loadReview));
  `}<span className="c">{'// only approved reviews are public'}</span>{`
  res.status(200).json({ reviews: reviews.filter(r => r?.status === `}<span className="s">&apos;approved&apos;</span>{`) });
};`}</pre>
        </div>
      </section>

      <div className="band">
        <div><h2>Need the whole stack built?</h2><p>Send the idea. You get a written scope, fixed quote and a prototype first.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Get a quote</a><a className="btn" href="/work">See builds</a></div>
      </div>
    </div>
  );
}

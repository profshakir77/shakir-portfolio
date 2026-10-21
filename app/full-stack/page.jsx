import ApiPlayground from '../../components/ApiPlayground';
import JsonLd, { breadcrumb } from '../../components/JsonLd';

export const metadata = {
  title: 'Full-Stack Web Development (Next.js, Node.js, PHP)',
  description: 'How Shakir Hussain builds full-stack web apps: Next.js and React front ends, Node.js APIs, SQL and NoSQL databases, auth, and Vercel deployment. Includes a live API demo.',
  keywords: ['full-stack developer', 'Next.js developer', 'Node.js developer', 'PHP Laravel developer', 'web app development', 'hire full-stack developer'],
  alternates: { canonical: '/full-stack' },
};

const layers = [
  ['Front end', 'Next.js and React, rendered on the server where Google needs to read it. Works on every screen size and with a keyboard.', 'Next.js · React · Three.js'],
  ['API', 'Node.js, Express or PHP/Laravel APIs that check every input, handle logins safely and give clear error messages.', 'Node.js · Express · REST'],
  ['Data', 'I pick the database to fit the job: SQL for orders and payments, Redis for speed, MongoDB when the data changes shape a lot.', 'PostgreSQL · MySQL · Redis · MongoDB'],
  ['Integrations', 'Payments, couriers, email, file uploads and AI APIs, with retries and logs so nothing fails silently.', 'Stripe · PostEx · Resend · Blob'],
  ['Deploy & run', 'Every change gets a preview link before it goes live. Caching and monitoring keep the site fast and the hosting bill small.', 'Vercel · GitHub · Analytics'],
];

export default function FullStack() {
  return (
    <div className="wrap">
      <JsonLd data={breadcrumb('Full-Stack', '/full-stack')} />
      <div className="split" style={{ alignItems: 'center' }}>
        <div className="pagehead">
          <div className="kicker"><b>API</b> / Full-stack</div>
          <h1>I build the whole thing, <span className="grad">front to back.</span></h1>
          <p className="lede">The page your customer sees, the server behind it, the database and the hosting. One person who knows how it all fits together means fewer hand-offs and faster fixes. Hover the stack to pull it apart.</p>
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
          <p>This site runs on Next.js with small serverless APIs and a Redis database. The buttons below send real requests from your browser.</p>
        </div>
        <ApiPlayground />
      </section>

      <section>
        <div className="split">
          <div>
            <div className="kicker"><b>03</b> / Under the hood</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '12px 0' }}>Simple code that&apos;s cheap to run.</h2>
            <p className="lede">The reviews endpoint you just called is a few lines: read IDs from a Redis sorted set, load each review, return only approved ones as JSON. There&apos;s no server sitting idle and costing money. My student portal, file uploads and admin panel all work the same way.</p>
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
        <div><h2>Need the whole stack built?</h2><p>Send me the idea. You&apos;ll get a written scope and a fixed quote before anything starts.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Get a quote</a><a className="btn" href="/work">See builds</a></div>
      </div>
    </div>
  );
}

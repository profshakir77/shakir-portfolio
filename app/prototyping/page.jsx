import Compare from '../../components/Compare';
import ProtoDevice from '../../components/ProtoDevice';

export const metadata = {
  title: 'UI Prototyping & 3D',
  description: 'How Shakir Hussain prototypes web apps: wireframes, clickable prototypes, 3D and motion, then production builds.',
  alternates: { canonical: '/prototyping' },
};

const steps = [
  ['Brief', 'Goals, users and must-have features in one page. Fixed scope before design starts.'],
  ['Wireframe', 'Low-fidelity layouts for every key screen. Cheap to change, fast to agree on.'],
  ['Prototype', 'Clickable, high-fidelity screens you can test on your own phone.'],
  ['Build', 'The approved prototype becomes production code: Next.js, APIs, database.'],
  ['Launch', 'Deploy, monitor, measure, and iterate on what real users do.'],
];

export default function Prototyping() {
  return (
    <div className="wrap">
      <div className="pagehead">
        <div className="kicker"><b>UI</b> / Prototyping &amp; 3D</div>
        <h1>See it, click it, then build it.</h1>
        <p className="lede">Most project risk is in the &ldquo;that&apos;s not what I imagined&rdquo; moment. I move it to week one with wireframes and clickable prototypes, so the build matches what you approved.</p>
      </div>

      <section>
        <div className="steps">{steps.map(([t, d]) => <div className="card step" key={t}><h4>{t}</h4><p>{d}</p></div>)}</div>
      </section>

      <section>
        <div className="shead">
          <div><div className="kicker"><b>01</b> / Wireframe to UI</div><h2>Drag the handle.</h2></div>
          <p>The same screen at two stages. Agreeing on structure first keeps the visual design fast.</p>
        </div>
        <Compare />
      </section>

      <section>
        <div className="split" style={{ alignItems: 'center' }}>
          <div>
            <div className="kicker"><b>02</b> / Clickable prototype</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '12px 0' }}>Tap through it. It&apos;s live.</h2>
            <p className="lede">This phone is a working mini prototype: switch tabs, tilt it with your mouse. Clients get a link like this to try on their own device and share with their team before we write production code.</p>
            <div className="chips" style={{ marginTop: 18 }}><span>Figma</span><span>React prototypes</span><span>User testing</span><span>Design systems</span></div>
          </div>
          <ProtoDevice />
        </div>
      </section>

      <section>
        <div className="shead">
          <div><div className="kicker"><b>03</b> / 3D &amp; motion</div><h2>3D where it helps, not everywhere.</h2></div>
          <p>The model on my home page is plain Three.js: about 150 KB, loaded after the page, paused when off-screen and still for reduced-motion users.</p>
        </div>
        <div className="sgrid">
          <div className="card svc"><h3>Product viewers</h3><p>Rotate, zoom and configure a product in the browser. Good for furniture, packaging and jewelry.</p></div>
          <div className="card svc"><h3>Hero scenes</h3><p>A memorable first screen that follows the cursor, built to keep Core Web Vitals green.</p></div>
          <div className="card svc"><h3>Data in 3D</h3><p>Architecture diagrams and dashboards with depth, like the stack on my full-stack page.</p></div>
        </div>
      </section>

      <div className="band">
        <div><h2>Want a prototype before you commit?</h2><p>Send your idea. I&apos;ll quote a fixed-price prototype first.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Request a prototype</a><a className="btn" href="/">See the 3D demo</a></div>
      </div>
    </div>
  );
}

import Compare from '../../components/Compare';
import JsonLd, { breadcrumb } from '../../components/JsonLd';
import ProtoDevice from '../../components/ProtoDevice';

export const metadata = {
  title: 'UI/UX Prototyping & 3D Web Design',
  description: 'Wireframes, clickable prototypes and 3D web design before any code is written. How Shakir Hussain plans websites and apps so the final build matches what you approved.',
  keywords: ['UI UX prototyping', 'clickable prototype', 'website wireframe', 'Figma to code', '3D web design', 'Three.js developer'],
  alternates: { canonical: '/prototyping' },
};

const steps = [
  ['Brief', 'One page with your goals, your customers and the must-have features. We agree on it before any design.'],
  ['Wireframe', 'Rough grey layouts of the main screens. Easy to move things around.'],
  ['Prototype', 'Proper colours and text, and you can tap through it on your phone.'],
  ['Build', 'I turn the approved design into the real site, with the back end and database.'],
  ['Launch', 'It goes live, I watch how people use it, and we improve what needs it.'],
];

export default function Prototyping() {
  return (
    <div className="wrap">
      <JsonLd data={breadcrumb('Prototyping', '/prototyping')} />
      <div className="pagehead">
        <div className="kicker"><b>UI</b> / Prototyping &amp; 3D</div>
        <h1>Try your website <span className="grad">before I build it.</span></h1>
        <p className="lede">The worst moment in any project is hearing &ldquo;that&apos;s not what I pictured&rdquo; after the build is done. So I show you rough layouts and a clickable design in the first week. You change your mind early, when it&apos;s cheap.</p>
      </div>

      <section>
        <div className="steps">{steps.map(([t, d]) => <div className="card step" key={t}><h4>{t}</h4><p>{d}</p></div>)}</div>
      </section>

      <section>
        <div className="shead">
          <div><div className="kicker"><b>01</b> / Wireframe to UI</div><h2>Drag the handle.</h2></div>
          <p>Same screen, two stages. Once the layout is agreed, the visual design goes quickly.</p>
        </div>
        <Compare />
      </section>

      <section>
        <div className="split" style={{ alignItems: 'center' }}>
          <div>
            <div className="kicker"><b>02</b> / Clickable prototype</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '12px 0' }}>Tap through it. It&apos;s live.</h2>
            <p className="lede">This phone is a small working prototype. Tap the tabs, or move your mouse over it. Clients get a link like this to open on their own phone and share with their team before I write the real code.</p>
            <div className="chips" style={{ marginTop: 18 }}><span>Figma</span><span>React prototypes</span><span>User testing</span><span>Design systems</span></div>
          </div>
          <ProtoDevice />
        </div>
      </section>

      <section>
        <div className="shead">
          <div><div className="kicker"><b>03</b> / 3D &amp; motion</div><h2>3D where it helps, not everywhere.</h2></div>
          <p>The 3D model on my home page is plain Three.js. It loads after the rest of the page, pauses when you scroll past it, and stays still for people who turn off animations.</p>
        </div>
        <div className="sgrid">
          <div className="card svc"><h3>Product viewers</h3><p>Let customers spin and zoom a product before they buy. Works well for furniture, packaging and jewellery.</p></div>
          <div className="card svc"><h3>Hero scenes</h3><p>A first screen people remember, built so it doesn&apos;t slow the page down.</p></div>
          <div className="card svc"><h3>Data in 3D</h3><p>Diagrams and dashboards with a bit of depth, like the stack on my full-stack page.</p></div>
        </div>
      </section>

      <div className="band">
        <div><h2>Want a prototype before you commit?</h2><p>Send me your idea and I&apos;ll quote the prototype on its own, so you can decide after seeing it.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Request a prototype</a><a className="btn" href="/">See the 3D demo</a></div>
      </div>
    </div>
  );
}

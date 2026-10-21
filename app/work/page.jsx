import WorkGrid from '../../components/WorkGrid';
import { projects } from '../../lib/data';

export const metadata = {
  title: 'Work',
  description: 'Selected work by Shakir Hussain: e-commerce stores, full-stack web apps, AI tools and design prototypes.',
  alternates: { canonical: '/work' },
};

export default function Work() {
  return (
    <div className="wrap">
      <div className="pagehead">
        <div className="kicker"><b>Work</b> / Portfolio</div>
        <h1>213+ websites delivered.</h1>
        <p className="lede">Highlighted, source-available builds. The full count includes client sites under NDA or in private repos; references on request.</p>
      </div>
      <section style={{ paddingTop: 40 }}>
        <WorkGrid projects={projects} />
      </section>
      <div className="band">
        <div><h2>Like what you see?</h2><p>Yours could be the next one.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Get in touch</a><a className="btn" href="https://github.com/profshakir77" target="_blank" rel="noopener">GitHub</a></div>
      </div>
    </div>
  );
}

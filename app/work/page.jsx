import WorkGrid from '../../components/WorkGrid';
import { projects } from '../../lib/data';
import JsonLd, { breadcrumb } from '../../components/JsonLd';

export const metadata = {
  title: 'Portfolio: Websites, Online Stores & Web Apps',
  description: 'Websites, online stores, web apps and AI tools built by Shakir Hussain for clients in the US, UK and Pakistan. Next.js, React, PHP, WordPress and Shopify projects.',
  alternates: { canonical: '/work' },
};

export default function Work() {
  return (
    <div className="wrap">
      <JsonLd data={breadcrumb('Work', '/work')} />
      <div className="pagehead">
        <div className="kicker"><b>Work</b> / Portfolio</div>
        <h1>213+ websites, <span className="grad">here are a few.</span></h1>
        <p className="lede">These are the ones I can show publicly. Plenty of client work is under NDA or in private repos, and I&apos;m happy to share references if you ask.</p>
      </div>
      <section style={{ paddingTop: 40 }}>
        <WorkGrid projects={projects} />
      </section>
      <div className="band">
        <div><h2>Want something like this?</h2><p>Tell me what you have in mind and I&apos;ll reply within a day.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Get in touch</a><a className="btn" href="https://github.com/profshakir77" target="_blank" rel="noopener">GitHub</a></div>
      </div>
    </div>
  );
}

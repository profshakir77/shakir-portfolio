import Hero3D from '../components/Hero3D';
import ProjectCard from '../components/ProjectCard';
import Reviews from '../components/Reviews';
import Tilt from '../components/Tilt';
import Skills from '../components/Skills';
import Icon from '../components/Icon';
import JsonLd from '../components/JsonLd';
import { projects, services, marquee, labs, faqs, site } from '../lib/data';

export const metadata = {
  title: { absolute: 'Shakir Hussain | Full-Stack Web Developer, AI Websites & Online Stores' },
  description: 'Freelance full-stack web developer in Islamabad, Pakistan. Next.js, React, PHP and WordPress websites, online stores, AI chatbots and 3D web design for clients in the US, UK and Europe. 213+ websites since 2018.',
  alternates: { canonical: '/' },
  keywords: ['full-stack web developer', 'web developer Pakistan', 'freelance web developer Islamabad', 'Next.js developer', 'AI website developer', 'AI chatbot for website', 'WooCommerce developer', 'Shopify developer', 'hire web developer remote'],
};

const ld = [
  {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Shakir Hussain, Web Development', url: site.url,
    image: `${site.url}/shakir-profile.jpg`, telephone: site.phoneE164, email: site.email, priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
    areaServed: ['Worldwide', 'United States', 'United Kingdom', 'European Union', 'Australia', 'Pakistan'],
    founder: { '@type': 'Person', name: 'Shakir Hussain' },
    sameAs: [site.linkedin, site.github, site.facebook, site.instagram],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Web development services', itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.text } })) },
  },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Shakir Hussain', url: site.url },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
];

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  return (
    <>
      <JsonLd data={ld} />
      <section className="hero" id="top" style={{ padding: 0 }}>
        <div className="mesh" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div>
            <span className="status"><i />Available for new projects</span>
            <h1>Hi, I&apos;m Shakir. I build websites that <span className="grad">bring you work.</span></h1>
            <p className="lede">I&apos;m a full-stack web developer in Islamabad. Since 2018 I&apos;ve built 213+ websites, online stores and web apps for businesses in the US, UK, Europe and Pakistan. These days that often includes an AI chatbot or a bit of 3D.</p>
            <div className="cta">
              <a className="btn primary" href="/contact.html">Tell me about your project &rarr;</a>
              <a className="btn" href="/work">See my work</a>
            </div>
            <div className="trust">
              <span><b>213+</b> sites delivered</span><span><b>8 yrs</b> client work</span><span><b>7+ yrs</b> teaching CS</span>
            </div>
          </div>
          <Hero3D />
        </div>
      </section>

      <div className="logos" aria-label="Technologies I use">
        <div className="track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="logo-chip"><img src={`/icons/${m}.svg`} alt={i < marquee.length ? m.split('-')[0] : ''} width="28" height="28" loading="lazy" /></span>
          ))}
        </div>
      </div>

      <section id="services">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>01</b> / What I do</div><h2>Pick one, or hand me the whole project.</h2></div>
            <p>Every job starts with a short call and a fixed, written quote. No surprises at the end. <a href="/services.html">Packages and price estimator &rarr;</a></p>
          </div>
          <div className="sgrid" style={{ perspective: 1200 }}>
            {services.map((s, i) => (
              <Tilt key={s.title} className={`card svc c${i}`} max={6}>
                <span className="svc-ico lift"><Icon name={s.icon} size={24} /></span>
                <h3 className="lift">{s.title}</h3><p>{s.text}</p><a href={s.href}>{s.link} &rarr;</a>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <a href="/ai-websites" className="ai-band">
            <div>
              <div className="kicker"><b>NEW</b> / AI for your website</div>
              <h2>A chatbot that actually knows your business.</h2>
              <p>I set up assistants that answer from your own pages and price lists, book enquiries and pass tricky questions to you. Also smart search, document automation and AI integrations.</p>
            </div>
            <span className="btn primary">See AI services &rarr;</span>
          </a>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>02</b> / Skills</div><h2>The tools I use every week.</h2></div>
            <p>I pick the stack that suits the project and the budget, not the one that&apos;s trending.</p>
          </div>
          <Skills />
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>03</b> / Recent work</div><h2>A few projects I&apos;m proud of.</h2></div>
            <p>Some client work is under NDA, so this is a sample. <a href="/work">See all projects &rarr;</a></p>
          </div>
          <div className="pgrid">{featured.map((p, i) => <ProjectCard key={p.slug} p={p} wide={i === 0 || p.wide} />)}</div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>04</b> / How I work</div><h2>You see it before I build it.</h2></div>
            <p>Hover the cards. They tilt, because I like small details.</p>
          </div>
          <div className="split" style={{ perspective: 1200 }}>
            <Tilt as="a" href="/prototyping" className="card teaser t-proto">
              <div className="kicker lift"><b>UI</b> / Prototyping</div>
              <h3 className="lift">Click through your site before it exists.</h3>
              <p>I start with wireframes, then a clickable design you can open on your phone. Changing a layout then takes minutes, not days.</p>
              <span className="go">How prototyping works &rarr;</span>
            </Tilt>
            <Tilt as="a" href="/full-stack" className="card teaser t-stack">
              <div className="kicker lift"><b>API</b> / Full-stack</div>
              <h3 className="lift">Front end, back end, database, hosting.</h3>
              <div className="iso" aria-hidden="true" style={{ height: 190, marginTop: 8 }}>
                <div className="iso-in" style={{ top: '78%', transform: 'translate(-50%,-50%) rotateX(58deg) rotateZ(-38deg) scale(.62)' }}>
                  <div className="layer l1">DB</div><div className="layer l2">API</div><div className="layer l3">UI</div><div className="layer l4">Deploy</div>
                </div>
              </div>
              <span className="go">See the stack and a live API demo &rarr;</span>
            </Tilt>
          </div>
        </div>
      </section>

      <section id="teaching">
        <div className="wrap">
          <div className="shead"><div><div className="kicker"><b>05</b> / Teaching</div><h2>I also teach this stuff.</h2></div><p>Explaining code to a room of students every week keeps me honest about how I write it.</p></div>
          <div className="teach">
            <div className="card">
              <h3>Labs I run at Air University, Islamabad</h3>
              <p>Hands-on, project-based labs for BS Computer Science and IT students.</p>
              <div className="labs">{labs.map((l) => <span key={l}>{l}</span>)}</div>
            </div>
            <div className="card">
              <h3>Outside the lab</h3>
              <ul className="tlist">
                <li><b>Final-year projects:</b> helping students turn an idea into something that works</li>
                <li><b>Mentoring:</b> career paths, FYP ideas and internships</li>
                <li><b>7+ years</b> teaching O Level, A Level and FSc computing before that</li>
                <li><b>MS Computer Science</b> in progress at Air University</li>
              </ul>
              <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                <a className="btn sm" href="/mentorship.html">Mentorship &rarr;</a><a className="btn sm" href="/student-portal.html">Student portal &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>06</b> / Reviews</div><h2>What clients say.</h2></div>
            <p>Worked with me before? <a href="/leave-review.html">Leave a review &rarr;</a></p>
          </div>
          <Reviews />
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div className="shead"><div><div className="kicker"><b>07</b> / FAQ</div><h2>Questions people usually ask.</h2></div></div>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="band">
          <div><h2>Got a project in mind?</h2><p>Send me a message with what you need and roughly when. I reply within a day, usually sooner.</p></div>
          <div className="acts"><a className="btn primary" href="/contact.html">Send a message</a><a className="btn" href={site.whatsapp} target="_blank" rel="noopener">WhatsApp me</a></div>
        </div>
      </div>
    </>
  );
}

import Hero3D from '../components/Hero3D';
import ProjectCard from '../components/ProjectCard';
import Reviews from '../components/Reviews';
import Tilt from '../components/Tilt';
import Skills from '../components/Skills';
import Icon from '../components/Icon';
import JsonLd from '../components/JsonLd';
import { projects, services, marquee, labs, faqs, plans, whyEu, site } from '../lib/data';

export const metadata = {
  title: { absolute: 'Shakir Hussain | Full-Stack Web Developer for EU Businesses' },
  description: 'Full-stack web developer for European businesses: websites, online stores, web apps and AI chatbots. Fixed quotes in EUR, CET-friendly hours.',
  alternates: { canonical: '/' },
  keywords: ['freelance web developer Europe', 'full-stack developer remote', 'Next.js developer for hire', 'web developer Germany', 'web developer Netherlands', 'AI chatbot for website', 'WooCommerce developer EU', 'hire remote web developer'],
};

const whyMe = [
  ['chart', 'I build for your business goal, not just the code.', 'Every site starts with what you want visitors to do: call, book, buy or enquire. The pages, copy and features are planned around that.'],
  ['pen', 'Design and function together.', 'A layout that looks good where every element also has a job, so visitors find what they need and act on it.'],
  ['code', 'Front to back, one developer.', 'Interface, server, database and hosting handled by one person, so there are fewer hand-offs and faster fixes.'],
  ['cart', 'E-commerce that grows with you.', 'Stores built so you can add products, payment options and couriers later without starting again.'],
  ['bolt', 'Speed and search built in.', 'Page speed, Core Web Vitals and on-page SEO are handled during the build, not bolted on at the end.'],
];

const ld = [
  {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Shakir Hussain, Web Development', url: site.url,
    image: `${site.url}/favicon-512.png`, logo: `${site.url}/favicon-512.png`, telephone: site.phoneE164, email: site.email, priceRange: '€€',
    currenciesAccepted: 'EUR', address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
    areaServed: [{ '@type': 'Place', name: 'European Union' }, { '@type': 'Country', name: 'United Kingdom' }, { '@type': 'Country', name: 'Germany' }, { '@type': 'Country', name: 'Netherlands' }, { '@type': 'Country', name: 'Ireland' }],
    founder: { '@type': 'Person', name: 'Shakir Hussain' },
    sameAs: [site.linkedin, site.github, site.facebook, site.instagram],
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Web development packages', itemListElement: plans.map((p) => ({ '@type': 'Offer', name: p.name, priceCurrency: 'EUR', price: p.price.replace(/[^\d]/g, ''), description: p.desc })) },
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
        <div className="wrap hero-grid">
          <div>
            <span className="status"><i />Available for new projects in Europe</span>
            <h1>Websites and web apps that win you <span className="em">clients.</span></h1>
            <p className="lede">I&apos;m Shakir, a full-stack developer working with businesses across Europe. I plan, design and build fast websites, online stores and custom web apps, with clear fixed prices in EUR and calls that fit your working day.</p>
            <div className="cta">
              <a className="btn primary" href="/contact.html">Get a fixed quote &rarr;</a>
              <a className="btn" href="/work">See my work</a>
            </div>
            <div className="trust">
              <span><b>213+</b>websites delivered</span>
              <span><b>2018</b>building for clients</span>
              <span><b>EUR</b>fixed quotes</span>
              <span><b>CET</b>friendly hours</span>
            </div>
          </div>
          <Hero3D />
        </div>
      </section>

      <div className="logos" aria-hidden="true">
        <div className="track">
          {[...marquee, ...marquee].map((m, i) => <span key={i} className="logo-chip" style={{ backgroundImage: `url(/icons/${m}.svg)` }} />)}
        </div>
      </div>

      <section id="services">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">What I do</div><h2>One developer for the whole project, or the part you need.</h2></div>
            <p>Every job starts with a short call and a written scope. You know the price before anything starts. <a href="/services.html">Services &amp; prices</a></p>
          </div>
          <div className="sgrid" style={{ perspective: 1200 }}>
            {services.map((s) => (
              <Tilt key={s.title} className="card svc" max={5}>
                <span className="svc-ico lift"><Icon name={s.icon} size={22} /></span>
                <h3 className="lift">{s.title}</h3><p>{s.text}</p><a href={s.href}>{s.link} &rarr;</a>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section id="why">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">Working together</div><h2>Built for clients in Europe.</h2></div>
            <p>Remote work only works when it&apos;s easy. Here&apos;s how I keep it that way.</p>
          </div>
          <div className="why">
            {whyEu.map(([t, d], i) => <div key={t}><span className="num">0{i + 1}</span><h4>{t}</h4><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">Selected work</div><h2>Recent projects.</h2></div>
            <p>Some client work is under NDA, so this is a sample. Two free tools are live for you to try. <a href="/work">All projects</a></p>
          </div>
          <div className="pgrid">{featured.map((p, i) => <ProjectCard key={p.slug} p={p} wide={i === 0 || p.wide} />)}</div>
        </div>
      </section>

      <section id="pricing">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">Pricing</div><h2>Clear starting prices.</h2></div>
            <p>Every project gets a fixed quote after a short call. Ongoing work and changes are €50 to €65 per hour. <a href="/services.html#estimate">Price estimator</a></p>
          </div>
          <div className="pricing">
            {plans.map((p) => (
              <div key={p.name} className={'card plan' + (p.pop ? ' pop' : '')}>
                <h3>{p.name}</h3>
                <div className="price"><small>from </small>{p.price}</div>
                <p>{p.desc}</p>
                <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                <a className={'btn' + (p.pop ? ' primary' : '')} href="/contact.html">Request a quote</a>
              </div>
            ))}
          </div>
          <p className="price-note">Prices exclude VAT where applicable. Invoices in EUR for clients in the EU, UK and US.</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <a href="/ai-websites" className="ai-band">
            <div>
              <div className="kicker">AI for your website</div>
              <h2>A chatbot that actually knows your business.</h2>
              <p>Assistants that answer from your own pages and price lists, qualify enquiries and hand tricky questions to your team. Plus smart search, document automation and AI integrations.</p>
            </div>
            <span className="btn">See AI services &rarr;</span>
          </a>
        </div>
      </section>

      <section id="skills">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">Skills</div><h2>The tools I use every week.</h2></div>
            <p>I choose the stack that suits your project and budget, not the one that&apos;s trending.</p>
          </div>
          <Skills />
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">How I work</div><h2>You see it before I build it.</h2></div>
          </div>
          <div className="split" style={{ perspective: 1200 }}>
            <Tilt as="a" href="/prototyping" className="card teaser">
              <div className="kicker lift">Prototyping</div>
              <h3 className="lift">Click through your site before it exists.</h3>
              <p>Wireframes first, then a clickable design you can open on your phone. Changing a layout takes minutes, not days.</p>
              <span className="go">How prototyping works &rarr;</span>
            </Tilt>
            <Tilt as="a" href="/full-stack" className="card teaser">
              <div className="kicker lift">Full-stack</div>
              <h3 className="lift">Front end, back end, database, hosting.</h3>
              <div className="iso" aria-hidden="true" style={{ height: 190, marginTop: 8 }}>
                <div className="iso-in" style={{ top: '78%', transform: 'translate(-50%,-50%) rotateX(58deg) rotateZ(-38deg) scale(.62)' }}>
                  <div className="layer l1">DB</div><div className="layer l2">API</div><div className="layer l3">UI</div><div className="layer l4">DEPLOY</div>
                </div>
              </div>
              <span className="go">See the stack and a live API demo &rarr;</span>
            </Tilt>
          </div>
        </div>
      </section>

      <section id="why-me">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">Why work with me</div><h2>What you get on every project.</h2></div>
            <p>Five things I hold myself to, whether it&apos;s a one-page site or a full web app.</p>
          </div>
          <div className="whyme">
            {whyMe.map(([icon, t, d], i) => (
              <Tilt key={t} className={'card wm' + (i === 0 ? ' big' : '')} max={9}>
                <span className="wm-ico lift"><Icon name={icon} size={24} /></span>
                <span className="wm-n lift">0{i + 1}</span>
                <h3 className="lift">{t}</h3>
                <p>{d}</p>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker">Reviews</div><h2>What clients say.</h2></div>
            <p>Worked with me before? <a href="/leave-review.html">Leave a review</a></p>
          </div>
          <Reviews />
        </div>
      </section>

      <section id="teaching">
        <div className="wrap">
          <div className="shead"><div><div className="kicker">Teaching</div><h2>I also teach this.</h2></div><p>Explaining code to students every week keeps my own work clear and well documented.</p></div>
          <div className="teach">
            <div className="card">
              <h3>Labs I run at Air University, Islamabad</h3>
              <p>Hands-on, project-based labs for BS Computer Science and IT students.</p>
              <div className="labs">{labs.map((l) => <span key={l}>{l}</span>)}</div>
            </div>
            <div className="card">
              <h3>Outside the lab</h3>
              <ul className="tlist">
                <li><b>Final-year projects:</b> helping students turn ideas into working products</li>
                <li><b>Mentoring:</b> career paths, project ideas and internships</li>
                <li><b>7+ years</b> teaching O Level, A Level and FSc computing</li>
                <li><b>MS Computer Science</b> in progress at Air University</li>
              </ul>
              <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                <a className="btn sm" href="/mentorship">Mentorship</a><a className="btn sm" href="/student-portal.html">Student portal</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div className="shead"><div><div className="kicker">FAQ</div><h2>Questions clients usually ask.</h2></div></div>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="band">
          <div><h2>Let&apos;s talk about your project.</h2><p>Send a few lines about what you need and your timeline. You&apos;ll get a reply within one working day, with next steps and a rough price.</p></div>
          <div className="acts"><a className="btn primary" href="/contact.html">Get a fixed quote</a><a className="btn" href={`mailto:${site.email}`}>Email me</a></div>
        </div>
      </div>
    </>
  );
}

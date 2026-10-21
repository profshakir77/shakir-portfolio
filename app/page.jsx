import Hero3D from '../components/Hero3D';
import ProjectCard from '../components/ProjectCard';
import Reviews from '../components/Reviews';
import Tilt from '../components/Tilt';
import { projects, services, stack, labs } from '../lib/data';

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  return (
    <>
      <section className="hero" id="top" style={{ padding: 0 }}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div>
            <span className="status"><i />Available for remote &amp; international projects</span>
            <h1>Full-stack apps, <em>3D experiences</em> and prototypes that ship.</h1>
            <p className="lede">I&apos;m Shakir Hussain, a full-stack web developer and Computer Science educator in Islamabad. Since 2018 I&apos;ve delivered 213+ websites for clients worldwide, from the first wireframe to production.</p>
            <div className="cta">
              <a className="btn primary" href="/contact.html">Start a project &rarr;</a>
              <a className="btn" href="/work">See my work</a>
            </div>
          </div>
          <Hero3D />
        </div>
      </section>

      <div className="wrap">
        <div className="stats">
          <div className="stat"><b>213+</b><span>Websites delivered</span></div>
          <div className="stat"><b>2018</b><span>Building for clients since</span></div>
          <div className="stat"><b>7+ yrs</b><span>Teaching Computer Science</span></div>
          <div className="stat"><b>Remote</b><span>US, UK, EU, AU time zones</span></div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="track">{[...stack, ...stack].map((s, i) => <span key={i}>{s}</span>)}</div>
      </div>

      <section>
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>01</b> / How I work</div><h2>Prototype it, build it full-stack, make it feel alive.</h2></div>
            <p>Three things I bring to every build. Hover the cards: they&apos;re 3D too.</p>
          </div>
          <div className="split" style={{ perspective: 1200 }}>
            <Tilt as="a" href="/prototyping" className="card teaser">
              <div className="kicker lift"><b>UI</b> / Prototyping</div>
              <h3 className="lift">See it and click it before it&apos;s coded.</h3>
              <p>Wireframes, then clickable prototypes you can put in front of users. Changes cost minutes, not sprints.</p>
              <span className="go">Explore the process &rarr;</span>
            </Tilt>
            <Tilt as="a" href="/full-stack" className="card teaser">
              <div className="kicker lift"><b>API</b> / Full-stack</div>
              <h3 className="lift">One developer, every layer.</h3>
              <div className="iso" aria-hidden="true" style={{ height: 190, marginTop: 8 }}>
                <div className="iso-in" style={{ top: '78%', transform: 'translate(-50%,-50%) rotateX(58deg) rotateZ(-38deg) scale(.62)' }}>
                  <div className="layer l1">DB</div><div className="layer l2">API</div><div className="layer l3">UI</div><div className="layer l4">Deploy</div>
                </div>
              </div>
              <span className="go">See the stack + live API demo &rarr;</span>
            </Tilt>
          </div>
        </div>
      </section>

      <section id="work">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>02</b> / Selected work</div><h2>Stores, apps and tools in production.</h2></div>
            <p>A sample of 213+ builds. <a href="/work" style={{ color: 'var(--accent)' }}>See all work &rarr;</a></p>
          </div>
          <div className="pgrid">{featured.map((p, i) => <ProjectCard key={p.slug} p={p} wide={i === 0 || p.wide} />)}</div>
        </div>
      </section>

      <section id="services">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>03</b> / Services</div><h2>Hire me for one layer, or the whole build.</h2></div>
            <p>Fixed quotes, a written scope, weekly updates and a clean handover. <a href="/services.html" style={{ color: 'var(--accent)' }}>Packages &amp; estimator &rarr;</a></p>
          </div>
          <div className="sgrid" style={{ perspective: 1200 }}>
            {services.map((s, i) => (
              <Tilt key={s.title} className="card svc" max={6}>
                <div className="n">0{i + 1}</div><h3 className="lift">{s.title}</h3><p>{s.text}</p><a href={s.href}>{s.link} &rarr;</a>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section id="teaching">
        <div className="wrap">
          <div className="shead"><div><div className="kicker"><b>04</b> / Teaching &amp; mentorship</div><h2>Helping the next developers ship real projects.</h2></div></div>
          <div className="teach">
            <div className="card">
              <h3>Labs I run at Air University, Islamabad</h3>
              <p>Hands-on, project-based lab teaching across the BS Computer Science and IT programs.</p>
              <div className="labs">{labs.map((l) => <span key={l}>{l}</span>)}</div>
            </div>
            <div className="card">
              <h3>Beyond the classroom</h3>
              <ul className="tlist">
                <li><b>Final-year projects:</b> guiding BS students from idea to working product</li>
                <li><b>Career mentoring:</b> career paths, FYP ideas and internships</li>
                <li><b>7+ years</b> teaching O Level, A Level and FSc computing</li>
                <li><b>MS Computer Science</b> in progress at Air University</li>
              </ul>
              <div className="cta" style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                <a className="btn sm" href="/mentorship.html">Mentorship &rarr;</a><a className="btn sm" href="/student-portal.html">Student portal &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>05</b> / Client reviews</div><h2>What clients say.</h2></div>
            <p><a href="/leave-review.html" style={{ color: 'var(--accent)' }}>Leave a review &rarr;</a></p>
          </div>
          <Reviews />
        </div>
      </section>

      <div className="wrap">
        <div className="band">
          <div><h2>Have a project in mind? Let&apos;s build it.</h2><p>Tell me what you need and your timeline. I usually reply within 24 hours.</p></div>
          <div className="acts"><a className="btn primary" href="/contact.html">Get in touch</a><a className="btn" href="https://wa.me/923059494585" target="_blank" rel="noopener">WhatsApp</a></div>
        </div>
      </div>
    </>
  );
}

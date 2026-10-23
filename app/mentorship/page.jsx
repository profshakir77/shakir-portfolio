import Mentor3D from '../../components/Mentor3D';
import Tilt from '../../components/Tilt';
import JsonLd, { breadcrumb } from '../../components/JsonLd';
import { Team, StudentProjects } from '../../components/MentorLive';
import { site } from '../../lib/data';

export const metadata = {
  title: 'Mentorship Program for CS Students and New Developers',
  description: 'Hands-on mentorship from Shakir Hussain, full-stack developer and Demonstrator in Computer Science at Air University. Final-year projects, portfolio websites and freelance readiness, with real projects you can show.',
  keywords: ['web development mentorship', 'final year project help', 'CS student mentor Islamabad', 'learn full-stack development', 'freelance web developer mentoring'],
  alternates: { canonical: '/mentorship' },
};

const pillars = [
  ['01', 'Real projects, not tutorials', 'You build something people can use: a client-style website, a web app or your final-year project. Every week ends with working code.'],
  ['02', 'Code reviews like a real team', 'Pull requests, feedback on structure and naming, and the habits that make your code easy for others to read and trust.'],
  ['03', 'Ship it live', 'Git, GitHub, environment variables, databases and deployment on Vercel. Your project gets a real link you can share.'],
  ['04', 'Portfolio and freelancing', 'Turn your work into a portfolio, write project case studies and learn how to price, quote and talk to your first clients.'],
];

const tracks = [
  { tag: 'Track A', title: 'Final-year project', text: 'From idea and proposal to a working, documented product you can defend with confidence.', chips: ['Scope & proposal', 'Architecture', 'Testing', 'Defence prep'] },
  { tag: 'Track B', title: 'Full-stack web dev', text: 'Front end to database: React or Next.js, a Node.js or PHP API, SQL or MongoDB, deployed live.', chips: ['React / Next.js', 'Node.js', 'SQL / MongoDB', 'Vercel'] },
  { tag: 'Track C', title: 'Freelance-ready', text: 'Build two portfolio pieces, set up your profiles and learn the client process from first message to handover.', chips: ['Portfolio', 'Proposals', 'Pricing', 'Client calls'] },
];

const steps = [
  ['Apply', 'Create a student account in the portal and tell me your goal.'],
  ['Plan', 'We agree on one project and a simple weekly plan.'],
  ['Build', 'Weekly check-ins, code reviews and help when you get stuck.'],
  ['Showcase', 'Your approved project goes live on this page and your portfolio.'],
];

const faqs = [
  ['Who is the mentorship for?', 'BS Computer Science and IT students, final-year project groups and self-taught developers who want to build real, deployable work.'],
  ['Do I need experience?', 'Basic programming is enough. We pick a project that matches your level and grow it from there.'],
  ['How does my work appear here?', 'Submit your project from the student portal. Once I review and approve it, it shows on this page with your name and links.'],
  ['Is it online?', 'Yes. Sessions and reviews run online, so you can join from anywhere. Students at Air University can also meet during lab hours.'],
];

export default function Mentorship() {
  return (
    <>
      <JsonLd data={[breadcrumb('Mentorship', '/mentorship'), { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }]} />
      <section className="hero mhero" style={{ padding: 0 }}>
        <div className="wrap hero-grid">
          <div className="mhero-copy">
            <span className="status"><i />Mentee intake open</span>
            <h1>Learn by building <span className="em">real things.</span></h1>
            <p className="lede">A hands-on mentorship program for CS students and new developers. You build real projects, get honest code reviews and ship them live, guided by someone who has delivered 213+ websites and works as a Demonstrator in the Computer Science department at Air University.</p>
            <div className="cta">
              <a className="btn primary" href="/student-portal.html">Join as a student &rarr;</a>
              <a className="btn" href="#team">Meet the team</a>
            </div>
            <div className="trust">
              <span><b>213+</b>sites shipped</span>
              <span><b>7+ yrs</b>teaching CS</span>
              <span><b>8</b>university labs</span>
              <span><b>1:1</b>code reviews</span>
            </div>
          </div>
          <Mentor3D />
        </div>
      </section>

      <section id="program">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>01</b> / The program</div><h2>What you get as a mentee.</h2></div>
            <p>Small groups and direct feedback. The goal is simple: finish with work you are proud to show an employer or a client.</p>
          </div>
          <div className="pillars">
            {pillars.map(([n, t, d]) => (
              <Tilt key={n} className="card pillar" max={10}>
                <span className="pnum lift">{n}</span>
                <h3 className="lift">{t}</h3>
                <p>{d}</p>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section id="tracks">
        <div className="wrap">
          <div className="shead"><div><div className="kicker"><b>02</b> / Tracks</div><h2>Pick the path that fits your goal.</h2></div></div>
          <div className="tracks">
            {tracks.map((t, i) => (
              <Tilt key={t.title} className={'card track3d' + (i === 1 ? ' hot' : '')} max={7}>
                <span className="tag lift">{t.tag}</span>
                <h3 className="lift">{t.title}</h3>
                <p>{t.text}</p>
                <div className="chips">{t.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <div className="shead"><div><div className="kicker"><b>03</b> / How it works</div><h2>Four steps from sign-up to showcase.</h2></div></div>
          <ol className="path">
            {steps.map(([t, d], i) => (
              <li key={t} className="card"><span className="dot">{i + 1}</span><h4>{t}</h4><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="team">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>04</b> / The team</div><h2>Meet the mentees.</h2></div>
            <p>Students currently in the program. Flip a card to read more about them.</p>
          </div>
          <Team />
        </div>
      </section>

      <section id="projects">
        <div className="wrap">
          <div className="shead">
            <div><div className="kicker"><b>05</b> / Showcase</div><h2>Projects built by mentees.</h2></div>
            <p>Submitted through the <a href="/student-portal.html">student portal</a> and approved for the showcase.</p>
          </div>
          <StudentProjects />
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div className="shead"><div><div className="kicker"><b>06</b> / FAQ</div><h2>Questions students ask.</h2></div></div>
          <div className="faq">
            {faqs.map(([q, a]) => <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="band">
          <div><h2>Ready to build something real?</h2><p>Create your student account, tell me your goal and we will plan your first project together.</p></div>
          <div className="acts"><a className="btn primary" href="/student-portal.html">Join as a student</a><a className="btn" href={site.whatsapp} target="_blank" rel="noopener">Ask on WhatsApp</a></div>
        </div>
      </div>
    </>
  );
}

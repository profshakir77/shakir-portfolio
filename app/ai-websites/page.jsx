import Icon from '../../components/Icon';
import Tilt from '../../components/Tilt';
import JsonLd, { breadcrumb } from '../../components/JsonLd';
import { aiServices, site } from '../../lib/data';

export const metadata = {
  title: 'AI Websites, Chatbots & AI Integration',
  description: 'AI chatbots trained on your own content, AI-powered websites, smart search and document automation. Built by Shakir Hussain, full-stack developer in Islamabad, for businesses worldwide.',
  alternates: { canonical: '/ai-websites' },
  keywords: ['AI website developer', 'AI chatbot for website', 'ChatGPT chatbot for business', 'AI integration developer', 'OpenAI API developer', 'AI web development Pakistan'],
};

const icons = ['chat', 'ai', 'doc', 'pen', 'plug', 'chart'];

const steps = [
  ['Talk', 'We look at where your team loses time: repeated questions, copy-pasting, slow search.'],
  ['Small test', 'I build one useful piece first, like a chatbot on five of your pages, so you can judge it with real visitors.'],
  ['Connect', 'Hook it into your site, CRM, WhatsApp or email, with limits so costs stay predictable.'],
  ['Watch & tune', 'Read what people ask, fix wrong answers, and only then grow it.'],
];

export default function AiWebsites() {
  const ld = [
    breadcrumb('AI Websites', '/ai-websites'),
    { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'AI website development', provider: { '@type': 'Person', name: 'Shakir Hussain', url: site.url }, areaServed: 'Worldwide',
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'AI services', itemListElement: aiServices.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.t, description: s.d } })) } },
  ];
  return (
    <div className="wrap">
      <JsonLd data={ld} />
      <div className="pagehead">
        <div className="kicker"><b>AI</b> / Websites &amp; automation</div>
        <h1>AI that helps your customers, <span className="grad">not just a gimmick.</span></h1>
        <p className="lede">Most businesses don&apos;t need a robot on every page. They need fewer repeated emails, faster answers for customers, and less copy-pasting. That&apos;s the kind of AI work I do.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
          <a className="btn primary" href="/contact.html">Ask about an AI project</a>
          <a className="btn" href={site.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>

      <section>
        <div className="sgrid" style={{ perspective: 1200 }}>
          {aiServices.map((s, i) => (
            <Tilt key={s.t} className={`card svc c${i}`} max={6}>
              <span className="svc-ico lift"><Icon name={icons[i]} size={24} /></span>
              <h3 className="lift">{s.t}</h3><p>{s.d}</p>
            </Tilt>
          ))}
        </div>
      </section>

      <section>
        <div className="split" style={{ alignItems: 'center' }}>
          <div>
            <div className="kicker"><b>01</b> / Example</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', margin: '12px 0' }}>What a website chatbot looks like.</h2>
            <p className="lede">It reads your own pages, so it answers with your prices and policies, not made-up ones. When it isn&apos;t sure, it says so and offers to put the visitor in touch with you.</p>
          </div>
          <div className="card chat-demo" aria-label="Example chatbot conversation">
            <div className="msg user">Do you deliver to Lahore, and how long does it take?</div>
            <div className="msg bot">Yes, we deliver across Pakistan with PostEx. Lahore orders usually arrive in 2 to 3 working days. Want me to check stock for something?</div>
            <div className="msg user">Can I return a ring if it doesn&apos;t fit?</div>
            <div className="msg bot">You can exchange within 7 days if it&apos;s unworn. I&apos;ve noted your question for the team too, they&apos;ll confirm on WhatsApp.</div>
            <small>Made-up example for a jewellery store, to show the style of answers.</small>
          </div>
        </div>
      </section>

      <section>
        <div className="shead"><div><div className="kicker"><b>02</b> / How it goes</div><h2>Start small, grow what works.</h2></div></div>
        <div className="steps" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>{steps.map(([t, d]) => <div className="card step" key={t}><h4>{t}</h4><p>{d}</p></div>)}</div>
      </section>

      <section>
        <div className="shead"><div><div className="kicker"><b>03</b> / Built with</div><h2>Tools behind the AI work.</h2></div></div>
        <div className="chips big">
          {['OpenAI API', 'Claude API', 'Embeddings & vector search', 'Next.js API routes', 'Node.js', 'Python', 'Redis', 'PostgreSQL', 'WhatsApp & email hand-off', 'Usage limits & logging'].map((t) => <span key={t}>{t}</span>)}
        </div>
      </section>

      <div className="band">
        <div><h2>Not sure if AI fits your business?</h2><p>Tell me what eats your team&apos;s time. If AI isn&apos;t the answer, I&apos;ll tell you that too.</p></div>
        <div className="acts"><a className="btn primary" href="/contact.html">Send me a message</a><a className="btn" href="/work">See my work</a></div>
      </div>
    </div>
  );
}

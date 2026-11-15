import ProjectCard from '../../components/ProjectCard';
import JsonLd, { breadcrumb } from '../../components/JsonLd';
import { gulfPlans, gulfPoints, projects, site } from '../../lib/data';

export const metadata = {
  title: 'Web Design Dubai, Sharjah & Ajman | Salon & Business Websites in AED',
  description: 'Affordable web design for UAE businesses in Dubai, Sharjah and Ajman. Salon, clinic, restaurant and shop websites in English and Arabic, with WhatsApp booking and prices from AED 1,500. Free homepage demo first.',
  alternates: { canonical: '/web-design-uae' },
  keywords: ['web design Dubai', 'website design Sharjah', 'web designer Ajman', 'salon website Dubai', 'affordable website UAE', 'Arabic English website', 'WhatsApp booking website', 'web developer UAE', 'website price AED'],
  openGraph: { title: 'Web Design for UAE Businesses | From AED 1,500', description: 'Salon, clinic and shop websites in English and Arabic with WhatsApp booking. Free homepage demo first.', url: '/web-design-uae', images: ['/work/uae-salons-mockup.jpg'] },
};

const faqs = [
  ['How much does a website cost in the UAE?', 'A one-page site for a salon, clinic or shop starts at AED 1,500. A complete multi-page business website is AED 2,500, and a premium site with 3D design and online booking starts at AED 4,500. You get a fixed price before work starts.'],
  ['Can my website be in English and Arabic?', 'Yes. I build bilingual sites with proper right-to-left Arabic layout and fonts, so every customer can read your services and prices.'],
  ['Can customers book on WhatsApp?', 'Yes. Every service and offer can open WhatsApp with a ready-written message, so customers book in one tap. This is how most UAE customers prefer to book.'],
  ['Do I see the design before I pay?', 'Yes. I make a free demo of your homepage with your name, services and reviews. You only pay if you want to go ahead.'],
  ['How long does it take?', 'A one-page site is ready in 3 to 5 days. A multi-page business website takes about 1 week.'],
  ['Do you work with businesses in Dubai, Sharjah and Ajman?', 'Yes. I work remotely with businesses across the UAE. Pakistan is only 1 hour ahead of the UAE, so we work in the same hours on WhatsApp.'],
];

export default function WebDesignUae() {
  const work = projects.filter((p) => ['uae-salons', 'hafsa', 'maison', 'comfort'].includes(p.slug));
  const ld = [
    breadcrumb('Web Design UAE', '/web-design-uae'),
    { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Shakir Hussain Web Design for UAE Businesses', url: `${site.url}/web-design-uae`, image: `${site.url}/work/uae-salons-mockup.jpg`,
      priceRange: 'AED 1,500 to AED 4,500', telephone: site.phoneE164, email: site.email,
      areaServed: [{ '@type': 'City', name: 'Dubai' }, { '@type': 'City', name: 'Sharjah' }, { '@type': 'City', name: 'Ajman' }, { '@type': 'City', name: 'Abu Dhabi' }, { '@type': 'Country', name: 'United Arab Emirates' }],
      provider: { '@id': `${site.url}/#person` },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'UAE website packages', itemListElement: gulfPlans.map((p) => ({ '@type': 'Offer', name: p.name, priceCurrency: 'AED', price: p.price.replace(/[^\d]/g, ''), description: p.desc })) } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  const wa = (t) => `https://wa.me/923059494585?text=${encodeURIComponent(t)}`;
  return (
    <div className="wrap">
      <JsonLd data={ld} />
      <div className="pagehead">
        <div className="kicker"><b>UAE</b> / Dubai, Sharjah, Ajman</div>
        <h1>Web design for UAE businesses, <span className="grad">from AED 1,500.</span></h1>
        <p className="gulf-ar" lang="ar" dir="rtl">تصميم مواقع إلكترونية في دبي والشارقة وعجمان</p>
        <p className="lede">Websites for salons, clinics, restaurants and shops in the UAE. English and Arabic, prices in AED, and WhatsApp booking on every service. I make a free demo of your homepage before you pay anything.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
          <a className="btn primary" href={wa('Hi Shakir, I would like a free website demo for my business in the UAE.')} target="_blank" rel="noopener">Get a free demo on WhatsApp</a>
          <a className="btn" href="https://uae-salon-preview.vercel.app/cleopatra/" target="_blank" rel="noopener">See a live UAE example</a>
        </div>
      </div>

      <section className="gulf">
        <div className="shead"><div><div className="kicker"><b>01</b> / Why it works</div><h2>Built for how UAE customers book.</h2></div></div>
        <div className="why">{gulfPoints.map(([t, d], i) => <div key={t}><span className="num">0{i + 1}</span><h4>{t}</h4><p>{d}</p></div>)}</div>
      </section>

      <section>
        <div className="shead"><div><div className="kicker"><b>02</b> / Packages</div><h2>Website prices in AED.</h2></div><p>Fixed price agreed before work starts. Care plan from AED 100 per month.</p></div>
        <div className="pricing gulf-plans">
          {gulfPlans.map((p) => (
            <div key={p.name} className={'card plan' + (p.pop ? ' pop' : '')}>
              <h3>{p.name}</h3>
              <div className="price"><small>from </small>{p.price}</div>
              <p>{p.desc}</p>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <a className={'btn' + (p.pop ? ' primary' : '')} href={wa('Hi Shakir, I am interested in the ' + p.name + ' package for my business in the UAE.')} target="_blank" rel="noopener">Get this on WhatsApp</a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="shead"><div><div className="kicker"><b>03</b> / Recent work</div><h2>Salon and business websites.</h2></div><p><a href="/work">See all projects</a></p></div>
        <div className="pgrid">{work.map((p, i) => <ProjectCard key={p.slug} p={p} wide={i === 0} />)}</div>
      </section>

      <section>
        <div className="shead"><div><div className="kicker"><b>05</b> / Guides</div><h2>Free guides for UAE businesses.</h2></div></div>
        <ul className="uae-guides">
          <li><a href="/website-cost-dubai-uae-2026.html">How much does a website cost in Dubai and the UAE in 2026?</a></li>
          <li><a href="/salon-website-whatsapp-booking-uae.html">Why every UAE salon needs a website with WhatsApp booking</a></li>
          <li><a href="/google-business-profile-uae-guide.html">Google Business Profile: rank on Google Maps in Dubai, Sharjah and Ajman</a></li>
          <li><a href="/arabic-english-bilingual-website-guide.html">How to build a bilingual Arabic and English website that ranks</a></li>
        </ul>
      </section>

      <section>
        <div className="shead"><div><div className="kicker"><b>04</b> / FAQ</div><h2>Questions UAE businesses ask.</h2></div></div>
        <div className="faq">{faqs.map(([q, a]) => <details key={q} className="card"><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>

      <div className="band">
        <div><h2>Want to see your website first?</h2><p>Send your business name on WhatsApp. I&apos;ll make a free homepage demo with your services and reviews within 24 hours.</p></div>
        <div className="acts"><a className="btn primary" href={wa('Hi Shakir, please make a free website demo for my business. Name: ')} target="_blank" rel="noopener">Get my free demo</a></div>
      </div>
    </div>
  );
}

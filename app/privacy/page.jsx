import JsonLd, { breadcrumb } from '../../components/JsonLd';
import { site } from '../../lib/data';

export const metadata = {
  title: 'Privacy Policy & Imprint',
  description: 'How this website handles personal data under the GDPR, which services process it, your rights, and the contact details of the site owner.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <div className="wrap">
      <JsonLd data={breadcrumb('Privacy & imprint', '/privacy')} />
      <div className="pagehead">
        <div className="kicker">Legal</div>
        <h1>Privacy policy &amp; imprint</h1>
        <p className="lede">Plain-language summary of what data this site collects, why, and what you can ask me to do with it. Last updated October 2026.</p>
      </div>
      <section style={{ paddingTop: 40 }}>
        <div className="prose">
          <h2>Imprint (site owner)</h2>
          <p>Shakir Hussain, freelance full-stack web developer<br />Islamabad, Pakistan<br />Email: <a href={`mailto:${site.email}`}>{site.email}</a><br />Phone / WhatsApp: {site.phone}</p>

          <h2>Who is responsible for your data</h2>
          <p>I am the data controller for personal data collected through this website. You can contact me about anything in this policy at the email address above.</p>

          <h2>What I collect and why</h2>
          <ul>
            <li><b>Contact and quote forms:</b> your name, email, and what you write. Used only to reply to you and prepare a quote (legal basis: steps prior to a contract, Art. 6(1)(b) GDPR). Messages are delivered to my inbox by email.</li>
            <li><b>Reviews:</b> the name, role and text you submit. Reviews are only published after I approve them (legal basis: your consent, Art. 6(1)(a)).</li>
            <li><b>Student portal:</b> for my students only. Name, email, password (stored as a secure hash) and project uploads, used to run the course (legal basis: contract / legitimate interest).</li>
            <li><b>Analytics:</b> Google Analytics measures anonymous visit statistics such as pages viewed and device type, so I can improve the site (legal basis: consent where required).</li>
            <li><b>Server logs:</b> the hosting provider briefly records technical data like IP address and browser to keep the site secure and working.</li>
          </ul>

          <h2>Services that process data for me</h2>
          <ul>
            <li>Vercel Inc. (hosting and serverless functions)</li>
            <li>Upstash (database for posts, reviews and portal accounts)</li>
            <li>Resend (sending form emails)</li>
            <li>Google (Analytics and web fonts)</li>
          </ul>
          <p>Some of these providers are based outside the EU. Where data leaves the EU, they rely on the EU Standard Contractual Clauses or the EU-US Data Privacy Framework.</p>

          <h2>How long data is kept</h2>
          <p>Enquiries are kept for as long as needed to handle your request and any project that follows, then deleted, unless I&apos;m required to keep invoices or records for tax purposes. You can ask for deletion at any time.</p>

          <h2>Your rights</h2>
          <p>You can ask to see, correct, export or delete your personal data, object to or restrict how it is used, and withdraw consent at any time. Email me and I&apos;ll respond within 30 days. You also have the right to complain to a data protection authority in your EU country.</p>

          <h2>Cookies</h2>
          <p>This site uses a small local setting to remember light or dark mode, and Google Analytics cookies for visit statistics. No advertising cookies are used.</p>
        </div>
      </section>
    </div>
  );
}

import { site } from '../lib/data';

const I = {
  gh: <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.88c-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.51-1.11-1.51-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.13-4.56-5.02 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.04A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.31 2.75-1.04 2.75-1.04.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.73 0 3.9-2.34 4.76-4.57 5.01.36.32.68.94.68 1.9l-.01 2.81c0 .27.18.6.69.49C19.14 20.61 22 16.77 22 12.25 22 6.58 17.52 2 12 2z" />,
  li: <path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z" />,
  fb: <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />,
  ig: <><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.3" cy="6.7" r="1.1" /></>,
  tt: <path d="M16.6 5.82c-.7-.77-1.09-1.77-1.09-2.82h-3.02v13.44a2.68 2.68 0 1 1-1.89-2.56v-3.07a5.7 5.7 0 1 0 4.91 5.63V9.4a8.24 8.24 0 0 0 4.8 1.54V7.92a4.85 4.85 0 0 1-3.71-2.1z" />,
};

export const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3 2.3 1 2.8.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3z" /><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.9-1.3C8.4 21.6 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.2-.4-4.5-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.5 8.5 0 1 1 12 20.2z" /></svg>
);

export default function Footer() {
  const links = [[site.github, 'GitHub', I.gh], [site.linkedin, 'LinkedIn', I.li], [site.facebook, 'Facebook', I.fb], [site.instagram, 'Instagram', I.ig], [site.tiktok, 'TikTok', I.tt]];
  return (
    <>
      <footer className="ftr">
        <div className="wrap ftr-grid">
          <div>
            <a href="/" className="logo" aria-label="Shakir Hussain, home"><img src="/logo.svg" alt="" width="38" height="38" /><span className="lt"><b>Shakir Hussain</b><small>Full-stack developer</small></span></a>
            <p>Websites, online stores, web apps and AI chatbots for businesses across Europe. Fixed quotes in EUR, CET-friendly hours, building since 2018.</p>
            <div className="social">
              {links.map(([href, label, icon]) => (
                <a key={label} href={href} target="_blank" rel="noopener" aria-label={label}><svg viewBox="0 0 24 24" fill="currentColor">{icon}</svg></a>
              ))}
            </div>
          </div>
          <div className="col">
            <h4>Services</h4>
            <a href="/services.html">Services &amp; prices</a><a href="/ai-websites">AI websites</a><a href="/prototyping">Prototyping</a><a href="/full-stack">Full-stack apps</a><a href="/work">Work</a>
          </div>
          <div className="col">
            <h4>More</h4>
            <a href="/about.html">About</a><a href="/blog.html">Blog</a><a href="/testimonials.html">Testimonials</a><a href="/mentorship.html">Mentorship</a><a href="https://ai-website-auditor-self.vercel.app/" target="_blank" rel="noopener">Free website audit</a><a href="https://ai-resume-tool-azure.vercel.app/" target="_blank" rel="noopener">Free resume builder</a>
          </div>
          <div className="col">
            <h4>Get in touch</h4>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.whatsapp} target="_blank" rel="noopener">{site.phone}</a>
            <a href="/contact.html">Send a message</a>
            <a href="/student-portal.html">Student portal</a>
          </div>
        </div>
        <div className="wrap ftr-bot"><span>&copy; 2026 Shakir Hussain · <a href="/privacy">Privacy &amp; imprint</a></span><span>Based in Islamabad, Pakistan · Working with clients across Europe</span></div>
      </footer>
      <a className="wa" href={`${site.whatsapp}?text=Hi%20Shakir%2C%20I%20saw%20your%20portfolio%20and%20I%27d%20like%20to%20talk%20about%20a%20project.`} target="_blank" rel="noopener" aria-label="Message Shakir on WhatsApp"><WaIcon /></a>
    </>
  );
}

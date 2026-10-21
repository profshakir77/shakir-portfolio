import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../lib/data';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Shakir Hussain | Full-Stack Developer, 3D Web & UI Prototyping', template: '%s | Shakir Hussain' },
  description: 'Shakir Hussain is a full-stack web developer in Islamabad, Pakistan: Next.js apps, 3D web experiences and UI prototyping. 213+ websites delivered for clients worldwide since 2018.',
  authors: [{ name: 'Shakir Hussain' }],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Shakir Hussain, Full-Stack Developer', images: ['/shakir-profile.jpg'], locale: 'en_US' },
  twitter: { card: 'summary_large_image', images: ['/shakir-profile.jpg'] },
  verification: { google: 'RrD1NyX0B5qQoBq5hIUxQQ4bTpGCJoWXtoDCrc9wsac' },
  icons: { icon: [{ url: '/logo.svg', type: 'image/svg+xml' }, { url: '/favicon-32.png', sizes: '32x32' }], apple: '/apple-touch-icon.png' },
};

export const viewport = { themeColor: '#0E1014' };

const themeInit = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;
const gtag = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4ET1PWB9NZ');`;

const person = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Shakir Hussain', url: site.url, image: `${site.url}/shakir-profile.jpg`,
  email: `mailto:${site.email}`, jobTitle: 'Full-Stack Web Developer',
  knowsAbout: ['Next.js', 'React', 'Three.js', 'Node.js', 'PHP', 'MySQL', 'PostgreSQL', 'MongoDB', 'WordPress', 'UI prototyping'],
  sameAs: [site.linkedin, site.github],
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'University of Sargodha' }, { '@type': 'CollegeOrUniversity', name: 'Air University' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4ET1PWB9NZ" />
        <script dangerouslySetInnerHTML={{ __html: gtag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

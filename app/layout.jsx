import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../lib/data';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Shakir Hussain | Full-Stack Web Developer', template: '%s | Shakir Hussain' },
  description: 'Full-stack web developer for European businesses. Websites, online stores, web apps and AI chatbots, fixed quotes in EUR. 213+ sites built since 2018.',
  authors: [{ name: 'Shakir Hussain' }],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Shakir Hussain, Full-Stack Developer', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  verification: { google: 'RrD1NyX0B5qQoBq5hIUxQQ4bTpGCJoWXtoDCrc9wsac' },
  icons: { icon: [{ url: '/logo.svg', type: 'image/svg+xml' }, { url: '/favicon-32.png', sizes: '32x32' }], apple: '/apple-touch-icon.png' },
};

export const viewport = { themeColor: '#0B1F3A' };

const themeInit = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;
const gtag = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4ET1PWB9NZ');`;

const person = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Shakir Hussain', url: site.url, image: `${site.url}/shakir-profile.jpg`,
  email: `mailto:${site.email}`, jobTitle: 'Full-Stack Web Developer',
  knowsAbout: ['Next.js', 'React', 'Three.js', 'Node.js', 'PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'MongoDB', 'WordPress', 'WooCommerce', 'Shopify', 'AI chatbots', 'SEO', 'UI prototyping'],
  sameAs: [site.linkedin, site.github, site.facebook, site.instagram, site.tiktok],
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'University of Sargodha' }, { '@type': 'CollegeOrUniversity', name: 'Air University' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,600;1,8..60,700&family=JetBrains+Mono:wght@400;600&display=swap" />
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

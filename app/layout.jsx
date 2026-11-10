import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { site } from '../lib/data';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Shakir Hussain Portfolio | Full-Stack Web Developer, Islamabad', template: '%s | Shakir Hussain' },
  description: 'Shakir Hussain portfolio: full-stack web developer and CS educator at Air University Islamabad. Websites, online stores, web apps and AI chatbots for clients in Europe, the US and Pakistan. 213+ sites built since 2018.',
  keywords: ['Shakir Hussain', 'Shakir portfolio', 'Shakir Hussain portfolio', 'full-stack web developer Islamabad', 'web developer Pakistan', 'Next.js developer', 'Air University'],
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

const person = {
  '@context': 'https://schema.org', '@type': 'Person', '@id': `${site.url}/#person`, name: 'Shakir Hussain', alternateName: ['Shakir', 'Prof Shakir'], url: site.url,
  image: { '@type': 'ImageObject', url: `${site.url}/shakir-profile.jpg`, width: 700, height: 935, caption: 'Shakir Hussain, full-stack web developer' },
  address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  worksFor: { '@type': 'CollegeOrUniversity', name: 'Air University Islamabad' },
  email: `mailto:${site.email}`, jobTitle: 'Full-Stack Web Developer',
  knowsAbout: ['Next.js', 'React', 'Three.js', 'Node.js', 'PHP', 'Laravel', 'MySQL', 'PostgreSQL', 'MongoDB', 'WordPress', 'WooCommerce', 'Shopify', 'AI chatbots', 'SEO', 'UI prototyping'],
  sameAs: [site.linkedin, site.github, site.facebook, site.instagram, site.tiktok],
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'University of Sargodha' }, { '@type': 'CollegeOrUniversity', name: 'Air University' }],
};

const profilePage = {
  '@context': 'https://schema.org', '@type': 'ProfilePage', name: 'Shakir Hussain Portfolio', url: site.url,
  mainEntity: { '@id': `${site.url}/#person` }, primaryImageOfPage: `${site.url}/shakir-profile.jpg`,
};
const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Shakir Hussain Portfolio', alternateName: ['Shakir Portfolio', 'Shakir Hussain'], url: site.url };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,600;1,8..60,700&family=JetBrains+Mono:wght@400;600&display=swap" />
        <script src="/consent.js" defer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([person, profilePage, website]) }} />
        <meta property="og:image" content={`${site.url}/shakir-profile.jpg`} />
        <meta name="thumbnail" content={`${site.url}/shakir-profile.jpg`} />
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

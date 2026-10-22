// Site content in one place, so pages stay small and easy to update.

export const site = {
  name: 'Shakir Hussain',
  url: 'https://shakir-portfolio-azure.vercel.app',
  email: 'mr.shakir77@gmail.com',
  phone: '+92 305 9494585',
  phoneE164: '+923059494585',
  whatsapp: 'https://wa.me/923059494585',
  linkedin: 'https://www.linkedin.com/in/shakir-hussain77/',
  github: 'https://github.com/profshakir77',
  facebook: 'https://www.facebook.com/shakir.hussain.3114935/',
  instagram: 'https://www.instagram.com/shakir.hussain77/',
  tiktok: 'https://www.tiktok.com/@prof.shakir?lang=en',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/services.html', label: 'Services' },
  { href: '/ai-websites', label: 'AI Websites' },
  { href: '/prototyping', label: 'Prototyping' },
  { href: '/full-stack', label: 'Full-Stack' },
  { href: '/about.html', label: 'About' },
  { href: '/blog.html', label: 'Blog' },
  { href: '/contact.html', label: 'Contact' },
];

// Skill groups with real logo icons (from devicon, served from /public/icons).
export const skills = [
  { group: 'Front end', items: [['Next.js', 'nextjs-plain'], ['React', 'react-original'], ['JavaScript', 'javascript-plain'], ['TypeScript', 'typescript-plain'], ['HTML5', 'html5-plain'], ['CSS3', 'css3-plain'], ['Tailwind CSS', 'tailwindcss-original'], ['Bootstrap', 'bootstrap-plain'], ['Three.js', 'threejs-original']] },
  { group: 'Back end', items: [['Node.js', 'nodejs-plain'], ['Express', 'express-original'], ['PHP', 'php-plain'], ['Laravel', 'laravel-original'], ['Python', 'python-plain']] },
  { group: 'Databases', items: [['MySQL', 'mysql-original'], ['PostgreSQL', 'postgresql-plain'], ['MongoDB', 'mongodb-plain'], ['Redis', 'redis-plain'], ['Prisma', 'prisma-original'], ['Firebase', 'firebase-plain']] },
  { group: 'CMS & stores', items: [['WordPress', 'wordpress-plain'], ['WooCommerce', 'woocommerce-plain'], ['Shopify', null], ['jQuery', 'jquery-plain']] },
  { group: 'Design & tools', items: [['Figma', 'figma-plain'], ['Git', 'git-plain'], ['GitHub', 'github-original'], ['Docker', 'docker-plain'], ['Vercel', 'vercel-original']] },
];

export const marquee = ['nextjs-plain', 'react-original', 'nodejs-plain', 'typescript-plain', 'php-plain', 'laravel-original', 'mysql-original', 'postgresql-plain', 'mongodb-plain', 'redis-plain', 'wordpress-plain', 'woocommerce-plain', 'tailwindcss-original', 'figma-plain', 'threejs-original', 'docker-plain', 'python-plain', 'firebase-plain'];

const u = (id, w = 800) => `https://images.unsplash.com/${id}?fm=jpg&q=60&w=${w}&auto=format&fit=crop`;

// cat: store | app | tool | design
export const projects = [
  { slug: 'wrenpaw', title: 'Wrenpaw', isNew: true, featured: true, cat: 'store', tag: 'E-commerce · My own store', href: 'https://wrenpaw.com',
    img: u('photo-1601758228041-f3b2795255f1', 1000), alt: 'Dog playing with a toy, Wrenpaw pet store',
    desc: 'A pet store I started for customers in the US and Canada. I wrote all of it in Next.js, including the admin panel and the script that keeps stock in sync with suppliers.',
    tech: ['Next.js', 'Admin panel', 'Supplier sync', 'Vercel'] },
  { slug: 'jabeen', title: 'Jabeen Jewels', featured: true, cat: 'store', tag: 'E-commerce · Client', href: 'https://www.jabeenjewels.pk/',
    img: u('photo-1777286492764-456e3530e34c'), alt: 'Jewellery on display, Jabeen Jewels online store',
    desc: 'Jewellery store in Pakistan that I build and look after. I connected PostEx so orders book their courier automatically.',
    tech: ['Next.js', 'Prisma', 'Postgres', 'PostEx API'] },
  { slug: 'schoolos', title: 'SchoolOS', featured: true, cat: 'app', tag: 'Web app · Full-stack', href: 'https://sms-wine-seven.vercel.app',
    img: u('photo-1509062522246-3755977927d7'), alt: 'Classroom with students, SchoolOS school management system',
    desc: 'School management system with separate logins for admins, teachers and parents. Attendance, results, fee payments, admissions and payroll in one place.',
    tech: ['TypeScript', 'Next.js', 'MySQL', 'Stripe'] },
  { slug: 'gouda', title: 'Gouda Giggles', featured: true, cat: 'store', tag: 'Business site · Client', href: 'https://www.goudagiggles.com/',
    img: 'https://www.goudagiggles.com/images/product-1.png', alt: 'Charcuterie board from Gouda Giggles, Latham NY',
    desc: 'Website for a charcuterie and grazing table business in Latham, New York. Built for phones first, since that is where most of their orders come from.',
    tech: ['Full-stack', 'Database', 'Vercel'] },
  { slug: 'packaging', title: 'Packaging Cost Calculator', featured: true, cat: 'tool', tag: 'Web tool · Client', href: 'https://craftbox-packaging.vercel.app',
    img: u('photo-1618381297523-e6c0ab13a5b2'), alt: 'Custom printed boxes, packaging cost calculator website',
    desc: 'Packaging company site where buyers pick a box size, material and quantity and see the price straight away, without waiting for a quote by email.',
    tech: ['React', 'Node.js', 'Pricing logic'] },
  { slug: 'auditor', title: 'Website Auditor', featured: true, cat: 'tool', tag: 'AI tool · Open source', href: 'https://ai-website-auditor-self.vercel.app/',
    img: u('photo-1686061593213-98dad7c599b9', 1000), alt: 'Analytics dashboard, website audit tool',
    desc: 'Paste in a link and get SEO, conversion and trust scores with a clear list of what to fix first, including GDPR basics like a privacy page. Try it on your own site.',
    tech: ['Next.js', 'Cheerio', 'SEO', 'Live demo'] },
  { slug: 'brand', title: 'Brand Kits & Social Posts', isNew: true, featured: true, cat: 'design', tag: 'Branding · Clients', mono: 'Logo · Cover · Posts',
    desc: 'Logos, Facebook covers and sets of 20 or more posts in feed and reel sizes, in English and Urdu, for small businesses in the UK and Pakistan.',
    tech: ['Logo design', 'Social media', 'Urdu type'] },
  { slug: 'zumra', title: 'Zumra', cat: 'store', tag: 'Shopify · Client', href: 'https://zumrapret.com',
    img: 'https://zumrapret.com/cdn/shop/files/ChatGPT_Image_Aug_3_2026_03_06_20_PM_2.png?v=1785751743&width=750', alt: 'Zumra women’s clothing Shopify store',
    desc: 'Shopify store for a women’s clothing brand: collections, product pages and checkout.',
    tech: ['Shopify', 'Liquid'] },
  { slug: 'restaurant', title: 'Restaurant & Banquet Site', cat: 'app', tag: 'Booking site · Client', href: 'https://ember-and-oak-sigma.vercel.app',
    img: u('photo-1753727471014-efe38840c7c7'), alt: 'Restaurant dining room, banquet booking website',
    desc: 'Seven pages for a restaurant, banquet hall and catering service, with online table and event booking the owner can update himself.',
    tech: ['React', 'Node.js', 'Booking'] },
  { slug: 'digitalhub', title: 'Digital Hub', cat: 'app', tag: 'Learning platform', href: 'https://shakir-digital-hub-website.vercel.app/',
    img: u('photo-1498050108023-c5249f4df085'), alt: 'Laptop with code, Digital Hub learning platform',
    desc: 'Course platform for IT skills: web development, freelancing, Shopify, SEO and digital marketing.',
    tech: ['Next.js', 'Firebase'] },
  { slug: 'techtutor', title: 'Tech Tutor Institute', cat: 'app', tag: 'Member portal · Client', href: 'https://techtutorinstitute.com',
    img: u('photo-1513258496099-48168024aec0'), alt: 'Online class on a laptop, Tech Tutor Institute portal',
    desc: 'Member portal for an online training institute to manage students and their courses.',
    tech: ['React', 'Node.js'] },
  { slug: 'latent', title: 'Latent Image Co.', cat: 'design', tag: 'Concept site · Prototype', href: 'https://latent-image-co.vercel.app',
    img: u('photo-1611554949213-285df882362d'), alt: 'Film negatives, analog photo lab concept website',
    desc: 'Concept site for a film photo lab, with a gallery that moves as you scroll and simple price pages.',
    tech: ['React', 'Motion', 'Prototype'] },
  { slug: 'resume', title: 'Resume Builder', isNew: true, featured: true, cat: 'tool', tag: 'Web app · Free tool', href: 'https://ai-resume-tool-azure.vercel.app/',
    img: u('photo-1698047681432-006d2449c631'), alt: 'Resume on a desk, resume builder app',
    desc: 'Free resume builder with a live A4 preview, three templates and PDF download. A built-in checker flags weak bullet points before a recruiter does.',
    tech: ['JavaScript', 'PDF export', 'Live demo'] },
];

export const services = [
  { icon: 'code', title: 'Websites & web apps', text: 'Business sites, portals and dashboards in Next.js, React, PHP or Laravel. You get the code, the logins and a short guide.', href: '/full-stack', link: 'How I build' },
  { icon: 'ai', title: 'AI websites & chatbots', text: 'A chatbot that answers from your own content, smart search, and forms that sort enquiries for you.', href: '/ai-websites', link: 'AI services' },
  { icon: 'cart', title: 'Online stores', text: 'WooCommerce, Shopify or custom stores with EU payment methods, VAT-ready checkout and stock sync.', href: '/services.html', link: 'Store packages' },
  { icon: 'pen', title: 'UI/UX prototypes', text: 'Clickable designs you can try on your phone and show your team before any code is written.', href: '/prototyping', link: 'See the process' },
  { icon: 'cube', title: '3D & motion', text: 'Product viewers and 3D hero sections in Three.js that still load quickly on a normal phone.', href: '/#top', link: 'Try the demo' },
  { icon: 'search', title: 'SEO & speed', text: 'On-page SEO, Google Search Console, schema markup and Core Web Vitals fixes, plus an off-page plan.', href: '/services.html', link: 'SEO pricing' },
];

export const aiServices = [
  { t: 'Website chatbot', d: 'Trained on your own pages, FAQs and price lists. It answers visitors at 2am and hands hard questions to you on WhatsApp or email.' },
  { t: 'AI-powered websites', d: 'Search that understands what people mean, product suggestions, and pages that adapt to what a visitor is looking for.' },
  { t: 'Document & form automation', d: 'Read invoices, CVs or order forms, pull out the details and drop them into a sheet or database.' },
  { t: 'Content helpers', d: 'Draft product descriptions, alt text and meta tags for your team to review and edit, so nothing goes live unchecked.' },
  { t: 'AI integrations', d: 'Connect the OpenAI or Claude API to your existing app with sensible limits, logging and costs you can predict.' },
  { t: 'AI audits', d: 'An honest look at where AI would save your team time, and where it would just add cost.' },
];

export const labs = ['Data Structures', 'Software Design & Architecture', 'Big Data Analytics', 'Operating Systems', 'Artificial Intelligence', 'Full-Stack Frontend', 'Information Security', 'Programming Fundamentals'];

export const plans = [
  { name: 'Starter Website', price: '€1,500', desc: 'A fast one-page site for a new business, product or personal brand.', items: ['Responsive one-page design', 'Contact form and WhatsApp/email links', 'On-page SEO and Search Console setup', 'Cookie notice and privacy page', '3 to 5 day delivery'] },
  { name: 'Business & E-commerce', price: '€4,000', pop: true, desc: 'A multi-page company site or online store, ready to sell across the EU.', items: ['5 to 8 pages or a full store', 'WooCommerce, Shopify or custom', 'Stripe, PayPal or Mollie payments', 'Admin panel and content upload', 'SEO, speed and analytics', '5 to 7 day delivery'] },
  { name: 'Full-Stack Application', price: '€9,000', desc: 'A custom web app built front to back for your team or customers.', items: ['Next.js / Node.js build', 'API and database design', 'Login, roles and admin dashboard', 'Integrations with your tools', 'Deployment and monitoring', '10 to 14 day delivery'] },
];

export const whyEu = [
  ['Your working hours', 'Pakistan is 3 to 4 hours ahead of Central Europe, so your morning questions are answered the same day and calls fit your afternoon.'],
  ['Fixed quotes in EUR', 'A written scope and a fixed price before work starts. Hourly work is €50 to €65, invoiced in EUR.'],
  ['GDPR-aware builds', 'Cookie consent, privacy pages, data kept to a minimum, and EU hosting regions when you need them.'],
  ['Clear communication', 'Weekly progress updates in English, a shared preview link for every change, and no disappearing acts.'],
];

export const faqs = [
  ['How much does a website cost?', 'Starter sites begin at €1,500, business sites and online stores at €4,000, and custom web apps at €9,000. Use the estimator on my Services page for a ballpark, then you get a fixed written quote before any work starts.'],
  ['How long does it take?', 'A one-page site takes about 3 to 5 days, a business site or store 5 to 7 days, and a custom web app around 10 to 14 days. Bigger projects are planned in weekly milestones.'],
  ['Do you work with clients in Europe?', 'Yes, that is my focus. I work remotely in English, plan calls in your afternoon (CET), invoice in EUR and can sign your NDA or contract.'],
  ['Is my site GDPR compliant?', 'I build with GDPR in mind: cookie consent, a privacy page, minimal data collection and EU hosting regions when needed. For legal wording, your own lawyer has the final say.'],
  ['Can you add AI to my existing website?', 'Usually, yes. A chatbot or smart search can sit on top of most WordPress, Shopify or custom sites without rebuilding them.'],
  ['Will my site be SEO friendly?', 'Yes. Every build includes proper page titles and descriptions, schema markup, a sitemap, fast loading and Google Search Console setup.'],
  ['What happens after launch?', 'You keep full access to the code and hosting. If you want, I look after updates, backups and small changes on a monthly maintenance plan.'],
];

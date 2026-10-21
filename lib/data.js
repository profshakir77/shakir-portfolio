// Site content in one place, so pages stay small and easy to update.

export const site = {
  name: 'Shakir Hussain',
  url: 'https://shakir-portfolio-azure.vercel.app',
  email: 'mr.shakir77@gmail.com',
  phone: '+92 305 9494585',
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
  { href: '/prototyping', label: 'Prototyping' },
  { href: '/full-stack', label: 'Full-Stack' },
  { href: '/about.html', label: 'About' },
  { href: '/blog.html', label: 'Blog' },
  { href: '/mentorship.html', label: 'Mentorship' },
  { href: '/contact.html', label: 'Contact' },
];

export const stack = ['Next.js', 'React', 'Three.js', 'Node.js', 'Express', 'PHP', 'MySQL', 'PostgreSQL', 'MongoDB', 'Prisma', 'Redis', 'WordPress', 'WooCommerce', 'Shopify', 'Tailwind CSS', 'Figma', 'Docker', 'Vercel'];

const u = (id, w = 800) => `https://images.unsplash.com/${id}?fm=jpg&q=60&w=${w}&auto=format&fit=crop`;

// cat: store | app | tool | design
export const projects = [
  { slug: 'wrenpaw', title: 'Wrenpaw', isNew: true, featured: true, cat: 'store', tag: 'E-commerce · My product', href: 'https://wrenpaw.com',
    img: u('photo-1601758228041-f3b2795255f1', 1000), alt: 'Happy dog with its owner',
    desc: 'My own pet store for the US and Canada. A full Next.js codebase with an admin panel, automatic supplier sync and SEO built in.',
    tech: ['Next.js', 'Admin panel', 'Supplier sync', 'Vercel'] },
  { slug: 'jabeen', title: 'Jabeen Jewels', featured: true, cat: 'store', tag: 'E-commerce · Client', href: 'https://www.jabeenjewels.pk/',
    img: u('photo-1777286492764-456e3530e34c'), alt: 'Elegant jewelry display',
    desc: 'Online jewelry store I build and maintain: catalog, checkout and PostEx courier integration for shipping.',
    tech: ['Next.js', 'Prisma', 'Postgres', 'PostEx API'] },
  { slug: 'schoolos', title: 'SchoolOS', featured: true, cat: 'app', tag: 'Web app · Full-stack', href: 'https://sms-wine-seven.vercel.app',
    img: u('photo-1509062522246-3755977927d7'), alt: 'Students in a classroom',
    desc: 'School management system: role-based portals, attendance, gradebook, online fee payments, admissions and payroll.',
    tech: ['TypeScript', 'Next.js', 'MySQL', 'Stripe'] },
  { slug: 'gouda', title: 'Gouda Giggles', featured: true, cat: 'store', tag: 'Business site · Client', href: 'https://www.goudagiggles.com/',
    img: 'https://www.goudagiggles.com/images/product-1.png', alt: 'Gouda Giggles charcuterie board',
    desc: 'Site for a charcuterie board and grazing table business in Latham, New York, built mobile-first for quick ordering.',
    tech: ['Full-stack', 'Database', 'Vercel'] },
  { slug: 'packaging', title: 'Packaging Cost Calculator', featured: true, cat: 'tool', tag: 'Web tool · Client', href: 'https://craftbox-packaging.vercel.app',
    img: u('photo-1618381297523-e6c0ab13a5b2'), alt: 'Custom packaging boxes',
    desc: 'Packaging company site with a live price calculator that the big competitor sites in this space don’t offer.',
    tech: ['React', 'Node.js', 'Pricing logic'] },
  { slug: 'auditor', title: 'AI Website Auditor', featured: true, wide: true, cat: 'tool', tag: 'AI tool · Open source', href: 'https://ai-website-auditor-self.vercel.app/',
    img: u('photo-1686061593213-98dad7c599b9', 1000), alt: 'Website analytics dashboard',
    desc: 'Paste a URL and get an AI review of SEO, speed and accessibility issues, with a clear list of what to fix first.',
    tech: ['Node.js', 'AI', 'SEO'] },
  { slug: 'brand', title: 'Brand Kits & Social Posts', isNew: true, featured: true, cat: 'design', tag: 'Brand & social design · Clients', mono: 'Logo · Cover · Posts',
    desc: 'Logos, Facebook covers and sets of 20+ social posts (feed and reel sizes, English and Urdu) for small businesses in the UK and Pakistan.',
    tech: ['Logo design', 'Social media', 'Urdu type'] },
  { slug: 'zumra', title: 'Zumra', cat: 'store', tag: 'Shopify · Client', href: 'https://zumrapret.com',
    img: 'https://zumrapret.com/cdn/shop/files/ChatGPT_Image_Aug_3_2026_03_06_20_PM_2.png?v=1785751743&width=750', alt: 'Zumra storefront',
    desc: 'Shopify storefront for a women’s clothing brand: collections, product pages and checkout.',
    tech: ['Shopify', 'Liquid'] },
  { slug: 'restaurant', title: 'Restaurant & Banquet Site', cat: 'app', tag: 'Booking site · Client', href: 'https://ember-and-oak-sigma.vercel.app',
    img: u('photo-1753727471014-efe38840c7c7'), alt: 'Upscale restaurant interior',
    desc: '7-page restaurant, banquet and catering site with online booking and self-editable content.',
    tech: ['React', 'Node.js', 'Booking'] },
  { slug: 'digitalhub', title: 'Digital Hub', cat: 'app', tag: 'Learning platform', href: 'https://shakir-digital-hub-website.vercel.app/',
    img: u('photo-1498050108023-c5249f4df085'), alt: 'Laptop with code',
    desc: 'Online learning platform for IT courses: web development, freelancing, Shopify, SEO and digital marketing.',
    tech: ['Next.js', 'Firebase'] },
  { slug: 'techtutor', title: 'Tech Tutor Institute', cat: 'app', tag: 'Member portal · Client', href: 'https://techtutorinstitute.com',
    img: u('photo-1513258496099-48168024aec0'), alt: 'Online tutoring on a laptop',
    desc: 'Member management portal for an online training institute.',
    tech: ['React', 'Node.js'] },
  { slug: 'latent', title: 'Latent Image Co.', cat: 'design', tag: 'Concept site · Prototype', href: 'https://latent-image-co.vercel.app',
    img: u('photo-1611554949213-285df882362d'), alt: 'Film negatives',
    desc: 'Concept site for an analog film lab with service pricing and a scroll-driven gallery.',
    tech: ['React', 'Motion', 'Prototype'] },
  { slug: 'resume', title: 'AI Resume Tool', cat: 'tool', tag: 'AI tool · Open source', href: 'https://github.com/profshakir77/ai-resume-tool',
    img: u('photo-1698047681432-006d2449c631'), alt: 'Resume on a desk',
    desc: 'Web app that writes and refines resumes with AI suggestions.',
    tech: ['React', 'Node.js', 'AI'] },
];

export const services = [
  { title: 'Full-Stack Next.js Apps', text: 'Next.js front end, API routes, database and auth, deployed on Vercel with monitoring.', href: '/full-stack', link: 'How I build' },
  { title: '3D Web Experiences', text: 'Interactive Three.js scenes, 3D product views and motion that still load fast on phones.', href: '/#top', link: 'See the demo' },
  { title: 'UI/UX Prototyping', text: 'Wireframes and clickable prototypes you can test with users before production code.', href: '/prototyping', link: 'See the process' },
  { title: 'E-commerce Stores', text: 'WooCommerce, Shopify and custom stores with payments, couriers and supplier sync.', href: '/services.html', link: 'Packages' },
  { title: 'APIs & Databases', text: 'REST APIs, integrations, and MySQL, PostgreSQL or MongoDB schema design.', href: '/full-stack#layers', link: 'Stack details' },
  { title: 'SEO, Speed & Care', text: 'Core Web Vitals tuning, on-page SEO, hosting moves, outage fixes and maintenance.', href: '/services.html', link: 'Pricing' },
];

export const labs = ['Data Structures', 'Software Design & Architecture', 'Big Data Analytics', 'Operating Systems', 'Artificial Intelligence', 'Full-Stack Frontend', 'Information Security', 'Programming Fundamentals'];

// ============================================================
//  POSTS — the one list that powers every article listing.
//
//  To publish a new article:
//    1. Copy templates/post-template.html to posts/<slug>.html and write it.
//    2. Add an entry to POSTS below with the same slug.
//    3. Run `node tools/build-feeds.mjs` to update
//       sitemap.xml and feed.xml. Optional, but good for SEO.
//
//  Fields
//    slug         file name without .html (posts/<slug>.html)
//    title        headline shown on cards and the page
//    seoTitle     optional: shorter title for search results (defaults to title)
//    description  1–2 sentences; used on cards and as the meta description
//    section      'diaries' | 'ai' | 'systems'
//    tags         lowercase topics, e.g. ['linux', 'networking']
//    date         'YYYY-MM-DD' first published
//    updated      optional 'YYYY-MM-DD' last meaningful edit
//    readTime     e.g. '6 min read'
//    image        cover image path inside tech/ (SVG, PNG or JPG; 1600×900 works best)
//    imageAlt     describe the image for screen readers
//    status       'published' shows everywhere; 'draft' is hidden from every list
//                 (preview drafts by adding ?drafts to any listing page's URL)
//    featured     true on the ONE post you want in the big spot on the home page
//
//  To delete a post: remove its entry here and delete its file in posts/.
// ============================================================

window.SECTIONS = [
  {
    slug: 'diaries',
    name: 'The Tech Diaries',
    page: 'diaries.html',
    art: 'images/covers/section-diaries.svg',
    blurb: 'An honest log of learning technology: school, certifications, labs that broke, career questions, and the occasional small win.'
  },
  {
    slug: 'ai',
    name: 'AI & Automation',
    page: 'ai.html',
    art: 'images/covers/section-ai.svg',
    blurb: 'Building AI agents, automating repetitive tasks, testing AI development tools, and thinking about where all of this is going.'
  },
  {
    slug: 'systems',
    name: 'Systems, Networks & Cloud',
    page: 'systems.html',
    art: 'images/covers/section-systems.svg',
    blurb: 'Linux, networking, servers, virtual machines, cloud and security fundamentals, learned by actually doing them.'
  }
];

window.POSTS = [
  {
    slug: 'what-a-domain-taught-me-about-dns',
    title: 'What Pointing a Domain at My Website Taught Me About DNS',
    seoTitle: 'DNS Explained Through a Real Domain Setup',
    description: 'A, CNAME and TTL stopped being flashcard terms the day I had to point my own domain at GitHub Pages. Here is what each record does and how to check them yourself.',
    section: 'systems',
    tags: ['dns', 'networking', 'github-pages', 'beginner'],
    date: '2026-10-09',
    readTime: '7 min read',
    image: 'images/covers/dns.svg',
    imageAlt: 'Diagram of a browser asking a DNS resolver for a domain and being sent to GitHub Pages servers',
    status: 'published'
  },
  {
    slug: 'building-this-site-with-an-ai-coding-assistant',
    title: 'Building This Site With an AI Coding Assistant',
    seoTitle: 'Building a Portfolio Site With an AI Coding Assistant',
    description: 'I wrote a detailed brief, an AI coding assistant built the first version, and I am responsible for every line. What that process looks like and the rules I set for it.',
    section: 'ai',
    tags: ['ai-tools', 'web', 'javascript', 'this-site'],
    date: '2026-10-09',
    readTime: '6 min read',
    image: 'images/covers/ai-assistant.svg',
    imageAlt: 'A chat bubble connected to a code editor window with HTML and JavaScript',
    status: 'published'
  },
  {
    slug: 'hello-world',
    title: 'Hello, World: Why I Am Documenting My Tech Journey',
    seoTitle: 'Hello, World: Why I Am Documenting My Tech Journey',
    description: 'I am a cybersecurity student who wants to become a systems or cloud engineer. This is where I write down what I learn, what I build, and what goes sideways.',
    section: 'diaries',
    tags: ['career', 'cybersecurity', 'learning-in-public'],
    date: '2026-10-09',
    readTime: '4 min read',
    image: 'images/covers/hello-world.svg',
    imageAlt: 'A terminal window printing hello, world with a blinking cursor',
    status: 'published',
    featured: true
  },

  // ---- Drafts: hidden from the site until you change status to 'published'. ----
  {
    slug: 'studying-for-comptia',
    title: 'Studying for CompTIA: My Plan (and How It Is Actually Going)',
    description: 'Which certification I am working toward, the resources I am using, and an honest progress report.',
    section: 'diaries',
    tags: ['comptia', 'certifications', 'study-plan'],
    date: '2026-10-09',
    readTime: '5 min read',
    image: 'images/covers/draft.svg',
    imageAlt: 'Abstract checklist with study milestones',
    status: 'draft'
  },
  {
    slug: 'what-i-wish-i-knew-before-studying-tech',
    title: 'What I Wish I Had Known Before Studying Technology',
    description: 'The things nobody told me before I started a cybersecurity program.',
    section: 'diaries',
    tags: ['career', 'advice', 'cybersecurity'],
    date: '2026-10-09',
    readTime: '5 min read',
    image: 'images/covers/draft.svg',
    imageAlt: 'Abstract checklist with study milestones',
    status: 'draft'
  }
];

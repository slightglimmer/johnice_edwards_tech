// ============================================================
//  PROJECTS — powers the Projects page and project cards.
//
//  To add a project:
//    1. Copy templates/project-template.html to projects/<slug>.html.
//    2. Add an entry to PROJECTS below with the same slug.
//
//  Fields
//    slug        file name without .html (projects/<slug>.html)
//    title       project name
//    summary     one or two sentences for the card
//    status      'planned' | 'in-progress' | 'completed'
//                Be honest: only use 'completed' for things that exist and work.
//    section     'ai' | 'systems' | 'web' (used for filters and section pages)
//    tech        tools and languages used (or planned)
//    image       preview image path inside tech/ (screenshot or SVG, 16:9)
//    imageAlt    describe the image
//    repo        GitHub URL, or '' if there isn't one yet
//    demo        live URL, or '' if there isn't one
//    started     'YYYY-MM' when you began (or plan to begin)
//    featured    true to show on the home page
//    published   false hides the project everywhere while you write it up
// ============================================================

window.PROJECT_STATUSES = {
  'planned': 'Planned',
  'in-progress': 'In Progress',
  'completed': 'Completed'
};

window.PROJECTS = [
  {
    slug: 'johnice-edwards-tech',
    title: 'Johnice Edwards Tech',
    summary: 'This website: a hand-built, framework-free portfolio and blog with a small content system, drafts, tags, related posts and a dark-first design.',
    status: 'in-progress',
    section: 'web',
    tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'GitHub Pages', 'AI coding assistant'],
    image: 'images/projects/tech-site.jpg',
    imageAlt: 'Screenshot of the Johnice Edwards Tech home page with a dark theme and terminal graphic',
    repo: 'https://github.com/slightglimmer/johnice_edwards_tech',
    demo: 'https://slightglimmer.github.io/johnice_edwards_tech/',
    started: '2026-10',
    featured: true,
    published: true
  },
  {
    slug: 'johnice-edwards-realty',
    title: 'Johnice Edwards Realty',
    summary: 'A homeownership journal on my own domain, with a data-driven article list, search, category pages and a working contact form.',
    status: 'completed',
    section: 'web',
    tech: ['HTML', 'CSS', 'JavaScript', 'Formspree', 'GitHub Pages', 'DNS'],
    image: 'images/projects/realty-site.jpg',
    imageAlt: 'Screenshot of the Johnice Edwards Realty home page with a warm ivory design',
    repo: 'https://github.com/slightglimmer/johnice_edwards_realty',
    demo: 'https://johniceedwardsrealty.com/',
    started: '2026-10',
    featured: true,
    published: true
  },
  {
    slug: 'ai-homeownership-tools',
    title: 'AI Homeownership Tools',
    summary: 'An idea in planning: AI-assisted tools for renovation planning, maintenance reminders and plain-English real estate answers. Nothing is built yet.',
    status: 'planned',
    section: 'ai',
    tech: ['AI agents', 'LLM APIs', 'JavaScript', 'Automation'],
    image: 'images/projects/ai-tools.svg',
    imageAlt: 'Concept graphic of a house outline connected to AI nodes and a checklist',
    repo: '',
    demo: '',
    started: '',
    featured: true,
    published: true
  }
];

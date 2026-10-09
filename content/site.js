// ============================================================
//  SITE SETTINGS — your links, contact details and the
//  "Currently exploring" list. Edit values here and every page
//  updates. Leave a value as '' (empty) and the site shows
//  "Coming soon" instead of a broken link.
// ============================================================

window.SITE = {
  name: 'Johnice Edwards Tech',
  author: 'Johnice Edwards',
  url: 'https://johniceedwardstech.com/',   // the site's address (used for the sitemap and RSS feed)

  links: {
    email: '',        // e.g. 'hello@yourdomain.com'
    github: '',       // e.g. 'https://github.com/your-username'
    linkedin: '',     // e.g. 'https://www.linkedin.com/in/your-name'
    resume: ''        // e.g. 'files/johnice-edwards-resume.pdf' (put the PDF in tech/files/)
  },

  // Contact form endpoint (Formspree). Messages arrive by email.
  formEndpoint: 'https://formspree.io/f/xwlvodrn'
};

// What you're learning right now. Shown on the home page and About page.
// icon: one of terminal, network, cloud, shield, spark, flow, server, book
// stage: a short honest label, e.g. 'Studying in school', 'Learning the basics', 'Practicing', 'Building with'
window.EXPLORING = [
  {
    topic: 'Cybersecurity fundamentals',
    detail: 'Threats, defenses, access control and how security fits into every layer of a system.',
    icon: 'shield',
    stage: 'Studying in school'
  },
  {
    topic: 'Computer networking',
    detail: 'How data actually gets from one place to another: IP addressing, DNS, routing and the OSI model.',
    icon: 'network',
    stage: 'Learning the basics'
  },
  {
    topic: 'Linux',
    detail: 'Getting comfortable in the terminal: navigating, permissions, packages and services.',
    icon: 'terminal',
    stage: 'Learning the basics'
  },
  {
    topic: 'Cloud computing',
    detail: 'How cloud infrastructure works and what a cloud engineer actually does day to day.',
    icon: 'cloud',
    stage: 'Exploring'
  },
  {
    topic: 'AI agents',
    detail: 'How AI tools can plan, use tools and take actions, and where they fall short.',
    icon: 'spark',
    stage: 'Building with'
  },
  {
    topic: 'Automation',
    detail: 'Scripting the repetitive stuff so I can spend time on the interesting stuff.',
    icon: 'flow',
    stage: 'Exploring'
  }
];

// Regenerates sitemap.xml and feed.xml from the content lists.
// Run from the repository root:  node tools/build-feeds.mjs
// No packages to install. Also checks that every listed post/project has a page.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const TECH = join(dirname(fileURLToPath(import.meta.url)), '..');
const window = {};
for (const f of ['site.js', 'posts.js', 'projects.js']) {
  vm.runInNewContext(readFileSync(join(TECH, 'content', f), 'utf8'), { window });
}
const BASE = window.SITE.url.replace(/\/?$/, '/');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const posts = window.POSTS.filter((p) => p.status === 'published').sort((a, b) => (a.date < b.date ? 1 : -1));
const projects = window.PROJECTS.filter((p) => p.published !== false);

let problems = 0;
for (const p of window.POSTS) {
  if (!existsSync(join(TECH, 'posts', p.slug + '.html'))) { console.warn(`! posts/${p.slug}.html is missing`); problems++; }
  if (!['diaries', 'ai', 'systems'].includes(p.section)) { console.warn(`! ${p.slug}: unknown section "${p.section}"`); problems++; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) { console.warn(`! ${p.slug}: date should be YYYY-MM-DD`); problems++; }
}
for (const p of window.PROJECTS) {
  if (!existsSync(join(TECH, 'projects', p.slug + '.html'))) { console.warn(`! projects/${p.slug}.html is missing`); problems++; }
  if (!window.PROJECT_STATUSES[p.status]) { console.warn(`! ${p.slug}: unknown status "${p.status}"`); problems++; }
}
if (posts.filter((p) => p.featured).length > 1) { console.warn('! more than one published post has featured: true'); problems++; }

const pages = ['', 'blog.html', 'diaries.html', 'ai.html', 'systems.html', 'projects.html', 'about.html', 'contact.html'];
const urls = [
  ...pages.map((p) => ({ loc: BASE + p })),
  ...posts.map((p) => ({ loc: `${BASE}posts/${p.slug}.html`, lastmod: p.updated || p.date })),
  ...projects.map((p) => ({ loc: `${BASE}projects/${p.slug}.html` }))
];
writeFileSync(join(TECH, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
  '\n</urlset>\n');

const rfc822 = (d) => new Date(d + 'T12:00:00Z').toUTCString();
writeFileSync(join(TECH, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${esc(window.SITE.name)}</title>
  <link>${BASE}</link>
  <description>Learning technology, building things, and documenting the journey.</description>
  <language>en-us</language>
  <atom:link href="${BASE}feed.xml" rel="self" type="application/rss+xml"/>
${posts.map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${BASE}posts/${p.slug}.html</link>
    <guid>${BASE}posts/${p.slug}.html</guid>
    <pubDate>${rfc822(p.date)}</pubDate>
    <description>${esc(p.description)}</description>
${(p.tags || []).map((t) => `    <category>${esc(t)}</category>`).join('\n')}
  </item>`).join('\n')}
</channel>
</rss>
`);

console.log(`sitemap.xml: ${urls.length} URLs · feed.xml: ${posts.length} posts · ${problems ? problems + ' problem(s) above' : 'no problems found'}`);
process.exitCode = problems ? 1 : 0;

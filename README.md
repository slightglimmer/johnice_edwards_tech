# Johnice Edwards Tech

*Learning technology. Building things. Documenting the journey.*

A personal technology blog and portfolio. It's plain HTML, CSS and JavaScript, with no framework,
nothing to install and no build step needed to publish.

## Publishing with GitHub Pages and johniceedwardstech.com

The site's links, sitemap and RSS feed already use **https://johniceedwardstech.com/**.

**1. Turn on GitHub Pages:** in this repository go to **Settings → Pages**, choose
**Deploy from a branch**, pick `main` and `/ (root)`, and save. Until the domain is connected,
the site is at https://slightglimmer.github.io/johnice_edwards_tech/.

**2. After you buy johniceedwardstech.com**, add these DNS records at your registrar
(for Namecheap: Domain List → Manage → Advanced DNS) and delete any default "parking" records:

| Type | Host | Value |
|---|---|---|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `slightglimmer.github.io.` |

**3. Connect it on GitHub:** back in **Settings → Pages**, type `johniceedwardstech.com` under
**Custom domain** and save (GitHub adds a `CNAME` file to the repo for you). Once the DNS check
passes, which can take from a few minutes to a few hours, tick **Enforce HTTPS**.

Optional but recommended: verify the domain under your GitHub account's
**Settings → Pages → Add a domain**, which stops anyone else from claiming it on GitHub Pages.

To check the DNS yourself: `dig johniceedwardstech.com +short` should list the four addresses above.

## What's where

| Path | What it is |
|---|---|
| `index.html` | Home: hero, featured projects, latest articles, sections, currently exploring, contact |
| `blog.html` | Every article, with search, section filters and tags |
| `diaries.html`, `ai.html`, `systems.html` | The three section pages |
| `projects.html` | All projects, filterable by status |
| `about.html`, `contact.html` | About me, and contact links plus form |
| `posts/` | One HTML file per article |
| `projects/` | One HTML file per project write-up |
| `content/site.js` | **Your links** (email, GitHub, LinkedIn, resume) and the "Currently exploring" list |
| `content/posts.js` | **The list of articles** and the three sections |
| `content/projects.js` | **The list of projects** and their status labels |
| `templates/` | Copy-and-fill starting points for new articles and projects |
| `assets/css/site.css` | All styling. Colors, fonts and sizes are tokens at the top |
| `assets/js/layout.js` | Header, footer and icons (one place for the navigation) |
| `assets/js/main.js` | Cards, filters, related posts, code blocks, form, animations |
| `assets/js/highlight.js` | Small built-in syntax highlighter for code blocks |
| `images/` | Covers, diagrams, screenshots, headshot. No stock photos |
| `tools/build-feeds.mjs` | Rebuilds `sitemap.xml` and `feed.xml` and checks the content lists |

## Add your links

Open `content/site.js` and fill in `email`, `github`, `linkedin` and `resume`. Anything left
as `''` shows as "coming soon" instead of a broken link. For a resume, put the PDF in
`files/` and set `resume: 'files/your-resume.pdf'`.

## Publish an article

1. Copy `templates/post-template.html` to `posts/my-new-post.html`.
2. Follow the comment at the top of the template: update the `<head>` (title, description,
   canonical, social tags, JSON-LD), **delete the `noindex` line**, set `data-post="my-new-post"`,
   and write the article.
3. Add an entry at the top of `POSTS` in `content/posts.js` with `slug: 'my-new-post'`.
   Choose `section: 'diaries'`, `'ai'` or `'systems'`, and add a few lowercase tags.
4. Run `node tools/build-feeds.mjs` to update the sitemap and RSS feed.

The home page, section pages, blog search, tag filters, related posts and previous/next links
all update on their own.

**Drafts:** set `status: 'draft'` and the article is hidden from every list. Add `?drafts` to
the end of any page address (for example `blog.html?drafts`) to preview drafts. Draft pages
should keep the `noindex` line in their `<head>`.

**Edit:** change the page, and the entry in `posts.js` if the title, description or tags changed.
Add `updated: 'YYYY-MM-DD'`.

**Delete:** remove the entry from `posts.js`, delete the file in `posts/`, and rerun the feeds script.

**Featured:** put `featured: true` on the one article you want in the big spot on the home page.

### Writing tips

- Code blocks: `<pre><code class="language-bash">…</code></pre>`. Supported: `bash`, `js`, `json`,
  `python`, `yaml`, `html`, `text`. Lines starting with `$ ` show as prompts and are left out when copied.
- Callouts, pull quotes, figures and tables are all styled. See `templates/post-template.html`
  and the existing posts for examples.
- Cover images work best at 1600 × 900. SVG, PNG or JPG are all fine; keep photos under ~300 KB.

## Add a project

1. Copy `templates/project-template.html` to `projects/my-project.html` and fill in the sections.
2. Add an entry to `PROJECTS` in `content/projects.js`.

Status is one of `'planned'`, `'in-progress'` or `'completed'`. Only call something completed if it
exists and works. The status badge, tech list and GitHub/demo buttons on the project page come
from `projects.js`, so changing the status there updates it everywhere.

## Currently exploring

Edit `EXPLORING` in `content/site.js`. Each item has a topic, a one-line detail, an icon
(`terminal`, `network`, `cloud`, `shield`, `spark`, `flow`, `server`, `book`) and an honest stage label.

## Contact form

The form posts to the same Formspree form as the realty site (`formEndpoint` in `content/site.js`),
with the subject "New message from Johnice Edwards Tech" so you can tell them apart. To keep them
separate, create a second form in Formspree and paste its URL there. It includes a hidden spam
trap field and validates name, email and message before sending.

## Preview locally

From the repository root run `python3 -m http.server`, then open `http://localhost:8000/`.

// Johnice Edwards Tech — page behavior. No dependencies.
// Reads window.POSTS / SECTIONS / PROJECTS / EXPLORING / SITE (tech/content/*.js)
// and fills any placeholders a page includes. Each block below only runs if the
// page has the matching element, so every page can load this same file.
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var ROOT = document.body.getAttribute('data-root') || '';
  var ICONS = window.ICONS || {};
  var SITE = window.SITE || { links: {} };
  var SECTIONS = window.SECTIONS || [];
  var STATUSES = window.PROJECT_STATUSES || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(window.location.search);
  var SHOW_DRAFTS = params.has('drafts');

  // ---------- helpers ----------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] === undefined || attrs[k] === null || attrs[k] === false) return;
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  function formatDate(iso) {
    if (!iso) return '';
    var p = iso.split('-').map(Number);
    var d = new Date(p[0], (p[1] || 1) - 1, p[2] || 1);
    var opts = p[2] ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', year: 'numeric' };
    return d.toLocaleDateString('en-US', opts);
  }

  function sectionFor(slug) {
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].slug === slug) return SECTIONS[i];
    return { slug: slug, name: 'Web & Software', page: 'projects.html' };
  }

  function postUrl(p) { return ROOT + 'posts/' + p.slug + '.html'; }
  function projectUrl(p) { return ROOT + 'projects/' + p.slug + '.html'; }

  function image(src, alt, eager) {
    var img = el('img', { src: ROOT + src, alt: alt || '', loading: eager ? null : 'lazy', decoding: 'async' });
    img.addEventListener('error', function () { img.remove(); });
    return img;
  }

  function statusBadge(status) {
    return el('span', { class: 'status status-' + status, text: STATUSES[status] || (status === 'draft' ? 'Draft' : status) });
  }

  var POSTS = (window.POSTS || [])
    .filter(function (p) { return p.status === 'published' || SHOW_DRAFTS; })
    .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  var ALL_POSTS = window.POSTS || [];
  var PROJECTS = (window.PROJECTS || []).filter(function (p) { return p.published !== false; });
  var FEATURED = POSTS.filter(function (p) { return p.featured; })[0] || POSTS[0];

  // ---------- cards ----------

  function postCard(p, opts) {
    opts = opts || {};
    var sec = sectionFor(p.section);
    var meta = el('span', { class: 'card-meta' }, [
      el('time', { datetime: p.date, text: formatDate(p.date) }),
      el('span', { 'aria-hidden': 'true', text: '·' }),
      el('span', { text: p.readTime }),
      el('span', { class: 'card-arrow', 'aria-hidden': 'true', html: '→' })
    ]);
    var tags = el('ul', { class: 'tag-list', 'aria-label': 'Topics' }, (p.tags || []).slice(0, 3).map(function (t) {
      return el('li', {}, [el('span', { class: 'tag', text: '#' + t })]);
    }));
    var body = el('div', { class: 'card-body' }, [
      el('span', { class: 'card-kicker', text: (opts.feature ? 'Featured · ' : '') + sec.name }),
      p.status === 'draft' ? statusBadge('draft') : null,
      el(opts.headingTag || 'h3', { text: p.title }),
      el('p', { class: 'card-excerpt', text: p.description }),
      tags,
      meta
    ]);
    return el('a', {
      class: 'card post-card' + (opts.feature ? ' feature-post' : ''),
      href: postUrl(p),
      'data-section': p.section,
      'data-tags': (p.tags || []).join(' ')
    }, [el('div', { class: 'card-media' }, [image(p.image, p.imageAlt)]), body]);
  }

  function projectCard(p) {
    var links = [];
    if (p.demo) links.push(el('a', { href: p.demo, rel: 'noopener', text: 'Live site ↗' }));
    if (p.repo) links.push(el('a', { href: p.repo, rel: 'noopener', text: 'Code ↗' }));
    return el('article', { class: 'card project-card is-link', 'data-status': p.status, 'data-section': p.section }, [
      el('div', { class: 'card-media' }, [image(p.image, p.imageAlt), statusBadge(p.status)]),
      el('div', { class: 'card-body' }, [
        el('h3', {}, [el('a', { class: 'stretched', href: projectUrl(p), text: p.title })]),
        el('p', { class: 'card-excerpt', text: p.summary }),
        el('ul', { class: 'tag-list', 'aria-label': 'Technologies' }, p.tech.map(function (t) {
          return el('li', {}, [el('span', { class: 'tag', text: t })]);
        })),
        el('div', { class: 'card-meta' }, [
          links.length ? el('span', { class: 'card-links' }, links) : el('span', { text: 'Write-up inside' }),
          el('span', { class: 'card-arrow', 'aria-hidden': 'true', html: '→' })
        ])
      ])
    ]);
  }

  function emptyState(title, text) {
    return el('div', { class: 'empty-state' }, [el('strong', { text: title }), el('span', { text: text })]);
  }

  // ---------- listings ----------

  // Featured post: <div id="featured-post"></div>
  var featuredSlot = document.getElementById('featured-post');
  if (featuredSlot && FEATURED) featuredSlot.appendChild(postCard(FEATURED, { feature: true }));

  // Post lists: <div data-posts data-section="ai" data-limit="3" data-exclude-featured data-empty="Text">
  document.querySelectorAll('[data-posts]').forEach(function (list) {
    var section = list.getAttribute('data-section');
    var limit = Number(list.getAttribute('data-limit')) || Infinity;
    var excludeFeatured = list.hasAttribute('data-exclude-featured');
    var items = POSTS.filter(function (p) {
      return (!section || p.section === section) && !(excludeFeatured && p === FEATURED);
    }).slice(0, limit);
    items.forEach(function (p) { list.appendChild(postCard(p)); });
    if (!items.length && list.hasAttribute('data-empty')) {
      list.classList.remove('grid', 'grid-2', 'grid-3');
      list.appendChild(emptyState('First article coming soon', list.getAttribute('data-empty')));
    }
  });

  // Project lists: <div data-projects data-featured data-section="ai" data-limit="3">
  document.querySelectorAll('[data-projects]').forEach(function (list) {
    var section = list.getAttribute('data-section');
    var featuredOnly = list.hasAttribute('data-featured');
    var limit = Number(list.getAttribute('data-limit')) || Infinity;
    var order = { 'in-progress': 0, 'completed': 1, 'planned': 2 };
    var items = PROJECTS.filter(function (p) {
      return (!section || p.section === section) && (!featuredOnly || p.featured);
    }).sort(function (a, b) { return order[a.status] - order[b.status]; }).slice(0, limit);
    items.forEach(function (p) { list.appendChild(projectCard(p)); });
    if (!items.length && list.hasAttribute('data-empty')) {
      list.classList.remove('grid', 'grid-2', 'grid-3');
      list.appendChild(emptyState('Nothing here yet', list.getAttribute('data-empty')));
    }
  });

  // Counts: <span data-count-section="ai"></span>
  document.querySelectorAll('[data-count-section]').forEach(function (node) {
    var n = POSTS.filter(function (p) { return p.section === node.getAttribute('data-count-section'); }).length;
    node.textContent = n === 0 ? 'First article coming soon' : n === 1 ? '1 article →' : n + ' articles →';
  });

  // Currently exploring: <div id="exploring-list"></div>
  var exploring = document.getElementById('exploring-list');
  if (exploring) {
    (window.EXPLORING || []).forEach(function (x) {
      exploring.appendChild(el('div', { class: 'explore-item reveal' }, [
        el('span', { class: 'explore-icon', html: ICONS[x.icon] || ICONS.spark }),
        el('div', {}, [
          el('h3', { text: x.topic }),
          el('p', { text: x.detail }),
          el('span', { class: 'explore-stage', text: x.stage })
        ])
      ]));
    });
  }

  // Contact links: <ul id="contact-links"></ul>
  var contactLinks = document.getElementById('contact-links');
  if (contactLinks) {
    var L = SITE.links || {};
    [
      { key: 'email', label: 'Email', icon: 'mail', href: L.email && 'mailto:' + L.email, show: L.email },
      { key: 'github', label: 'GitHub', icon: 'github', href: L.github, show: L.github && L.github.replace(/^https?:\/\/(www\.)?/, '') },
      { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', href: L.linkedin, show: L.linkedin && L.linkedin.replace(/^https?:\/\/(www\.)?/, '') },
      { key: 'resume', label: 'Resume', icon: 'file', href: L.resume && (/^https?:/.test(L.resume) ? L.resume : ROOT + L.resume), show: 'Download PDF' }
    ].forEach(function (item) {
      var inner = [
        el('span', { class: 'explore-icon', html: ICONS[item.icon] }),
        el('span', {}, [el('strong', { text: item.label }), el('span', { text: item.href ? item.show : 'Link coming soon' })]),
        item.href ? el('span', { class: 'card-arrow', html: ICONS.arrow, style: 'width:18px' }) : el('span', { class: 'soon', text: 'Soon' })
      ];
      var attrs = { class: 'link-item' };
      if (item.href) {
        attrs.href = item.href;
        if (/^https?:/.test(item.href)) attrs.rel = 'noopener';
        if (item.key === 'resume') attrs.download = '';
      }
      contactLinks.appendChild(el('li', {}, [el(item.href ? 'a' : 'div', attrs, inner)]));
    });
  }

  // ---------- blog page: search, section + tag filters ----------

  var blogList = document.getElementById('blog-list');
  if (blogList) {
    POSTS.forEach(function (p) { blogList.appendChild(postCard(p)); });
    var cards = Array.prototype.slice.call(blogList.children);
    var search = document.getElementById('blog-search');
    var chips = Array.prototype.slice.call(document.querySelectorAll('#blog-filters .chip'));
    var count = document.getElementById('blog-count');
    var noMatch = document.getElementById('blog-nomatch');
    var tagNote = document.getElementById('blog-tag');
    var state = { section: params.get('section') || 'all', tag: params.get('tag') || '', q: params.get('q') || '' };
    search.value = state.q;

    var apply = function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var tags = card.getAttribute('data-tags').split(' ');
        var match = (state.section === 'all' || card.getAttribute('data-section') === state.section) &&
          (!state.tag || tags.indexOf(state.tag) !== -1) &&
          (!q || card.textContent.toLowerCase().indexOf(q) !== -1);
        card.hidden = !match;
        if (match) shown++;
      });
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === state.section)); });
      count.textContent = shown === 1 ? 'Showing 1 article' : 'Showing ' + shown + ' articles';
      noMatch.hidden = shown !== 0;
      tagNote.hidden = !state.tag;
      if (state.tag) tagNote.querySelector('strong').textContent = '#' + state.tag;
    };

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () { state.section = chip.getAttribute('data-filter'); apply(); });
    });
    search.addEventListener('input', apply);
    tagNote.querySelector('button').addEventListener('click', function () { state.tag = ''; apply(); });
    document.getElementById('blog-reset').addEventListener('click', function () {
      state = { section: 'all', tag: '', q: '' };
      search.value = '';
      apply();
      search.focus();
    });

    // Tag cloud of every tag in use
    var cloud = document.getElementById('tag-cloud');
    if (cloud) {
      var counts = {};
      POSTS.forEach(function (p) { (p.tags || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
      Object.keys(counts).sort().forEach(function (t) {
        var b = el('button', { type: 'button', class: 'tag', text: '#' + t + ' ' + counts[t] });
        b.addEventListener('click', function () { state.tag = t; apply(); blogList.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); });
        cloud.appendChild(el('li', {}, [b]));
      });
    }
    apply();
  }

  // ---------- projects page: status filter ----------

  var projectFilters = document.getElementById('project-filters');
  if (projectFilters) {
    var pChips = Array.prototype.slice.call(projectFilters.querySelectorAll('.chip'));
    var pCards = Array.prototype.slice.call(document.querySelectorAll('#project-list .project-card'));
    var pCount = document.getElementById('project-count');
    var applyStatus = function (status) {
      var n = 0;
      pCards.forEach(function (c) {
        var show = status === 'all' || c.getAttribute('data-status') === status;
        c.hidden = !show;
        if (show) n++;
      });
      pChips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === status)); });
      pCount.textContent = n === 1 ? 'Showing 1 project' : 'Showing ' + n + ' projects';
    };
    pChips.forEach(function (chip) {
      var s = chip.getAttribute('data-filter');
      var n = s === 'all' ? pCards.length : pCards.filter(function (c) { return c.getAttribute('data-status') === s; }).length;
      chip.appendChild(el('span', { class: 'muted', text: ' ' + n }));
      chip.addEventListener('click', function () { applyStatus(s); });
    });
    applyStatus('all');
  }

  // ---------- article pages ----------

  var article = document.querySelector('[data-post]');
  if (article) {
    var slug = article.getAttribute('data-post');
    var post = ALL_POSTS.filter(function (p) { return p.slug === slug; })[0];
    var published = (window.POSTS || []).filter(function (p) { return p.status === 'published'; })
      .sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });

    if (post) {
      var tagList = article.querySelector('[data-post-tags]');
      if (tagList) (post.tags || []).forEach(function (t) {
        tagList.appendChild(el('li', {}, [el('a', { class: 'tag', href: ROOT + 'blog.html?tag=' + encodeURIComponent(t), text: '#' + t })]));
      });

      if (post.status === 'draft') {
        var head = article.querySelector('.article-head');
        head.insertBefore(el('div', { class: 'draft-banner', role: 'note' }, [
          statusBadge('draft'),
          el('span', { text: 'This article is a draft. It is hidden from every list on the site until its status is set to published.' })
        ]), head.firstChild);
      }

      // Previous / next in publish order
      var nav = article.querySelector('[data-post-nav]');
      var idx = published.indexOf(post);
      if (nav && idx !== -1) {
        var prev = published[idx - 1];
        var next = published[idx + 1];
        if (prev) nav.appendChild(el('a', { class: 'prev', href: postUrl(prev) }, [el('span', { text: '← Previous' }), prev.title]));
        if (next) nav.appendChild(el('a', { class: 'next', href: postUrl(next) }, [el('span', { text: 'Next →' }), next.title]));
        if (!prev && !next) nav.remove();
      }

      // Related: shared tags count double, same section counts once; fall back to newest.
      var related = document.querySelector('[data-related]');
      if (related) {
        var pool = published.filter(function (p) { return p !== post; }).map(function (p) {
          var shared = (p.tags || []).filter(function (t) { return (post.tags || []).indexOf(t) !== -1; }).length;
          return { p: p, score: shared * 2 + (p.section === post.section ? 1 : 0) };
        }).sort(function (a, b) { return b.score - a.score || (a.p.date < b.p.date ? 1 : -1); }).slice(0, 3);
        pool.forEach(function (r) { related.appendChild(postCard(r.p)); });
        if (!pool.length) related.closest('section').hidden = true;
      }
    }
  }

  // Project detail aside: <aside data-project="slug">
  var projectAside = document.querySelector('[data-project]');
  if (projectAside) {
    var proj = (window.PROJECTS || []).filter(function (p) { return p.slug === projectAside.getAttribute('data-project'); })[0];
    if (proj) {
      var actions = [];
      if (proj.demo) actions.push(el('a', { class: 'btn btn-primary', href: proj.demo, rel: 'noopener', html: 'View live site ' + ICONS.external }));
      if (proj.repo) actions.push(el('a', { class: 'btn btn-ghost', href: proj.repo, rel: 'noopener', html: ICONS.github + ' View the code' }));
      if (!actions.length) actions.push(el('p', { class: 'small', text: proj.status === 'planned' ? 'No code or demo yet. This project is still in planning.' : 'Code and demo links will appear here when they are ready.' }));
      projectAside.appendChild(el('div', {}, [el('h2', { text: 'Status' }), statusBadge(proj.status)]));
      projectAside.appendChild(el('dl', {}, [
        el('div', {}, [el('dt', { text: 'Area' }), el('dd', { text: sectionFor(proj.section).name })]),
        proj.started ? el('div', {}, [el('dt', { text: 'Started' }), el('dd', { text: formatDate(proj.started) })]) : null,
        el('div', {}, [el('dt', { text: proj.status === 'planned' ? 'Planned stack' : 'Built with' }), el('dd', {}, [
          el('ul', { class: 'tag-list' }, proj.tech.map(function (t) { return el('li', {}, [el('span', { class: 'tag', text: t })]); }))
        ])])
      ]));
      projectAside.appendChild(el('div', { class: 'stack', style: 'gap:10px' }, actions));
    }
  }

  // ---------- code blocks: label, copy button, highlighting ----------

  document.querySelectorAll('.prose pre > code').forEach(function (code) {
    var pre = code.parentNode;
    var lang = (code.className.match(/language-(\w+)/) || [])[1] || 'text';
    var label = { bash: 'Terminal', sh: 'Terminal', shell: 'Terminal', js: 'JavaScript', javascript: 'JavaScript', json: 'JSON', python: 'Python', py: 'Python', yaml: 'YAML', yml: 'YAML', html: 'HTML', text: 'Output' }[lang] || lang;
    var copy = el('button', { type: 'button', class: 'copy-btn', text: 'Copy' });
    var wrap = el('div', { class: 'code-block' }, [el('div', { class: 'code-head' }, [el('span', { class: 'code-lang', text: label }), copy])]);
    var raw = code.textContent;
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    pre.setAttribute('tabindex', '0');
    copy.addEventListener('click', function () {
      var text = /^(bash|sh|shell)$/.test(lang) ? raw.replace(/^\s*\$ /gm, '') : raw;
      var done = function () { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { copy.textContent = 'Press Ctrl+C'; });
    });
  });
  if (window.highlightCode) window.highlightCode();

  // ---------- contact form ----------

  var form = document.getElementById('contact-form');
  if (form) {
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var status = document.getElementById('form-status');
    var send = form.querySelector('button[type="submit"]');
    if (SITE.formEndpoint) form.action = SITE.formEndpoint;
    var rules = {
      name: function (v) { return v.trim().length > 0; },
      email: function (v) { return EMAIL_RE.test(v.trim()); },
      message: function (v) { return v.trim().length >= 10; }
    };
    var show = function (kind, text) { status.hidden = false; status.className = 'form-status ' + kind; status.textContent = text; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (key) {
        var field = form.elements[key];
        var ok = rules[key](field.value);
        field.setAttribute('aria-invalid', String(!ok));
        document.getElementById(key + '-error').hidden = ok;
        if (!ok && !firstBad) firstBad = field;
      });
      if (firstBad) { firstBad.focus(); return; }
      if (form.elements._gotcha && form.elements._gotcha.value) return; // bot filled the hidden field
      send.disabled = true;
      send.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) { if (!res.ok) throw new Error('Request failed'); })
        .then(function () {
          form.reset();
          show('success', 'Thanks! Your message is on its way. I will get back to you as soon as I can.');
          status.focus();
        })
        .catch(function () { show('error', 'Something went wrong sending your message. Please try again in a moment.'); })
        .then(function () { send.disabled = false; send.textContent = 'Send message'; });
    });
  }

  // ---------- hero terminal ----------

  var term = document.getElementById('terminal-body');
  if (term) {
    var lines = [
      ['$ ', 'whoami', 'cmd'],
      ['', 'johnice · cybersecurity student · future cloud engineer', 'out'],
      ['$ ', 'cat currently_learning.txt', 'cmd'],
      ['', 'networking  linux  cloud  ai-agents  automation', 'hl'],
      ['$ ', 'ls ~/projects', 'cmd'],
      ['', 'tech-site/  realty-site/  ai-home-tools/', 'out'],
      ['$ ', 'git commit -m "keep learning"', 'cmd'],
      ['', '✓ progress saved', 'ok']
    ];
    var render = function (line, text) {
      var span = el('span', { class: 'ln' });
      if (line[0]) { span.appendChild(el('span', { class: 'prompt', text: '➜ ' })); span.appendChild(el('span', { class: 'path', text: '~ ' })); }
      span.appendChild(el('span', { class: line[2] === 'cmd' ? '' : line[2], text: text }));
      return span;
    };
    var caret = el('span', { class: 'caret', 'aria-hidden': 'true' });
    if (REDUCED) {
      lines.forEach(function (l) { term.appendChild(render(l, l[1])); });
      term.appendChild(caret);
    } else {
      var li = 0;
      var typeLine = function () {
        if (li >= lines.length) { term.appendChild(caret); return; }
        var line = lines[li++];
        var node = render(line, '');
        var target = node.lastChild;
        term.appendChild(node);
        node.appendChild(caret);
        if (line[2] !== 'cmd') { target.textContent = line[1]; setTimeout(typeLine, 260); return; }
        var ci = 0;
        var tick = function () {
          target.textContent = line[1].slice(0, ++ci);
          if (ci < line[1].length) setTimeout(tick, 34 + Math.random() * 40);
          else setTimeout(typeLine, 380);
        };
        setTimeout(tick, 420);
      };
      typeLine();
    }
  }

  // ---------- motion: reveal on scroll, card spotlight ----------

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (node, i) {
      if (!node.style.getPropertyValue('--delay')) node.style.setProperty('--delay', (i % 3) * 0.08 + 's');
      io.observe(node);
    });
  } else {
    reveals.forEach(function (node) { node.classList.add('in'); });
  }

  document.addEventListener('pointermove', function (e) {
    var card = e.target.closest && e.target.closest('.project-card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });
})();

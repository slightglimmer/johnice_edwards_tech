// Shared header, footer and icons. Every page includes:
//   <body data-root="" data-page="home">            (data-root is "../" in posts/ and projects/)
//   <header class="site-header" id="site-header"></header>
//   <footer class="site-footer" id="site-footer"></footer>
// so the navigation lives in exactly one place.
(function () {
  'use strict';

  var ROOT = document.body.getAttribute('data-root') || '';
  var PAGE = document.body.getAttribute('data-page') || '';
  var SITE = window.SITE || { links: {} };

  var I = function (paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  };

  var ICONS = window.ICONS = {
    terminal: I('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/>'),
    network: I('<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M12 7.2v4.3M12 11.5 6.4 16.3M12 11.5l5.6 4.8"/>'),
    cloud: I('<path d="M7 18h10.5a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.6 9.1 4.5 4.5 0 0 0 7 18Z"/>'),
    shield: I('<path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),
    spark: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>'),
    flow: I('<rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="15" y="14" width="6" height="6" rx="1.5"/><path d="M6 10v3a3 3 0 0 0 3 3h6"/><path d="m13 14 2 2-2 2"/>'),
    server: I('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6"/>'),
    book: I('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
    github: I('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
    linkedin: I('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'),
    file: I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    external: I('<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: I('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    rss: I('<path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8"/><circle cx="6" cy="18" r="1.2"/>')
  };

  var MARK = '<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="jeg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6E95FF"/><stop offset="1" stop-color="#C9A8FF"/></linearGradient></defs>' +
    '<rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="none" stroke="url(#jeg)" stroke-width="2"/>' +
    '<path d="M13 13.5h5.5v9.2a4 4 0 0 1-4 4H12" fill="none" stroke="url(#jeg)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M28 13.5h-6.2v13.2H28M21.8 20h5" fill="none" stroke="url(#jeg)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  var NAV = [
    { id: 'diaries', label: 'Tech Diaries', href: 'diaries.html' },
    { id: 'ai', label: 'AI & Automation', href: 'ai.html' },
    { id: 'systems', label: 'Systems & Cloud', href: 'systems.html' },
    { id: 'projects', label: 'Projects', href: 'projects.html' },
    { id: 'about', label: 'About', href: 'about.html' },
    { id: 'contact', label: 'Contact', href: 'contact.html' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var header = document.getElementById('site-header');
  if (header) {
    header.innerHTML =
      '<div class="wrap header-inner">' +
        '<a class="brand" href="' + ROOT + 'index.html" aria-label="Johnice Edwards Tech, home">' + MARK +
          '<span class="brand-text"><span class="brand-name">Johnice Edwards</span><span class="brand-sub">~/tech</span></span></a>' +
        '<nav class="site-nav" aria-label="Main">' +
          '<ul class="nav-list" id="nav-list">' +
            NAV.map(function (n) {
              return '<li><a href="' + ROOT + n.href + '"' + (n.id === PAGE ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a></li>';
            }).join('') +
          '</ul>' +
          '<button class="icon-btn theme-toggle" type="button" aria-label="Switch to light theme">' +
            '<span class="icon-moon">' + ICONS.moon + '</span><span class="icon-sun">' + ICONS.sun + '</span></button>' +
          '<button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list" aria-label="Open menu">' + ICONS.menu + '</button>' +
        '</nav>' +
      '</div>';

    var toggle = header.querySelector('.nav-toggle');
    var list = header.querySelector('#nav-list');
    toggle.addEventListener('click', function () {
      var open = list.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.innerHTML = open ? ICONS.close : ICONS.menu;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('open')) { toggle.click(); toggle.focus(); }
    });

    var themeBtn = header.querySelector('.theme-toggle');
    var syncThemeLabel = function () {
      var light = document.documentElement.getAttribute('data-theme') === 'light';
      themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    };
    syncThemeLabel();
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('jet-theme', next); } catch (e) { /* storage unavailable: theme lasts this visit */ }
      syncThemeLabel();
    });
  }

  // A social/contact link, or "Coming soon" text when the value is still empty in content/site.js.
  window.socialLink = function (value, label, isMail) {
    if (!value) return '<span class="muted">' + esc(label) + ' · coming soon</span>';
    var href = isMail ? 'mailto:' + value : (/^https?:/.test(value) ? value : ROOT + value);
    return '<a href="' + esc(href) + '"' + (/^https?:/.test(value) ? ' rel="noopener"' : '') + '>' + esc(label) + '</a>';
  };

  var footer = document.getElementById('site-footer');
  if (footer) {
    var L = SITE.links || {};
    footer.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="' + ROOT + 'index.html">' + MARK + '<span class="brand-text"><span class="brand-name">Johnice Edwards</span><span class="brand-sub">~/tech</span></span></a>' +
            '<p>Learning technology, building things, and documenting the journey: cybersecurity, systems, networking, cloud and AI.</p>' +
          '</div>' +
          '<div><h2>Read</h2><ul>' +
            '<li><a href="' + ROOT + 'diaries.html">The Tech Diaries</a></li>' +
            '<li><a href="' + ROOT + 'ai.html">AI &amp; Automation</a></li>' +
            '<li><a href="' + ROOT + 'systems.html">Systems, Networks &amp; Cloud</a></li>' +
            '<li><a href="' + ROOT + 'blog.html">All articles</a></li>' +
            '<li><a href="' + ROOT + 'feed.xml">RSS feed</a></li>' +
          '</ul></div>' +
          '<div><h2>Build</h2><ul>' +
            '<li><a href="' + ROOT + 'projects.html">Projects &amp; Experiments</a></li>' +
            '<li><a href="' + ROOT + 'index.html#exploring">Currently exploring</a></li>' +
            '<li><a href="' + ROOT + 'projects/johnice-edwards-tech.html">How this site is built</a></li>' +
          '</ul></div>' +
          '<div><h2>Connect</h2><ul>' +
            '<li><a href="' + ROOT + 'about.html">About me</a></li>' +
            '<li><a href="' + ROOT + 'contact.html">Contact</a></li>' +
            '<li>' + window.socialLink(L.github, 'GitHub') + '</li>' +
            '<li>' + window.socialLink(L.linkedin, 'LinkedIn') + '</li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© ' + new Date().getFullYear() + ' Johnice Edwards · Plain HTML, CSS &amp; JavaScript · No trackers</span>' +
          '<span>Also by me: <a href="https://johniceedwardsrealty.com/">Johnice Edwards Realty</a></span>' +
        '</div>' +
      '</div>';
  }
})();

// A small, dependency-free syntax highlighter for tutorial code blocks.
// Usage in a post: <pre><code class="language-bash">…</code></pre>
// Supported: bash/shell, js/javascript, json, python, yaml, html, text (no colors).
// Each language is a list of [token class, pattern]; patterns must not use capturing groups.
(function () {
  'use strict';

  var W = function (words) { return new RegExp('\\b(?:' + words.join('|') + ')\\b'); };
  var STR_DQ = /"(?:[^"\\\n]|\\.)*"/;
  var STR_SQ = /'(?:[^'\\\n]|\\.)*'/;
  var NUM = /\b\d+(?:\.\d+)*\b/;

  var LANGS = {
    bash: [
      ['comment', /#(?![!{]).*$/],
      ['prompt', /^\s*\$ (?=\S)/],
      ['string', STR_DQ], ['string', STR_SQ],
      ['var', /\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/],
      ['flag', /(?:^|(?<=\s))--?[A-Za-z][\w-]*/],
      ['keyword', W(['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'function', 'export', 'return', 'sudo'])],
      ['builtin', W(['ls', 'cd', 'cat', 'grep', 'dig', 'nslookup', 'ssh', 'apt', 'systemctl', 'ip', 'ping', 'curl', 'git', 'echo', 'chmod', 'chown', 'mkdir', 'cp', 'mv', 'rm', 'node', 'npm', 'python3', 'traceroute', 'whois', 'host'])],
      ['number', NUM]
    ],
    js: [
      ['comment', /\/\/.*$|\/\*[\s\S]*?\*\//],
      ['string', STR_DQ], ['string', STR_SQ], ['string', /`(?:[^`\\]|\\.)*`/],
      ['prop', /\b[A-Za-z_$][\w$]*(?=\s*:(?!:))/],
      ['keyword', W(['var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'new', 'import', 'export', 'from', 'async', 'await', 'true', 'false', 'null', 'undefined', 'typeof', 'this'])],
      ['builtin', W(['window', 'document', 'console', 'JSON', 'Math', 'Array', 'Object', 'Promise', 'fetch'])],
      ['number', NUM],
      ['punct', /[{}[\]();,]/]
    ],
    json: [
      ['prop', /"(?:[^"\\\n]|\\.)*"(?=\s*:)/],
      ['string', STR_DQ],
      ['keyword', W(['true', 'false', 'null'])],
      ['number', /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
      ['punct', /[{}[\],:]/]
    ],
    python: [
      ['comment', /#.*$/],
      ['string', /"""[\s\S]*?"""|'''[\s\S]*?'''/], ['string', STR_DQ], ['string', STR_SQ],
      ['keyword', W(['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'import', 'from', 'as', 'with', 'try', 'except', 'finally', 'raise', 'True', 'False', 'None', 'and', 'or', 'not', 'lambda', 'yield', 'async', 'await'])],
      ['builtin', W(['print', 'len', 'range', 'open', 'str', 'int', 'list', 'dict', 'set', 'enumerate', 'zip'])],
      ['number', NUM]
    ],
    yaml: [
      ['comment', /#.*$/],
      ['prop', /^[ \t-]*[\w.-]+(?=\s*:)/],
      ['string', STR_DQ], ['string', STR_SQ],
      ['keyword', W(['true', 'false', 'null', 'yes', 'no'])],
      ['number', NUM]
    ],
    html: [
      ['comment', /<!--[\s\S]*?-->/],
      ['keyword', /<\/?[A-Za-z][\w-]*|\/?>/],
      ['string', STR_DQ], ['string', STR_SQ],
      ['prop', /\b[A-Za-z-:]+(?==)/]
    ]
  };
  LANGS.shell = LANGS.sh = LANGS.bash;
  LANGS.javascript = LANGS.js;
  LANGS.py = LANGS.python;
  LANGS.yml = LANGS.yaml;

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function highlight(code, lang) {
    var rules = LANGS[lang];
    if (!rules) return esc(code);
    var re = new RegExp(rules.map(function (r) { return '(' + r[1].source + ')'; }).join('|'), 'gm');
    var out = '';
    var last = 0;
    var m;
    while ((m = re.exec(code)) !== null) {
      if (m[0] === '') { re.lastIndex++; continue; }
      var i = 1;
      while (m[i] === undefined) i++;
      out += esc(code.slice(last, m.index)) + '<span class="tok-' + rules[i - 1][0] + '">' + esc(m[0]) + '</span>';
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  window.highlightCode = function (root) {
    (root || document).querySelectorAll('pre > code[class*="language-"]').forEach(function (code) {
      var lang = (code.className.match(/language-(\w+)/) || [])[1];
      code.innerHTML = highlight(code.textContent, lang);
    });
  };
})();

// Language picker: translates any page with Google Translate.
// Choice is kept in the "googtrans" cookie, so it carries across pages.
(function () {
  if (window.__shLang) return;
  window.__shLang = true;

  var LANGS = [
    ['en', 'English'], ['ur', 'اردو'], ['ar', 'العربية'], ['it', 'Italiano'],
    ['de', 'Deutsch'], ['fr', 'Français'], ['es', 'Español'], ['pt', 'Português'],
    ['nl', 'Nederlands'], ['pl', 'Polski'], ['tr', 'Türkçe'], ['ru', 'Русский'],
    ['zh-CN', '中文'], ['ja', '日本語'], ['hi', 'हिन्दी'], ['fa', 'فارسی']
  ];
  var RTL = { ur: 1, ar: 1, fa: 1 };

  function current() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'en';
  }
  function setCookie(v) {
    var host = location.hostname, exp = v ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    var val = v ? '/en/' + v : '';
    document.cookie = 'googtrans=' + val + '; path=/' + exp;
    document.cookie = 'googtrans=' + val + '; path=/; domain=' + host + exp;
  }

  var lang = current();

  // Hide Google's own toolbar and tooltips.
  var css = document.createElement('style');
  css.textContent =
    '.goog-te-banner-frame,iframe.skiptranslate,#goog-gt-tt,.goog-te-balloon-frame{display:none!important}' +
    'body{top:0!important}.goog-text-highlight{background:none!important;box-shadow:none!important}' +
    '#sh-lang{position:fixed;left:16px;bottom:16px;z-index:9998;font:500 14px/1.2 system-ui,sans-serif}' +
    '#sh-lang button{display:flex;align-items:center;gap:6px;padding:10px 14px;border-radius:999px;border:1px solid rgba(0,0,0,.12);background:#fff;color:#0f172a;box-shadow:0 4px 16px rgba(0,0,0,.15);cursor:pointer}' +
    '#sh-lang ul{position:absolute;left:0;bottom:48px;margin:0;padding:6px;list-style:none;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);max-height:60vh;overflow:auto;min-width:170px;display:none}' +
    '#sh-lang.open ul{display:block}' +
    '#sh-lang li a{display:block;padding:8px 10px;border-radius:8px;color:#0f172a;text-decoration:none}' +
    '#sh-lang li a:hover,#sh-lang li a[aria-current]{background:#f1f5f9}' +
    '@media (prefers-color-scheme:dark){#sh-lang button,#sh-lang ul{background:#0f172a;color:#f8fafc;border-color:rgba(255,255,255,.15)}#sh-lang li a{color:#f8fafc}#sh-lang li a:hover,#sh-lang li a[aria-current]{background:#1e293b}}';
  document.head.appendChild(css);

  function build() {
    var label = (LANGS.filter(function (l) { return l[0] === lang; })[0] || LANGS[0])[1];
    var box = document.createElement('div');
    box.id = 'sh-lang';
    box.className = 'notranslate';
    box.setAttribute('translate', 'no');
    box.innerHTML =
      '<button type="button" aria-haspopup="true" aria-expanded="false" aria-label="Change language">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>' +
      '<span>' + label + '</span></button><ul role="menu"></ul>';
    var ul = box.querySelector('ul');
    LANGS.forEach(function (l) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#';
      a.textContent = l[1];
      a.setAttribute('role', 'menuitem');
      if (RTL[l[0]]) a.dir = 'rtl';
      if (l[0] === lang) a.setAttribute('aria-current', 'true');
      a.onclick = function (e) {
        e.preventDefault();
        setCookie(l[0] === 'en' ? '' : l[0]);
        location.reload();
      };
      li.appendChild(a);
      ul.appendChild(li);
    });
    var btn = box.querySelector('button');
    btn.onclick = function () {
      var open = box.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    };
    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) { box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.body.appendChild(box);
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);

  if (lang !== 'en') {
    if (RTL[lang]) document.documentElement.dir = 'rtl';
    var holder = document.createElement('div');
    holder.id = 'google_translate_element';
    holder.style.display = 'none';
    (document.body || document.documentElement).appendChild(holder);
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
    };
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }
})();

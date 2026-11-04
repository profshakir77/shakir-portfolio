/* Consent-first Google Analytics. GA loads only after the visitor clicks Accept. */
(function () {
  var GA_ID = 'G-4ET1PWB9NZ', KEY = 'cookie-consent';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function loadGA() {
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    var s = document.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  function banner() {
    if (document.getElementById('cc-banner')) return;
    var d = document.createElement('div'); d.id = 'cc-banner';
    d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookie consent');
    d.innerHTML = '<p>I use optional analytics cookies (Google Analytics) to see which pages are useful. Nothing is set unless you accept. <a href="/privacy">Privacy policy</a></p>' +
      '<div class="cc-btns"><button type="button" id="cc-reject">Reject</button><button type="button" id="cc-accept">Accept</button></div>';
    var css = document.createElement('style');
    css.textContent = '#cc-banner{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;z-index:9999;background:#0B1F3A;color:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 12px 40px rgba(0,0,0,.3);font:14px/1.5 Inter,system-ui,sans-serif;display:flex;gap:14px;align-items:center;flex-wrap:wrap}' +
      '#cc-banner p{margin:0;flex:1 1 280px}#cc-banner a{color:#fff;text-decoration:underline}' +
      '.cc-btns{display:flex;gap:8px}#cc-banner button{font:600 14px Inter,system-ui,sans-serif;border-radius:8px;padding:9px 18px;cursor:pointer;border:1px solid #fff}' +
      '#cc-reject{background:transparent;color:#fff}#cc-accept{background:#fff;color:#0B1F3A}';
    document.head.appendChild(css); document.body.appendChild(d);
    document.getElementById('cc-accept').onclick = function () { set('granted'); d.remove(); loadGA(); };
    document.getElementById('cc-reject').onclick = function () { set('denied'); d.remove(); };
  }
  window.openCookieSettings = function () { try { localStorage.removeItem(KEY); } catch (e) {} banner(); };
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-cookie-settings]'); if (t) { e.preventDefault(); window.openCookieSettings(); } });
  var c = get();
  if (c === 'granted') loadGA();
  else if (c !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
  }
})();

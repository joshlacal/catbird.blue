/* Catbird theme bootstrap. Inlined in <head> before any stylesheet so the right
   data-theme is set before first paint (no flash). Exposes window.CatbirdTheme for the
   footer ThemePicker. Preferences: localStorage "catbird-theme" =
   {scheme: system|light|dim|black, contrast: system|more, cvd: off|on}. */
(function () {
  var d = document.documentElement;
  var KEY = 'catbird-theme';
  var BG = { light: '#ffffff', dim: '#2e2e33', black: '#000000', 'hc-light': '#ffffff', 'hc-dark': '#1c1c20', 'cvd-light': '#ffffff', 'cvd-dark': '#2e2e33' };
  d.classList.add('js');

  function mq(q) {
    try { return window.matchMedia(q).matches; } catch (e) { return false; }
  }
  function clean(p) {
    p = p && typeof p === 'object' ? p : {};
    return {
      scheme: ['system', 'light', 'dim', 'black'].indexOf(p.scheme) >= 0 ? p.scheme : 'system',
      contrast: p.contrast === 'more' ? 'more' : 'system',
      cvd: p.cvd === 'on' ? 'on' : 'off'
    };
  }
  function read() {
    try { return clean(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch (e) { return clean(null); }
  }
  function write(p) {
    p = clean(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* storage blocked: apply for this page only */ }
    apply(p);
    return p;
  }
  function resolve(p) {
    var base = p.scheme === 'system' ? (mq('(prefers-color-scheme: dark)') ? 'dim' : 'light') : p.scheme;
    var dark = base !== 'light';
    if (p.contrast === 'more' || mq('(prefers-contrast: more)')) return dark ? 'hc-dark' : 'hc-light';
    if (p.cvd === 'on') return dark ? 'cvd-dark' : 'cvd-light';
    return base;
  }
  var current = clean(null);
  function apply(p) {
    current = p || read();
    var theme = resolve(current);
    d.setAttribute('data-theme', theme);
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      if (current.scheme !== 'system' || current.contrast !== 'system' || current.cvd !== 'off') {
        metas[i].setAttribute('content', BG[theme]);
      } else {
        metas[i].setAttribute('content', metas[i].getAttribute('data-default') || BG[theme]);
      }
    }
    return theme;
  }
  function listen(q) {
    try {
      var m = window.matchMedia(q);
      var fn = function () { apply(current); };
      if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn);
    } catch (e) { /* no matchMedia */ }
  }
  apply(read());
  listen('(prefers-color-scheme: dark)');
  listen('(prefers-contrast: more)');
  try {
    window.addEventListener('storage', function (e) { if (e.key === KEY) apply(read()); });
  } catch (e) { /* ignore */ }
  window.CatbirdTheme = { read: read, write: write, apply: apply, resolve: resolve };
})();

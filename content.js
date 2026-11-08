// More Settings for Google Apps - content script.
// Only sets attributes on <html> (and builds one tiny SVG filter for "My colours"); dark.css does all the work.
// No MutationObservers, no per-element JS, so the page runs as fast as it does without the add-on.
(() => {
  'use strict';
  const root = document.documentElement;
  const app = msgAppFor(location.href);
  const LEVEL_A = { charcoal: 0.9074, soft: 0.82, grey: 0.88, black: 1 };
  // Slides "present" pages show slides full size: never darken them.
  const presenting = app === 'appSlides' && /\/present(\/|$)/.test(location.pathname);
  let s = { ...MSG_DEFAULTS };
  let sidePanelWas = null;

  // dark.css is dark by default so there's no white flash. If dark mode was off here last time, switch it off
  // before the first paint too (page localStorage is synchronous; storage.local isn't).
  const OFF_KEY = 'msgd-off-' + app;
  try { if (presenting || localStorage.getItem(OFF_KEY) === '1') root.setAttribute('data-msgd-off', ''); } catch { /* blocked */ }
  if (app) root.setAttribute('data-msgd-app', app);

  // ---------- "My colours" for the Docs page ----------
  // Everything on screen goes through the page-wide filter F = invert(a) then hue-rotate(180°). So the page gets
  // G = F⁻¹ ∘ T, where T maps white -> background and black -> text. One SVG filter, 3-4 steps:
  //   [hue 180° if the background is darker than the text, so coloured text keeps its colour]
  //   T per channel: out = text + (bg - text) · in
  //   hue 180° (undoes F's hue turn)
  //   per channel: out = (in - a) / (1 - 2a) (undoes F's invert)
  // F can only output values between 1-a and a, so "a" is raised just enough to reach your colours (exact colours).
  const NS = 'http://www.w3.org/2000/svg';
  let svgParts = null;
  function buildFilter() {
    if (svgParts) return true;
    try {
      const el = (tag, attrs = {}) => {
        const n = document.createElementNS(NS, tag);
        for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
        return n;
      };
      const svg = el('svg', { 'aria-hidden': 'true', width: '0', height: '0' });
      svg.style.cssText = 'position:absolute!important;width:0!important;height:0!important;overflow:hidden!important';
      const filter = el('filter', { id: 'msgd-page-map', 'color-interpolation-filters': 'sRGB', x: '0', y: '0', width: '1', height: '1' });
      const preHue = el('feColorMatrix', { type: 'hueRotate', values: '180' });
      const target = el('feComponentTransfer');
      const midHue = el('feColorMatrix', { type: 'hueRotate', values: '180' });
      const undo = el('feComponentTransfer');
      const fT = ['R', 'G', 'B'].map((c) => target.appendChild(el('feFunc' + c, { type: 'linear' })));
      const fU = ['R', 'G', 'B'].map((c) => undo.appendChild(el('feFunc' + c, { type: 'linear' })));
      filter.append(preHue, target, midHue, undo);
      svg.appendChild(filter);
      root.appendChild(svg);
      svgParts = { preHue, fT, fU };
      return true;
    } catch {
      svgParts = null;
      return false;
    }
  }
  const channels = (hex) => [0, 1, 2].map((i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255);
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  function applyCustom() {
    const bg = channels(s.pageBg), text = channels(s.pageText);
    const levelA = LEVEL_A[s.level] ?? 0.88;
    const a = Math.min(1, Math.max(levelA, ...[...bg, ...text].map((v) => Math.max(v, 1 - v))));
    // Coloured text keeps its hue only if the filter flips light/dark: skip the first hue turn for light backgrounds.
    svgParts.preHue.setAttribute('values', lum(bg) < lum(text) ? '180' : '0');
    svgParts.fT.forEach((f, i) => {
      f.setAttribute('slope', String(bg[i] - text[i]));
      f.setAttribute('intercept', String(text[i]));
    });
    const d = 1 - 2 * a;
    svgParts.fU.forEach((f) => {
      f.setAttribute('slope', String(1 / d));
      f.setAttribute('intercept', String(-a / d));
    });
    // The page-wide filter (and the picture fix) use the raised a.
    root.style.setProperty('--msgd-a', String(a));
    root.style.setProperty('--msgd-k', String(1 / (2 * a - 1)));
    root.style.setProperty('--msgd-b', '1');
    root.style.setProperty('--msgd-ib', '1');
  }

  function apply() {
    const dark = !presenting && s.darkMode && s[app] !== false;
    root.toggleAttribute('data-msgd-off', !dark);
    try { localStorage.setItem(OFF_KEY, dark ? '0' : '1'); } catch { /* blocked */ }
    if (root.getAttribute('data-msgd-level') !== s.level) root.setAttribute('data-msgd-level', s.level);

    let page = s.docPage;
    const custom = page === 'custom' && dark && app === 'appDocs'
      && MSG_HEX.test(s.pageBg) && MSG_HEX.test(s.pageText) && buildFilter();
    // Only point the CSS at the filter once it exists: a missing filter would hide the page.
    if (custom) applyCustom();
    else {
      if (page === 'custom') page = 'dark';
      root.style.removeProperty('--msgd-a');
      root.style.removeProperty('--msgd-k');
      root.style.removeProperty('--msgd-b');
      root.style.removeProperty('--msgd-ib');
    }
    if (root.getAttribute('data-msgd-page') !== page) root.setAttribute('data-msgd-page', page);

    if (root.getAttribute('data-msgd-img') !== s.imageMode) root.setAttribute('data-msgd-img', s.imageMode);
    root.toggleAttribute('data-msgd-nogemini', !!s.hideGemini);
    root.toggleAttribute('data-msgd-nohelpme', !!s.hideHelpMe);
    root.toggleAttribute('data-msgd-nomeet', !!s.hideMeet);
    root.toggleAttribute('data-msgd-noside', !!s.hideSidePanel);
    root.toggleAttribute('data-msgd-thin', !!s.thinScrollbars);
    // Docs sizes the editor in JS; nudge it to re-measure when the side panel appears or goes.
    if (sidePanelWas !== null && sidePanelWas !== !!s.hideSidePanel) {
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }
    sidePanelWas = !!s.hideSidePanel;
  }

  // Changes that arrive before the first load are kept, not overwritten by the older stored values.
  const early = {};
  let loaded = false;
  browser.storage.local.get(MSG_DEFAULTS).then((got) => { s = { ...s, ...got, ...early }; loaded = true; apply(); });
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const k in changes) {
      s[k] = changes[k].newValue ?? MSG_DEFAULTS[k];
      if (!loaded) early[k] = s[k];
    }
    if (loaded) apply();
  });

  // Presenting in Slides / fullscreen video: show true colours.
  document.addEventListener('fullscreenchange', () => {
    root.toggleAttribute('data-msgd-fs', !!document.fullscreenElement);
  });
})();

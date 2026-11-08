// More Settings for Google Docs - content script.
// Only sets attributes on <html>; dark.css does all the work. No MutationObservers, no per-element JS,
// so the page runs as fast as it does without the add-on.
(() => {
  'use strict';
  const root = document.documentElement;
  const app = msgAppFor(location.href);
  let s = { ...MSG_DEFAULTS };
  let sidePanelWas = null;

  function apply() {
    const dark = s.darkMode && s[app] !== false;
    // dark.css is dark by default (so there's no white flash while settings load); this switches it off.
    root.toggleAttribute('data-msgd-off', !dark);
    root.setAttribute('data-msgd-level', s.level);
    root.setAttribute('data-msgd-page', s.docPage);
    root.toggleAttribute('data-msgd-img', !!s.keepImages);
    root.toggleAttribute('data-msgd-nogemini', !!s.hideGemini);
    root.toggleAttribute('data-msgd-nohelpme', !!s.hideHelpMe);
    root.toggleAttribute('data-msgd-nomeet', !!s.hideMeet);
    root.toggleAttribute('data-msgd-noside', !!s.hideSidePanel);
    root.toggleAttribute('data-msgd-thin', !!s.thinScrollbars);
    // Docs sizes the editor in JS; nudge it to re-measure when the side panel appears or goes.
    if (sidePanelWas !== null && sidePanelWas !== s.hideSidePanel) {
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }
    sidePanelWas = !!s.hideSidePanel;
  }

  browser.storage.local.get(MSG_DEFAULTS).then((got) => { s = { ...s, ...got }; apply(); });
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    for (const k in changes) s[k] = changes[k].newValue ?? MSG_DEFAULTS[k];
    apply();
  });

  // Slides presenting / fullscreen video: show true colours.
  document.addEventListener('fullscreenchange', () => {
    root.toggleAttribute('data-msgd-fs', !!document.fullscreenElement);
  });
})();

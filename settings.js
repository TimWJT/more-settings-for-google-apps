// Default settings, shared by content.js and popup.js.
const MSG_DEFAULTS = {
  // Dark mode
  darkMode: true,
  level: 'charcoal',      // charcoal (like Claude's dark mode) | soft | grey | black
  docPage: 'dark',        // dark | dim | white | custom  (the page you type on in Docs)
  pageBg: '#000000',      // custom: what white on the page becomes
  pageText: '#ffffff',    // custom: what black text becomes
  imageMode: 'real',      // real | dim | flip  (photos and profile pictures)
  // Apps
  appDocs: true,
  appSheets: true,
  appSlides: true,
  appForms: true,
  appGmail: true,
  // Clean up
  hideGemini: false,
  hideHelpMe: false,
  hideMeet: false,
  hideSidePanel: false,
  thinScrollbars: true,
};

// Ready-made page colour pairs for the custom Docs page: [name, background, text].
const MSG_PAGE_PRESETS = [
  ['Charcoal', '#181818', '#ebebeb'],
  ['Black', '#000000', '#ffffff'],
  ['Graphite', '#1e1e1e', '#e6e6e6'],
  ['Night blue', '#0f1729', '#d6e2ff'],
  ['Sepia night', '#1f1a14', '#eadbc0'],
  ['Green', '#0c1410', '#b8f5c8'],
  ['Paper', '#f4ecd8', '#3b2f22'],
];
const MSG_HEX = /^#[0-9a-f]{6}$/i;

// Which app a URL belongs to (null = not one we handle).
function msgAppFor(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (u.hostname === 'mail.google.com') return 'appGmail';
  if (u.hostname !== 'docs.google.com') return null;
  if (u.pathname.startsWith('/spreadsheets')) return 'appSheets';
  if (u.pathname.startsWith('/presentation')) return 'appSlides';
  if (u.pathname.startsWith('/forms')) return 'appForms';
  return 'appDocs';
}

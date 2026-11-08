// Default settings, shared by content.js, popup.js and background.js.
const MSG_DEFAULTS = {
  // Dark mode
  darkMode: true,
  level: 'grey',          // soft | grey | black
  docPage: 'dark',        // dark | dim | white  (the page you type on in Docs)
  keepImages: true,       // pictures, avatars and thumbnails keep their real colours
  // Apps
  appDocs: true,
  appSheets: true,
  appSlides: true,
  appForms: true,
  appDrive: true,
  appCalendar: true,
  appKeep: true,
  // Clean up
  hideGemini: false,
  hideHelpMe: false,
  hideMeet: false,
  hideSidePanel: false,
  thinScrollbars: true,
};

// Which app a URL belongs to (null = not one we handle).
function msgAppFor(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (u.hostname === 'drive.google.com') return 'appDrive';
  if (u.hostname === 'calendar.google.com') return 'appCalendar';
  if (u.hostname === 'keep.google.com') return 'appKeep';
  if (u.hostname !== 'docs.google.com') return null;
  if (u.pathname.startsWith('/spreadsheets')) return 'appSheets';
  if (u.pathname.startsWith('/presentation')) return 'appSlides';
  if (u.pathname.startsWith('/forms')) return 'appForms';
  return 'appDocs';
}

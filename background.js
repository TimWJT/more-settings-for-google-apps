// More Settings for Google Docs - Alt+Shift+D toggles dark mode (change it in about:addons > gear > Manage Extension Shortcuts).
browser.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-dark') return;
  const { darkMode } = await browser.storage.local.get({ darkMode: MSG_DEFAULTS.darkMode });
  browser.storage.local.set({ darkMode: !darkMode });
});

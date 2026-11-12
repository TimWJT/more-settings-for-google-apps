# Store listing: More Settings for Google Apps

Copy these into the fields on addons.mozilla.org when you submit.

## Name
More Settings for Google Apps

## Summary (max 250 characters)
Fast dark mode for Google Docs, Sheets, Slides, Forms and Gmail (emails included), with your own page colours, plus clean-up options like hiding Gemini and the side panel.

## Description
(AMO joins plain lines into one paragraph, so the list uses Markdown "- " bullets with blank lines around it.)

A dark mode for Google Docs that doesn't lag. Most dark-mode add-ons recolour the page bit by bit while you type. This one uses a single colour filter, so typing stays as fast as normal.

- **Dark mode** for Docs, Sheets, Slides and Forms, with a choice of darkness (charcoal, soft, dark grey or black)
- **Your own page colours**, like white text on black. Only what you see changes: the file, other people and printing keep the real colours
- **Dark emails in Gmail**: Gmail's own dark theme leaves opened emails white, so this darkens just the email itself
- **Pictures keep their real colours**, or dim them, or make them dark too
- **Hide clutter**: Gemini, "Help me" chips and the side panel
- **Turn it off per app** for Docs, Sheets, Slides or Forms

It only runs on docs.google.com and mail.google.com.

No data collected. Not affiliated with Google.

## Categories
Appearance

## Tags
dark mode, google docs, gmail, sheets, slides, night mode

## License
All Rights Reserved (same as your other add-ons; the repo has no LICENSE file yet, so add one if you pick something else).

## Support website
https://github.com/TimWJT/more-settings-for-google-apps

## Privacy policy
Leave "This add-on has a Privacy Policy" unticked. It collects nothing.

## Notes for the reviewer
- No build step and no minified code. The files you upload are the source.
- Dark mode is one CSS filter on `<html>` (`dark.css`). `content.js` only sets a few attributes and CSS variables on `<html>` when settings change, adds one hidden SVG filter (only for the "My colours" Docs page), and has no MutationObservers. It also keeps a one-character on/off flag (`msgd-off-<app>`) in the page's localStorage so a page with dark mode off doesn't flash dark before settings load. Nothing is sent anywhere.
- Permissions: `storage` for settings, and access to docs.google.com and mail.google.com only. No network requests, no remote code.

# More Settings for Google Apps

Firefox add-on: a fast dark mode for Google Docs, Sheets, Slides, Forms and Gmail, plus clean-up options. It only runs on docs.google.com and mail.google.com and touches no other site.

**Gmail:** Gmail's own dark theme does the inbox but leaves the emails themselves white, so in Gmail only the content of an opened email is darkened. Keep Gmail's theme on Dark.

## Why it's fast

Most dark-mode add-ons watch every change on the page with JavaScript and rewrite colours element by element. Docs changes the page constantly while you type, so they lag. This one puts a single colour filter on the page (drawn by the GPU), and gives pictures the exact opposite filter so they keep their real colours. The script only sets a few attributes on `<html>` when settings change. It has no page watchers. See the comment at the top of `dark.css` for the maths.

## Settings

- **Dark mode**: one switch at the top of the popup turns it on and off, darkness (charcoal like Claude's dark mode: #181818 with #ebebeb text, soft, dark grey, black), and the Docs page (dark, my colours, dimmed white, or normal so only the toolbars and menus around it are dark).
- **My colours**: pick the Docs page's background and text colour (presets or hex), e.g. white text on black. It only changes what you see; the file, other people and printing keep the real colours. Coloured text keeps its colour.
- **Pictures**: real colours, real but dimmed, or dark like the page.
- **Popup tabs**: one Dark mode switch on top, then a tab per app (Docs, Gmail, General). The popup opens on the tab for the site you're on.
- **Gmail tab**: dark emails on/off (also makes Gmail's loading screen dark instead of white), their own darkness (default "Like Gmail": #2c2c2c with white text, like Gmail's unread rows; Charcoal (Claude) still there) and pictures setting, hide Gemini in Gmail.
- **Dark in**: turn it off for Docs, Sheets, Slides or Forms. Drive and Calendar aren't included: they have Google's own dark theme.
- **Hide** (Docs apps): Gemini, "Help me" chips and the right-hand side panel are hidden by default; the Meet button is optional.
- **General**: thin scrollbars (off by default).

## Try it

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and pick `manifest.json` in this folder.
3. Open a Google Doc. After editing a file, click **Reload** on the add-on there and refresh the tab.

## Known limits

- Docs draws text and pictures inside the document onto one canvas, so pictures *inside a doc* get flipped with the page in "Dark" mode. Set **Docs page** to "Dimmed white" or "White" to see them in true colours.
- Photos keep their colours, but very strong colours (bright red, yellow) look a little muted. That's the price of the one-filter approach; fixing it would mean per-element JS, which is what lags.
- Inside pop-up frames (share dialog, file picker), photos may show as negatives.
- The clean-up selectors were written without inspecting a signed-in Docs page. See TESTING.md.

## Build

```
npx web-ext build --overwrite-dest --ignore-files "*.md"
```

# More Settings for Google Docs

Firefox add-on: a fast dark mode for Google Docs, Sheets, Slides, Forms, Drive, Calendar and Keep, plus clean-up options.

## Why it's fast

Most dark-mode add-ons watch every change on the page with JavaScript and rewrite colours element by element. Docs changes the page constantly while you type, so they lag. This one puts a single colour filter on the page (drawn by the GPU), and gives pictures the exact opposite filter so they keep their real colours. The script only sets a few attributes on `<html>` when settings change. It has no page watchers. See the comment at the top of `dark.css` for the maths.

## Settings

- **Dark mode**: on/off (Alt+Shift+D), darkness (soft, dark grey, black), and the Docs page (dark, dimmed white, white).
- **Pictures**: keep photos, avatars and Drive thumbnails in real colours.
- **Apps**: turn dark mode off for any of the seven apps.
- **Clean up**: hide Gemini, "Help me" chips, the Meet button and the right-hand side panel. Thin scrollbars.

## Try it

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and pick `manifest.json` in this folder.
3. Open a Google Doc. After editing a file, click **Reload** on the add-on there and refresh the tab.

## Known limits

- Docs draws text and pictures inside the document onto one canvas, so pictures *inside a doc* get flipped with the page in "Dark" mode. Set **Docs page** to "Dimmed white" or "White" to see them in true colours.
- The clean-up selectors were written without inspecting a signed-in Docs page. See TESTING.md.

## Build

```
npx web-ext build --overwrite-dest --ignore-files "*.md"
```

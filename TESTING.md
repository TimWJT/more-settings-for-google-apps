# Testing checklist

Tick these off in Firefox while signed in.

## Dark mode
- [ ] Docs: no white flash when opening a doc
- [ ] Docs: typing and scrolling a long doc feels as smooth as with the add-on off
- [ ] Docs page "Dimmed white" and "White" make only the page light (selectors `.kix-page-paginated`, `.kix-page-compact` for pageless)
- [ ] Sheets, Slides, Forms, Drive, Calendar, Keep look right
- [ ] Profile photos and Drive thumbnails keep real colours
- [ ] Slides: presenting (fullscreen) shows true colours
- [ ] Printing / print preview is normal (dark.css is screen-only)
- [ ] Alt+Shift+D toggles; the popup switch follows it
- [ ] Turning an app off in Apps turns it off live in that tab

## Clean up (selectors still unconfirmed)
- [ ] Hide Gemini: `[aria-label*="Gemini"]`
- [ ] Hide "Help me": `[aria-label^="Help me"]`
- [ ] Hide Meet: `[aria-label^="Join a call"]`
- [ ] Hide side panel: `.companion-app-switcher-container`; the editor should widen to fill the gap

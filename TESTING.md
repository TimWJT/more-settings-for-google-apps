# Testing checklist

Tick these off in Firefox while signed in.

## Dark mode
- [ ] Docs: no white flash when opening a doc
- [ ] Docs: typing and scrolling a long doc feels as smooth as with the add-on off
- [ ] Docs page "Dimmed white" and "White" make only the page light (selectors `.kix-page-paginated`, `.kix-page-compact` for pageless)
- [ ] My colours: each swatch gives exactly those colours on the page; red text stays red, links stay blue
- [ ] My colours: long doc scrolls smoothly (SVG filter on the page)
- [ ] Sheets, Slides, Forms look right
- [ ] Gmail (Gmail's Dark theme): opened emails are dark, including HTML newsletters (selector `.a3s`)
- [ ] Gmail: the white card around the email (subject, sender, Reply buttons) - still white? If so, send the class list
- [ ] Gmail: photos and logos inside emails keep real colours
- [ ] Gmail: compose window and Hide Gemini work
- [ ] Drive, Calendar and other sites are untouched
- [ ] Profile photos keep real colours
- [ ] Slides: presenting (fullscreen) shows true colours
- [ ] Printing / print preview is normal (dark.css is screen-only)
- [ ] The Dark mode switch turns it off and on live
- [ ] Unticking an app under Dark mode in turns it off live in that tab

## Clean up (selectors still unconfirmed)
- [ ] Hide Gemini: `[aria-label*="Gemini"]`
- [ ] Hide "Help me": `[aria-label^="Help me"]`
- [ ] Hide Meet: `[aria-label^="Join a call"]`
- [ ] Hide side panel: `.companion-app-switcher-container`; the editor should widen to fill the gap

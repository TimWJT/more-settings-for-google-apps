# Testing checklist

Tick these off in Firefox while signed in.

## Dark mode
- [ ] Docs: no white flash when opening a doc
- [ ] Docs: typing and scrolling a long doc feels as smooth as with the add-on off
- [ ] Docs page "Dimmed white" and "White" make only the page light (selectors `.kix-page-paginated`, `.kix-page-compact` for pageless)
- [ ] My colours: each swatch gives exactly those colours on the page; red text stays red, links stay blue
- [ ] My colours: long doc scrolls smoothly (SVG filter on the page)
- [ ] Sheets, Slides, Forms look right
- [ ] Gmail (Gmail's Dark theme): opened emails are dark, including HTML newsletters (main area while it holds an email: `[role="main"]:has(> .nH > .iY)`)
- [ ] Gmail: subject, sender and Reply buttons dark too; toolbar above and inbox untouched
- [ ] Gmail: photos and logos inside emails keep real colours
- [ ] Gmail: inbox loads as fast as with the add-on off (email rules only switch on while an email is open)
- [ ] Gmail: opening an email from the inbox, search, a label and Sent all darken it (address ends in the email id)
- [ ] Gmail: loading screen is dark (#111), not white (`#loading`, body)
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

## Speed test (Firefox, 2026-11-10)
Fake Gmail-sized inbox (1,000 rows, images, deep `.nH` nesting) inserted in 40 chunks, timing style work, median of 5:
no add-on ~200 ms; old 1.0.1 rules ~7,400-8,900 ms (`:has()` inside the picture rules, re-checked on every change);
1.0.2 ~185 ms with the inbox, ~197 ms with an email open. Rules with `:has()` cost nothing while a `:root` attribute gates them off.

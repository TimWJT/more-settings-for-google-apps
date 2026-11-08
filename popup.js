'use strict';

// Every setting, grouped into tabs and cards.
// switches: [key, label, hint]  ·  checks: [key, label]  ·  selects: [key, label, [[value, text], ...]]
const TABS = [
  {
    id: 'dark', label: 'Dark mode',
    cards: [
      { wide: true, master: true },
      {
        title: 'Look',
        selects: [
          ['level', 'Darkness', [['soft', 'Soft'], ['grey', 'Dark grey'], ['black', 'Black']]],
          ['docPage', 'Docs page', [['dark', 'Dark'], ['custom', 'My colours'], ['dim', 'Dimmed white'], ['white', 'White']]],
        ],
      },
      { wide: true, title: 'Docs page colours', colours: true },
      {
        title: 'Pictures',
        switches: [['keepImages', 'Real colours', 'Photos, avatars and Drive thumbnails aren\'t flipped']],
      },
    ],
  },
  {
    id: 'apps', label: 'Apps',
    cards: [
      {
        title: 'Dark mode in',
        checks: [
          ['appDocs', 'Docs'], ['appSheets', 'Sheets'], ['appSlides', 'Slides'], ['appForms', 'Forms'],
        ],
      },
      {
        title: ' ',
        checks: [['appDrive', 'Drive'], ['appCalendar', 'Calendar'], ['appKeep', 'Keep']],
      },
      { wide: true, note: 'Using Google\'s own dark theme in an app (like Calendar or Keep)? Untick it here, or it will come out light.' },
    ],
  },
  {
    id: 'cleanup', label: 'Clean up',
    cards: [
      {
        title: 'Hide',
        switches: [
          ['hideGemini', 'Gemini', 'Gemini buttons and side panel'],
          ['hideHelpMe', '"Help me" chips', 'Help me write / create'],
          ['hideMeet', 'Meet button', 'Join a call / present to Meet'],
          ['hideSidePanel', 'Side panel', 'Calendar, Keep, Tasks icons on the right'],
        ],
      },
      {
        title: 'Look',
        switches: [['thinScrollbars', 'Thin scrollbars', '']],
      },
    ],
  },
];

const APP_NAMES = {
  appDocs: 'Docs', appSheets: 'Sheets', appSlides: 'Slides', appForms: 'Forms',
  appDrive: 'Drive', appCalendar: 'Calendar', appKeep: 'Keep',
};

const $ = (id) => document.getElementById(id);
const save = (obj) => browser.storage.local.set(obj);
let current = { ...MSG_DEFAULTS };
let tabApp = null;

function h(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  n.append(...kids.filter((k) => k != null));
  return n;
}

// Inputs stay in sync with storage (Alt+Shift+D or another window can change a setting while the popup is open).
const bound = new Map();
function bindInput(input, key) {
  input.checked = !!current[key];
  input.addEventListener('change', () => save({ [key]: input.checked }));
  bound.set(key, [...(bound.get(key) || []), input]);
  return input;
}

function switchRow([key, label, hint]) {
  const input = bindInput(h('input', { type: 'checkbox', role: 'switch' }), key);
  return h('label', { class: 'row' },
    h('span', { class: 'switch' }, input, h('span', { 'aria-hidden': 'true' })),
    h('span', { class: 'label' },
      h('span', { class: 'name' }, label),
      hint ? h('small', {}, hint) : null));
}

function checkRow([key, label]) {
  const input = bindInput(h('input', { type: 'checkbox' }), key);
  return h('label', { class: 'check' }, input, h('span', { class: 'box', 'aria-hidden': 'true' }), h('span', {}, label));
}

function selectRow([key, label, options]) {
  const id = 'sel-' + key;
  const sel = h('select', { id }, ...options.map(([v, t]) => h('option', { value: v }, t)));
  sel.value = current[key];
  sel.addEventListener('change', () => save({ [key]: sel.value }));
  bound.set(key, [sel]);
  return h('label', { class: 'step-field', for: id }, label, sel);
}

function masterBlock() {
  const input = bindInput(h('input', { type: 'checkbox', role: 'switch' }), 'darkMode');
  const note = h('small', { id: 'master-note' });
  const row = h('label', { class: 'row big' },
    h('span', { class: 'switch' }, input, h('span', { 'aria-hidden': 'true' })),
    h('span', { class: 'label' }, h('span', { class: 'name' }, 'Dark mode'), note));
  renderNote(note);
  return row;
}

function renderNote(note = $('master-note')) {
  if (!note) return;
  let text = 'Alt+Shift+D turns it on and off';
  if (tabApp && current[tabApp] === false) text = `Off for ${APP_NAMES[tabApp]} (see Apps)`;
  note.textContent = text;
}

// ---------- My colours ----------
// Swatches plus hex boxes. No <input type="color">: Firefox closes the popup when its colour dialog opens.
function coloursBlock() {
  const swatches = MSG_PAGE_PRESETS.map(([name, bg, text]) =>
    h('button', {
      type: 'button', class: 'swatch', title: name, 'aria-label': name, 'data-bg': bg, 'data-text': text,
      style: `background:${bg};color:${text}`,
      onclick: () => save({ docPage: 'custom', pageBg: bg, pageText: text }),
    }, 'Aa'));
  const hexField = (key, label) => {
    const id = 'hex-' + key;
    const input = h('input', { id, type: 'text', class: 'hex', maxlength: '7', spellcheck: 'false', autocomplete: 'off' });
    input.value = current[key];
    const commit = () => {
      let v = input.value.trim();
      if (!v.startsWith('#')) v = '#' + v;
      if (MSG_HEX.test(v)) { input.classList.remove('bad'); save({ docPage: 'custom', [key]: v.toLowerCase() }); }
      else input.classList.add('bad');
    };
    input.addEventListener('change', commit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); });
    bound.set(key, [input]);
    return h('label', { class: 'step-field', for: id }, label, input);
  };
  const block = h('div', { class: 'colours' },
    h('div', { class: 'swatches' }, ...swatches),
    h('div', { class: 'hexes' }, hexField('pageBg', 'Background'), hexField('pageText', 'Text')),
    h('small', {}, 'Only changes what you see. The file, other people and printing keep the real colours.'));
  return block;
}

function renderColours() {
  for (const b of document.querySelectorAll('.swatch')) {
    const on = current.docPage === 'custom'
      && b.dataset.bg === current.pageBg.toLowerCase() && b.dataset.text === current.pageText.toLowerCase();
    b.setAttribute('aria-pressed', String(on));
  }
  const card = document.querySelector('.card.colours-card');
  if (card) card.classList.toggle('inactive', current.docPage !== 'custom');
}

function card(c) {
  return h('section', { class: 'card' + (c.wide ? ' wide' : '') + (c.colours ? ' colours-card' : '') },
    c.title ? h('h2', {}, c.title) : null,
    c.master ? masterBlock() : null,
    c.colours ? coloursBlock() : null,
    c.note ? h('small', { class: 'note' }, c.note) : null,
    ...(c.switches || []).map(switchRow),
    ...(c.selects || []).map(selectRow),
    c.checks ? h('div', { class: 'checks' }, ...c.checks.map(checkRow)) : null);
}

// ---------- tabs ----------
function selectTab(id, focus = false) {
  for (const t of document.querySelectorAll('.tab')) {
    const on = t.dataset.id === id;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  }
  for (const p of document.querySelectorAll('.panel')) p.hidden = p.dataset.id !== id;
  try { localStorage.setItem('gd-tab', id); } catch { /* ignore */ }
}

function render() {
  const tabs = $('tabs');
  const panels = $('panels');
  for (const tab of TABS) {
    tabs.append(h('button', {
      type: 'button', class: 'tab', role: 'tab', id: 'tab-' + tab.id, 'data-id': tab.id,
      'aria-controls': 'panel-' + tab.id, onclick: () => selectTab(tab.id),
    }, tab.label));
    panels.append(h('div', {
      class: 'panel', role: 'tabpanel', id: 'panel-' + tab.id, 'data-id': tab.id, 'aria-labelledby': 'tab-' + tab.id,
    }, ...tab.cards.map(card)));
  }
  tabs.addEventListener('keydown', (e) => {
    const ids = TABS.map((t) => t.id);
    const i = ids.indexOf(document.activeElement?.dataset?.id);
    if (i < 0) return;
    if (e.key === 'ArrowRight') selectTab(ids[(i + 1) % ids.length], true);
    else if (e.key === 'ArrowLeft') selectTab(ids[(i - 1 + ids.length) % ids.length], true);
    else return;
    e.preventDefault();
  });
  let start = null;
  try { start = localStorage.getItem('gd-tab'); } catch { /* ignore */ }
  selectTab(TABS.some((t) => t.id === start) ? start : TABS[0].id);
  renderColours();
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const [k, { newValue }] of Object.entries(changes)) {
    current[k] = newValue ?? MSG_DEFAULTS[k];
    for (const el of bound.get(k) || []) {
      if (el.tagName === 'SELECT' || el.type === 'text') { el.value = current[k]; el.classList.remove('bad'); }
      else el.checked = !!current[k];
    }
  }
  renderNote();
  renderColours();
});

Promise.all([
  browser.storage.local.get(MSG_DEFAULTS),
  browser.tabs.query({ active: true, currentWindow: true }).catch(() => []),
]).then(([s, [tab]]) => {
  current = s;
  tabApp = tab?.url ? msgAppFor(tab.url) : null;
  render();
});

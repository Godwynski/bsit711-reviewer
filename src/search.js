const FUSE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/7.5.0/fuse.min.mjs';

let FuseCtor = null;
let fuseInstance = null;
let rawIndex = [];

async function ensureFuse() {
  if (FuseCtor) return FuseCtor;
  const mod = await import(FUSE_CDN);
  FuseCtor = mod.default || mod.Fuse || mod;
  return FuseCtor;
}

export async function initSearch(indexData) {
  rawIndex = Array.isArray(indexData) ? indexData : [];
  try {
    const Fuse = await ensureFuse();
    fuseInstance = new Fuse(rawIndex, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'preview', weight: 0.3 },
        { name: 'hook', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  } catch {
    fuseInstance = null;
  }
}

export function matchCommands(query, manifest) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const commands = [];

  for (const theme of ['dark', 'paper', 'crt', 'amber']) {
    const cmd = `theme ${theme}`;
    if (cmd.includes(q) || q.startsWith('theme')) {
      if (q === 'theme' || cmd.startsWith(q) || `theme ${theme}`.includes(q)) {
        commands.push({
          type: 'command',
          title: `theme ${theme}`,
          preview: `Switch visual theme to ${theme}`,
          action: { type: 'theme', theme },
        });
      }
    }
  }

  if ('weak spots'.includes(q) || q === 'weak') {
    commands.push({
      type: 'command',
      title: 'weak spots',
      preview: 'Open Weak spots page (#/weak)',
      action: { type: 'navigate', route: '#/weak' },
    });
  }

  if ('home'.includes(q) || q === '~') {
    commands.push({
      type: 'command',
      title: 'cd ~ (home)',
      preview: 'Return to home directory (#/)',
      action: { type: 'navigate', route: '#/' },
    });
  }

  if (q.startsWith('go ') && manifest) {
    const tokens = q.slice(3).trim().split(/\s+/);
    const target = tokens[0] || '';
    const maybeTab = tokens[1];
    const validTabs = ['reviewer', 'pdf', 'quiz', 'drill'];
    const tab = validTabs.includes(maybeTab) ? maybeTab : 'reviewer';

    for (const h of manifest.handouts) {
      if (
        h.handout.includes(target) ||
        h.title.toLowerCase().includes(target) ||
        h.subject.includes(target)
      ) {
        commands.push({
          type: 'command',
          title: `go ${h.handout} ${tab}`,
          preview: `${h.subjectShort} / ${h.title} (${tab})`,
          action: { type: 'navigate', route: `#/${h.subject}/${h.handout}/${tab}` },
        });
      }
    }
  }

  return commands.slice(0, 6);
}

export function searchItems(query, manifest) {
  const q = query.trim();
  if (!q) {
    return [
      {
        type: 'command',
        title: 'weak spots',
        preview: 'Review all missed and flagged questions',
        action: { type: 'navigate', route: '#/weak' },
      },
      {
        type: 'command',
        title: 'theme crt',
        preview: 'Switch to CRT phosphor green theme',
        action: { type: 'theme', theme: 'crt' },
      },
      ...(manifest?.handouts || []).slice(0, 8).map((h) => ({
        type: 'handout',
        title: `${h.subjectShort} / ${h.title}`,
        preview: `${h.questionCount} questions · ${h.termCount} key terms`,
        route: `#/${h.subject}/${h.handout}/reviewer`,
      })),
    ];
  }

  const cmds = matchCommands(q, manifest);
  let hits = [];
  if (fuseInstance) {
    hits = fuseInstance.search(q, { limit: 16 }).map((r) => r.item);
  } else {
    const lower = q.toLowerCase();
    hits = rawIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          (item.preview && item.preview.toLowerCase().includes(lower))
      )
      .slice(0, 16);
  }

  return [...cmds, ...hits].slice(0, 18);
}

export function createPaletteController({ manifest, onTheme, onNavigate }) {
  const modal = document.getElementById('palette-modal');
  const input = document.getElementById('palette-input');
  const resultsEl = document.getElementById('palette-results');
  const closeBtn = document.getElementById('palette-close');

  let items = [];
  let activeIdx = 0;

  function renderResults() {
    resultsEl.innerHTML = '';
    if (items.length === 0) {
      const li = document.createElement('li');
      li.className = 'palette-empty';
      li.textContent = '// no matching terms, questions, or commands';
      resultsEl.appendChild(li);
      return;
    }

    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = `palette-item${idx === activeIdx ? ' active' : ''}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', idx === activeIdx ? 'true' : 'false');

      const badge = document.createElement('span');
      badge.className = 'palette-tag';
      badge.textContent = `[${item.type}]`;

      const body = document.createElement('div');
      body.className = 'palette-item-body';

      const title = document.createElement('div');
      title.className = 'palette-item-title';
      title.textContent = item.title;

      const prev = document.createElement('div');
      prev.className = 'palette-item-preview';
      prev.textContent = item.preview || '';

      body.appendChild(title);
      body.appendChild(prev);
      li.appendChild(badge);
      li.appendChild(body);

      li.addEventListener('click', () => activateItem(item));
      resultsEl.appendChild(li);
    });
  }

  function activateItem(item) {
    if (!item) return;
    close();
    if (item.action) {
      if (item.action.type === 'theme') {
        onTheme(item.action.theme);
      } else if (item.action.type === 'navigate') {
        onNavigate(item.action.route);
      }
      return;
    }
    if (item.route) {
      onNavigate(item.route);
    }
  }

  function refresh() {
    items = searchItems(input.value, manifest);
    activeIdx = 0;
    renderResults();
  }

  function open() {
    modal.hidden = false;
    input.value = '';
    refresh();
    setTimeout(() => input.focus(), 10);
  }

  function close() {
    modal.hidden = true;
  }

  input.addEventListener('input', refresh);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length > 0) {
        activeIdx = (activeIdx + 1) % items.length;
        renderResults();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length > 0) {
        activeIdx = (activeIdx - 1 + items.length) % items.length;
        renderResults();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activateItem(items[activeIdx]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });

  closeBtn.addEventListener('click', close);
  modal.querySelector('[data-close-modal="palette"]')?.addEventListener('click', close);

  return {
    open,
    close,
    isOpen: () => !modal.hidden,
  };
}

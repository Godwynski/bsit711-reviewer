const VALID_TABS = new Set(['reviewer', 'pdf', 'quiz', 'drill']);

export function parseHash(hash, manifest) {
  const raw = (hash || '#/').replace(/^#/, '');
  const clean = raw.startsWith('/') ? raw : `/${raw}`;
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { view: 'home' };
  }

  if (parts.length === 1) {
    if (parts[0] === 'weak') return { view: 'weak' };
    if (parts[0] === 'settings') return { view: 'settings' };
    return { view: '404', path: clean };
  }

  if (parts.length === 2 || parts.length === 3) {
    const [subject, handout, maybeTab] = parts;
    const tab = maybeTab || 'reviewer';
    if (!VALID_TABS.has(tab)) {
      return { view: '404', path: clean };
    }
    if (manifest) {
      const found = manifest.handouts.find(
        (h) => h.subject === subject && h.handout === handout
      );
      if (!found) {
        return { view: '404', path: clean };
      }
    }
    return { view: 'handout', subject, handout, tab };
  }

  return { view: '404', path: clean };
}

export function navigate(routeHash) {
  if (globalThis.location) {
    globalThis.location.hash = routeHash.startsWith('#') ? routeHash : `#${routeHash}`;
  }
}

const TAB_TITLES = {
  reviewer: 'Reviewer',
  pdf: 'PDF',
  quiz: 'Quiz',
  drill: 'Drill',
};

export function getPageTitle(route, handoutData = null) {
  const base = 'BSIT-711 // Pre-Finals Reviewer';
  if (!route || route.view === 'home') return base;
  if (route.view === 'weak') return 'Weak Spots | BSIT-711';
  if (route.view === 'settings') return 'Settings | BSIT-711';
  if (route.view === 'handout') {
    const title = handoutData?.handoutTitle || route.handout;
    const tabLabel = TAB_TITLES[route.tab] || route.tab;
    return `${title} (${tabLabel}) | BSIT-711`;
  }
  return '404 Not Found | BSIT-711';
}

const STORAGE_KEY = 'bsit711-reviewer-v1';

const DEFAULT_STATE = () => ({
  theme: 'dark',
  readingFont: false,
  wowEnabled: true,
  lastVisited: null,
  handouts: {},
  pdfPages: {},
});

const VALID_THEMES = new Set(['dark', 'paper', 'crt', 'amber']);

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function defaultStorage() {
  try {
    return typeof globalThis !== 'undefined' && globalThis.localStorage
      ? globalThis.localStorage
      : null;
  } catch {
    return null;
  }
}

export function createStore(storage = defaultStorage()) {
  let memoryState = DEFAULT_STATE();

  function load() {
    if (!storage) return clone(memoryState);
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return clone(memoryState);
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE(),
        ...parsed,
        handouts: parsed?.handouts && typeof parsed.handouts === 'object' ? parsed.handouts : {},
        pdfPages: parsed?.pdfPages && typeof parsed.pdfPages === 'object' ? parsed.pdfPages : {},
      };
    } catch {
      return clone(memoryState);
    }
  }

  function save(state) {
    memoryState = clone(state);
    if (!storage) return false;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
      return true;
    } catch {
      return false;
    }
  }

  // Hydrate initial memory state once if storage is readable
  memoryState = load();

  return {
    getState() {
      return load();
    },

    getTheme() {
      const t = load().theme;
      return VALID_THEMES.has(t) ? t : 'dark';
    },

    setTheme(theme) {
      if (!VALID_THEMES.has(theme)) {
        throw new Error(`Invalid theme "${theme}". Expected one of: dark, paper, crt, amber`);
      }
      const state = load();
      state.theme = theme;
      save(state);
      return theme;
    },

    getReadingFont() {
      return Boolean(load().readingFont);
    },

    setReadingFont(enabled) {
      const state = load();
      state.readingFont = Boolean(enabled);
      save(state);
      return state.readingFont;
    },

    getWowEnabled() {
      return load().wowEnabled !== false;
    },

    setWowEnabled(enabled) {
      const state = load();
      state.wowEnabled = Boolean(enabled);
      save(state);
      return state.wowEnabled;
    },

    getLastVisited() {
      return load().lastVisited;
    },

    setLastVisited(visit) {
      const state = load();
      state.lastVisited = visit ? { ...visit, at: new Date().toISOString() } : null;
      save(state);
      return state.lastVisited;
    },

    getHandoutProgress(handoutKey) {
      const state = load();
      return (
        state.handouts[handoutKey] || {
          bestScore: null,
          bestTotal: null,
          lastScore: null,
          lastTotal: null,
          lastStudied: null,
          missedIds: [],
          flaggedIds: [],
        }
      );
    },

    recordQuizResult(handoutKey, { score, total, missedIds = [], clearedIds = [] }) {
      const state = load();
      const prev = state.handouts[handoutKey] || {
        bestScore: null,
        bestTotal: null,
        lastScore: null,
        lastTotal: null,
        lastStudied: null,
        missedIds: [],
        flaggedIds: [],
      };

      const prevRatio =
        prev.bestScore != null && prev.bestTotal ? prev.bestScore / prev.bestTotal : -1;
      const newRatio = total > 0 ? score / total : 0;

      const bestScore = newRatio >= prevRatio ? score : prev.bestScore;
      const bestTotal = newRatio >= prevRatio ? total : prev.bestTotal;

      const missedSet = new Set(prev.missedIds || []);
      for (const id of clearedIds) missedSet.delete(id);
      for (const id of missedIds) missedSet.add(id);

      state.handouts[handoutKey] = {
        ...prev,
        bestScore,
        bestTotal,
        lastScore: score,
        lastTotal: total,
        lastStudied: new Date().toISOString(),
        missedIds: [...missedSet],
      };

      save(state);
      return state.handouts[handoutKey];
    },

    clearWeakSpot(handoutKey, questionId) {
      const state = load();
      const entry = state.handouts[handoutKey];
      if (!entry) return;
      entry.missedIds = (entry.missedIds || []).filter((id) => id !== questionId);
      entry.flaggedIds = (entry.flaggedIds || []).filter((id) => id !== questionId);
      save(state);
    },

    toggleFlag(handoutKey, questionId) {
      const state = load();
      const prev = state.handouts[handoutKey] || {
        bestScore: null,
        bestTotal: null,
        lastScore: null,
        lastTotal: null,
        lastStudied: null,
        missedIds: [],
        flaggedIds: [],
      };
      const set = new Set(prev.flaggedIds || []);
      let flagged;
      if (set.has(questionId)) {
        set.delete(questionId);
        flagged = false;
      } else {
        set.add(questionId);
        flagged = true;
      }
      state.handouts[handoutKey] = {
        ...prev,
        flaggedIds: [...set],
      };
      save(state);
      return flagged;
    },

    getAllWeakSpots() {
      const state = load();
      const result = [];
      for (const [key, entry] of Object.entries(state.handouts || {})) {
        const missed = entry.missedIds || [];
        const flagged = entry.flaggedIds || [];
        const combined = [...new Set([...missed, ...flagged])];
        if (combined.length > 0) {
          result.push({
            handoutKey: key,
            missedIds: [...missed],
            flaggedIds: [...flagged],
            combinedIds: combined,
          });
        }
      }
      return result;
    },

    getPdfPage(pdfKey) {
      const page = load().pdfPages?.[pdfKey];
      return Number.isInteger(page) && page >= 1 ? page : 1;
    },

    setPdfPage(pdfKey, pageNum) {
      if (!pdfKey) return 1;
      const page = Math.max(1, Math.floor(Number(pageNum) || 1));
      const state = load();
      state.pdfPages = { ...(state.pdfPages || {}), [pdfKey]: page };
      save(state);
      return page;
    },

    resetAll() {
      const fresh = DEFAULT_STATE();
      memoryState = clone(fresh);
      if (storage) {
        try {
          storage.removeItem(STORAGE_KEY);
        } catch {
          // ignore blocked storage
        }
      }
      return fresh;
    },
  };
}

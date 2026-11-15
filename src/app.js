import { mdInline } from './text.js';
import { createStore } from './store.js';
import { parseHash, navigate } from './router.js';
import { mountPdfViewer } from './pdf.js';
import {
  createQuizSession,
  submitAnswer,
  advanceQuiz,
  finishQuizByTimeout,
  getQuizSummary,
  startRetryRound,
  formatAsciiBar,
} from './quiz.js';
import {
  buildDrillDeck,
  createDrillSession,
  flipDrillCard,
  gradeDrillCard,
  nextDrillRound,
} from './drill.js';
import { initSearch, createPaletteController } from './search.js';
import {
  getHeroAscii,
  getSubjectAscii,
  logConsoleEasterEgg,
  runBootSequence,
  animateDecode,
  revealTypewriter,
  getAllClearBanner,
  getClearedBoxLines,
  shouldPlayWow,
} from './boot.js';

const MARKED_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/marked/18.2.0/lib/marked.esm.min.js';
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.5.438/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.5.438/pdf.worker.min.mjs';

const THEMES = ['dark', 'paper', 'crt', 'amber'];

const store = createStore();
const dataCache = new Map();
let manifest = null;
let markedModule = null;
let pdfjsModule = null;
let palette = null;

// Active view controllers for keyboard bindings & cleanup
let activeQuizController = null;
let activeDrillController = null;
let activeCleanup = null;

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    el.hidden = true;
  }, 2000);
}

function announce(msg) {
  const el = document.getElementById('sr-live');
  if (el) el.textContent = msg;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const label = document.getElementById('theme-label');
  if (label) label.textContent = theme;
  const drawerLabel = document.getElementById('drawer-theme-label');
  if (drawerLabel) drawerLabel.textContent = theme;
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'paper' ? '#F6F5F1' : '#0B0D10');
  }
}

function applyReadingFont(enabled) {
  document.body.classList.toggle('reading-font', Boolean(enabled));
}

function formatRelativeTime(iso) {
  if (!iso) return 'never';
  const diffSec = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function getHandoutData(subject, handout) {
  const key = `${subject}/${handout}`;
  if (dataCache.has(key)) return dataCache.get(key);
  const meta = manifest.handouts.find((h) => h.subject === subject && h.handout === handout);
  if (!meta) throw new Error(`Unknown handout ${key}`);
  const data = await fetchJson(meta.dataUrl);
  dataCache.set(key, data);
  return data;
}

async function renderMarkdownHtml(md) {
  if (!md) return '';
  try {
    if (!markedModule) {
      const mod = await import(MARKED_CDN);
      markedModule = mod.marked || mod.default;
    }
    const rawHtml = markedModule.parse(md);
    // Wrap tables in .table-wrap so wide tables scroll internally, never on page
    const tmp = document.createElement('div');
    tmp.innerHTML = rawHtml;
    for (const table of tmp.querySelectorAll('table')) {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    }
    for (const h2 of tmp.querySelectorAll('h2')) {
      const id = h2.textContent
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      h2.id = id;
    }
    return tmp.innerHTML;
  } catch {
    return `<pre>${escHtml(md)}</pre>`;
  }
}

function updateSidebar(route) {
  const tree = document.getElementById('sidebar-tree');
  if (!tree || !manifest) return;

  const lines = [];
  lines.push(
    `<a href="#/" class="tree-link ${route.view === 'home' ? 'active' : ''}">` +
      `<span class="tree-branch">&sim;/</span> home</a>`
  );

  manifest.subjects.forEach((subj, sIdx) => {
    const isLastSubj = sIdx === manifest.subjects.length - 1;
    const prefix = isLastSubj ? '&boxur;&boxh;' : '&boxvr;&boxh;';
    lines.push(`<div class="tree-subject">${prefix} ${escHtml(subj.slug)}/</div>`);

    subj.handouts.forEach((h, hIdx) => {
      const isLastH = hIdx === subj.handouts.length - 1;
      const vert = isLastSubj ? '&nbsp;&nbsp;&nbsp;' : '&boxv;&nbsp;&nbsp;';
      const branch = isLastH ? '&boxur;&boxh;' : '&boxvr;&boxh;';
      const active =
        route.view === 'handout' &&
        route.subject === subj.slug &&
        route.handout === h.handout;

      const prog = store.getHandoutProgress(`${subj.slug}/${h.handout}`);
      const missedN = prog.missedIds?.length || 0;
      const badge = missedN > 0 ? `<span class="badge badge-warn">${missedN}</span>` : '';

      lines.push(
        `<a href="#/${subj.slug}/${h.handout}/reviewer" class="tree-link ${active ? 'active' : ''}">` +
          `<span class="tree-branch">${vert}${branch}</span>` +
          `<span>${escHtml(h.handout)}</span>${badge}</a>`
      );
    });
  });

  tree.innerHTML = lines.join('');

  const weakCount = store
    .getAllWeakSpots()
    .reduce((sum, entry) => sum + entry.combinedIds.length, 0);
  const weakBadge = document.getElementById('sidebar-weak-count');
  if (weakBadge) {
    weakBadge.textContent = String(weakCount);
    weakBadge.className = `badge ${weakCount > 0 ? 'badge-warn' : ''}`;
  }
}

function setBreadcrumb(route) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;
  if (route.view === 'home') el.textContent = '~/';
  else if (route.view === 'weak') el.textContent = '~/weak-spots';
  else if (route.view === 'settings') el.textContent = '~/settings';
  else if (route.view === 'handout') {
    el.textContent = `~/${route.subject}/${route.handout}/${route.tab}`;
  } else {
    el.textContent = `~${route.path || '/404'}`;
  }
}

function setRightRail(items) {
  const shell = document.querySelector('.shell');
  const tocList = document.getElementById('toc-list');
  if (!shell || !tocList) return;

  if (!items || items.length === 0) {
    shell.classList.add('no-right-rail');
    tocList.innerHTML = '';
    return;
  }

  shell.classList.remove('no-right-rail');
  tocList.innerHTML = items
    .map(
      (item) =>
        `<a href="${escHtml(item.href)}" class="toc-link" data-scroll-id="${escHtml(item.id)}">${escHtml(
          item.label
        )}</a>`
    )
    .join('');

  tocList.querySelectorAll('[data-scroll-id]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.scrollId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function closeDrawer() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const btn = document.getElementById('btn-menu');
  sidebar?.classList.remove('open');
  if (backdrop) backdrop.hidden = true;
  btn?.setAttribute('aria-expanded', 'false');
}

function toggleDrawer() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const btn = document.getElementById('btn-menu');
  const opening = !sidebar?.classList.contains('open');
  sidebar?.classList.toggle('open', opening);
  if (backdrop) backdrop.hidden = !opening;
  btn?.setAttribute('aria-expanded', opening ? 'true' : 'false');
}

function renderHome(container) {
  setRightRail([]);
  const last = store.getLastVisited();
  const weakCount = store
    .getAllWeakSpots()
    .reduce((sum, entry) => sum + entry.combinedIds.length, 0);

  let continueHtml = '';
  if (last && last.subject && last.handout) {
    const h = manifest.handouts.find(
      (item) => item.subject === last.subject && item.handout === last.handout
    );
    if (h) {
      const tab = last.tab || 'reviewer';
      continueHtml = `
        <a href="#/${h.subject}/${h.handout}/${tab}" class="tui-btn tui-btn-primary">
          &gt; continue: ${escHtml(h.subjectShort)} / ${escHtml(h.title)} [${tab}]<span class="cursor-blink">_</span>
        </a>
      `;
    }
  }

  const subjectsHtml = manifest.subjects
    .map((subj) => {
      const cardsHtml = subj.handouts
        .map((h) => {
          const prog = store.getHandoutProgress(`${subj.slug}/${h.handout}`);
          const missedN = prog.missedIds?.length || 0;
          const hasBest = prog.bestScore != null && prog.bestTotal;
          const bar = hasBest
            ? formatAsciiBar(prog.bestScore, prog.bestTotal, 14)
            : '[--------------] 0%';
          const bestLabel = hasBest
            ? `best ${prog.bestScore}/${prog.bestTotal}`
            : 'not attempted';
          const lastLabel = prog.lastStudied ? formatRelativeTime(prog.lastStudied) : 'new';

          return `
            <article class="tui-box handout-card">
              <div class="tui-title">${escHtml(h.handout)}</div>
              <div class="card-title-row">
                <div class="card-title">${escHtml(h.title)}</div>
                ${
                  missedN > 0
                    ? `<span class="badge badge-warn">missed ${missedN}</span>`
                    : ''
                }
              </div>
              <div class="card-meta">
                <span>${h.questionCount} Qs</span>
                <span class="mobile-hide">&middot;</span>
                <span class="mobile-hide">${h.termCount} terms</span>
              </div>
              <div class="ascii-progress" title="${escHtml(bestLabel)}">${escHtml(bar)}</div>
              <div class="card-meta mobile-hide">
                <span>${escHtml(bestLabel)}</span>
                <span>&middot;</span>
                <span>studied: ${escHtml(lastLabel)}</span>
              </div>
              <div class="card-actions">
                <a class="tui-btn tui-btn-primary card-primary-btn" href="#/${subj.slug}/${h.handout}/quiz">&gt; Quiz</a>
                <div class="card-sec-links">
                  <a class="tui-btn card-sec-link" href="#/${subj.slug}/${h.handout}/reviewer"><span class="desktop-only">[</span>Rev<span class="desktop-only">]</span></a>
                  <a class="tui-btn card-sec-link" href="#/${subj.slug}/${h.handout}/pdf"><span class="desktop-only">[</span>PDF<span class="desktop-only">]</span></a>
                  <a class="tui-btn card-sec-link" href="#/${subj.slug}/${h.handout}/drill"><span class="desktop-only">[</span>Drill<span class="desktop-only">]</span></a>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      return `
        <section class="subject-block">
          <div class="subject-header">
            <pre class="subject-art" aria-hidden="true">${escHtml(getSubjectAscii(subj.icon))}</pre>
            <div>
              <h2 class="tui-h2" style="margin:0;">${escHtml(subj.title)}</h2>
              <div class="card-meta">${subj.handouts.length} handout(s)</div>
            </div>
          </div>
          <div class="cards-grid">${cardsHtml}</div>
        </section>
      `;
    })
    .join('');

  container.innerHTML = `
    <section class="tui-box tui-active hero-box">
      <div class="tui-title">system status</div>
      <h1 class="sr-only">BSIT-711 Pre-Finals Reviewer</h1>
      <pre id="hero-ascii" class="hero-ascii" aria-hidden="true"></pre><div class="hero-logo-sm" aria-hidden="true">[ BSIT-711 ]</div>
      <p class="hero-sub">
        ${manifest.handoutCount} handouts &middot; ${manifest.totalQuestions} situational questions &middot; offline-ready TUI
      </p>
      <div class="continue-bar">
        ${
          continueHtml ||
          `<a href="#/network/storage/quiz" class="tui-btn tui-btn-primary">&gt; start quick quiz<span class="cursor-blink">_</span></a>`
        }
        ${
          weakCount > 0
            ? `<a href="#/weak" class="tui-btn tui-btn-danger">[ weak spots (${weakCount}) ]</a>`
            : `<a href="#/weak" class="tui-btn">[ weak spots (0) ]</a>`
        }
      </div>
    </section>
    ${subjectsHtml}
  `;

  animateDecode(document.getElementById('hero-ascii'), getHeroAscii(), store);
}

async function loadPdfJs() {
  if (pdfjsModule) return pdfjsModule;
  const mod = await import(PDFJS_CDN);
  const lib = mod.default || mod;
  if (lib.GlobalWorkerOptions) {
    lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  }
  pdfjsModule = lib;
  return pdfjsModule;
}

function decorateCollapsibleSections(proseEl) {
  const children = Array.from(proseEl.children);
  if (!children.some((el) => el.tagName === 'H2')) return;

  const frag = document.createDocumentFragment();
  let currentSection = null;
  let currentBody = null;
  let sectionIndex = 0;

  for (const child of children) {
    if (child.tagName === 'H2') {
      currentSection = document.createElement('section');
      currentSection.className = 'rev-section';
      const secId = child.id || `sec-${sectionIndex}`;
      currentSection.dataset.sectionId = secId;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rev-section-toggle';
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = `<span class="rev-toggle-icon" aria-hidden="true">-</span>`;
      child.appendChild(btn);

      currentBody = document.createElement('div');
      currentBody.className = 'rev-section-body';

      currentSection.appendChild(child);
      currentSection.appendChild(currentBody);
      frag.appendChild(currentSection);

      const secRef = currentSection;
      btn.addEventListener('click', () => {
        const collapsed = secRef.classList.toggle('collapsed');
        btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
        btn.querySelector('.rev-toggle-icon').textContent = collapsed ? '+' : '-';
      });
      child.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        btn.click();
      });

      sectionIndex++;
    } else if (currentBody) {
      currentBody.appendChild(child);
    } else {
      frag.appendChild(child);
    }
  }

  proseEl.innerHTML = '';
  proseEl.appendChild(frag);

  // Collapse long sections after §1 on mobile by default (CSS only hides .collapsed <768px)
  const sections = proseEl.querySelectorAll('.rev-section');
  sections.forEach((sec, idx) => {
    const body = sec.querySelector('.rev-section-body');
    const textLen = body?.textContent?.length || 0;
    if (idx > 0 && textLen > 450) {
      sec.classList.add('collapsed');
      const btn = sec.querySelector('.rev-section-toggle');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        const icon = btn.querySelector('.rev-toggle-icon');
        if (icon) icon.textContent = '+';
      }
    }
  });
}

async function renderReviewerTab(panel, data) {
  let cramMode = false;
  let showAnswers = false;
  let splitView = false;
  let pdfCleanup = null;

  const tocItems = data.toc.map((t) => ({
    label: t.heading,
    id: t.id,
    href: `#${t.id}`,
  }));
  setRightRail(tocItems);

  const mobileTocHtml = `
    <div class="mobile-toc">
      <select id="mobile-toc-select" class="mobile-toc-select" aria-label="Jump to section">
        <option value="">jump to section...</option>
        ${tocItems
          .map((t) => `<option value="${escHtml(t.id)}">${escHtml(t.label)}</option>`)
          .join('')}
      </select>
    </div>
  `;

  panel.innerHTML = `
    <div class="reviewer-toolbar">
      <button type="button" id="btn-cram" class="tui-btn">[ cram mode: off ]</button>
      <button type="button" id="btn-answers" class="tui-btn">[ show answers ]</button>
      <button type="button" id="btn-split" class="tui-btn desktop-only">[ split pdf: off ]</button>
      <a href="#/${data.subject}/${data.handout}/quiz" class="tui-btn tui-btn-primary desktop-only">&gt; take quiz (${data.questionCount})_</a>
    </div>
    ${mobileTocHtml}
    <div id="split-container" class="split-container">
      <div class="tui-box">
        <div class="tui-title" id="rev-box-title">reviewer</div>
        <article id="reviewer-prose" class="prose"></article>
        <section id="answer-key-box" hidden style="margin-top:24px;border-top:1px dashed var(--line);padding-top:16px;">
          <div id="answer-key-prose" class="prose"></div>
        </section>
      </div>
      <div id="split-pdf-slot" hidden></div>
    </div>
  `;

  const proseEl = document.getElementById('reviewer-prose');
  const answerBox = document.getElementById('answer-key-box');
  const answerProse = document.getElementById('answer-key-prose');
  const titleEl = document.getElementById('rev-box-title');

  document.getElementById('mobile-toc-select')?.addEventListener('change', (e) => {
    const id = e.target.value;
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      const sec = target.closest('.rev-section');
      if (sec?.classList.contains('collapsed')) {
        sec.classList.remove('collapsed');
        const btn = sec.querySelector('.rev-section-toggle');
        if (btn) {
          btn.setAttribute('aria-expanded', 'true');
          const icon = btn.querySelector('.rev-toggle-icon');
          if (icon) icon.textContent = '-';
        }
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    e.target.value = '';
  });

  async function refreshMarkdown() {
    const md = cramMode
      ? `${data.cramMarkdown}\n\n---\n\n${data.listsMarkdown}`
      : data.bodyMarkdown;
    titleEl.textContent = cramMode ? 'cram sheet (§6 + §4)' : 'reviewer';
    proseEl.innerHTML = await renderMarkdownHtml(md);
    if (!cramMode) decorateCollapsibleSections(proseEl);

    if (showAnswers && !cramMode) {
      answerBox.hidden = false;
      answerProse.innerHTML = await renderMarkdownHtml(data.answerKeyMarkdown);
    } else {
      answerBox.hidden = true;
    }
  }

  document.getElementById('btn-cram').addEventListener('click', async (e) => {
    cramMode = !cramMode;
    e.currentTarget.textContent = `[ cram mode: ${cramMode ? 'ON' : 'off'} ]`;
    await refreshMarkdown();
  });

  document.getElementById('btn-answers').addEventListener('click', async (e) => {
    showAnswers = !showAnswers;
    e.currentTarget.textContent = showAnswers ? '[ hide answers ]' : '[ show answers ]';
    await refreshMarkdown();
  });

  document.getElementById('btn-split').addEventListener('click', async (e) => {
    splitView = !splitView;
    e.currentTarget.textContent = `[ split pdf: ${splitView ? 'ON' : 'off'} ]`;
    const splitCont = document.getElementById('split-container');
    const slot = document.getElementById('split-pdf-slot');
    splitCont.classList.toggle('split-active', splitView);
    slot.hidden = !splitView;

    if (splitView) {
      setRightRail([]);
      pdfCleanup = await mountPdfViewer(slot, {
        pdfUrl: data.pdfUrl,
        pdfFile: data.pdfFile,
        pdfKey: `${data.subject}/${data.handout}`,
        store,
        loadPdfJs,
      });
    } else {
      if (pdfCleanup) {
        pdfCleanup();
        pdfCleanup = null;
      }
      slot.innerHTML = '';
      setRightRail(tocItems);
    }
  });

  await refreshMarkdown();

  return () => {
    if (pdfCleanup) pdfCleanup();
  };
}

function renderQuizTab(panel, data, options = {}) {
  setRightRail([]);
  const handoutKey = `${data.subject}/${data.handout}`;
  const isWeakMode = Boolean(options.weakMode);

  let mode = 'practice';
  let shuffleQuestions = true;
  let shuffleChoices = false;
  let timerEnabled = false;
  let session = null;
  let timerHandle = null;
  let remainingSeconds = 0;
  let skipTypewriter = null;

  function stopTimer() {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function startQuiz(sourceQuestions, cfg = {}) {
    stopTimer();
    session = createQuizSession(sourceQuestions, {
      mode: cfg.mode ?? mode,
      shuffleQuestions: cfg.shuffleQuestions ?? shuffleQuestions,
      shuffleChoices: cfg.shuffleChoices ?? shuffleChoices,
      timerMinutes: (cfg.mode ?? mode) === 'exam' && timerEnabled ? sourceQuestions.length : null,
      round: 1,
    });

    if (session.timerSeconds) {
      remainingSeconds = session.timerSeconds;
      timerHandle = setInterval(() => {
        remainingSeconds--;
        const timerEl = document.getElementById('quiz-timer');
        if (timerEl) {
          const m = String(Math.floor(Math.max(0, remainingSeconds) / 60)).padStart(2, '0');
          const s = String(Math.max(0, remainingSeconds) % 60).padStart(2, '0');
          timerEl.textContent = `${m}:${s}`;
        }
        if (remainingSeconds <= 0) {
          stopTimer();
          session = finishQuizByTimeout(session);
          persistSummary();
          renderResults();
        }
      }, 1000);
    }
    renderQuestion();
  }

  function persistSummary() {
    const summary = getQuizSummary(session);
    if (isWeakMode) {
      // Clear each correctly answered question from its originating handout
      for (const r of session.results) {
        if (r.isCorrect && r.handoutKey) {
          store.clearWeakSpot(r.handoutKey, r.questionId);
        }
      }
      updateSidebar({ view: 'weak' });
      return;
    }

    store.recordQuizResult(handoutKey, {
      score: summary.correctCount,
      total: summary.total,
      missedIds: summary.missedIds,
      clearedIds: summary.clearedIds,
    });
    updateSidebar({
      view: 'handout',
      subject: data.subject,
      handout: data.handout,
      tab: 'quiz',
    });
  }

  function renderStartScreen() {
    stopTimer();
    session = null;
    const prog = store.getHandoutProgress(handoutKey);
    const savedMissedIds = prog.missedIds || [];

    panel.innerHTML = `
      <div class="tui-box tui-active">
        <div class="tui-title">quiz setup :: ${escHtml(data.handout)}</div>
        <p class="card-meta" style="margin-top:0;">
          ${data.questions.length} questions &middot; ${
      prog.bestScore != null ? `best: ${prog.bestScore}/${prog.bestTotal}` : 'no score yet'
    }
        </p>

        <div class="setting-row">
          <div>
            <strong>Mode</strong>
            <div class="card-meta">Practice = instant feedback. Exam = feedback at end.</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" id="mode-practice" class="tui-btn tui-btn-primary">[Practice]</button>
            <button type="button" id="mode-exam" class="tui-btn">[Exam]</button>
          </div>
        </div>

        <div class="setting-row" id="exam-timer-row" hidden>
          <div>
            <strong>Exam timer</strong>
            <div class="card-meta">${data.questions.length} min (1 min / question)</div>
          </div>
          <button type="button" id="toggle-timer" class="tui-btn">[ timer: off ]</button>
        </div>

        <div class="setting-row">
          <div><strong>Shuffle questions</strong></div>
          <button type="button" id="toggle-sq" class="tui-btn">[ ON ]</button>
        </div>

        <div class="setting-row">
          <div>
            <strong>Shuffle choices</strong>
            <div class="card-meta">Remaps letter references in explanations automatically</div>
          </div>
          <button type="button" id="toggle-sc" class="tui-btn">[ off ]</button>
        </div>

        <div class="continue-bar">
          <button type="button" id="btn-start-quiz" class="tui-btn tui-btn-primary">
            &gt; start quiz (${data.questions.length})<span class="cursor-blink">_</span>
          </button>
          ${
            savedMissedIds.length > 0
              ? `<button type="button" id="btn-start-missed" class="tui-btn tui-btn-danger">
                  [ practice my ${savedMissedIds.length} missed ]
                </button>`
              : ''
          }
        </div>
      </div>
    `;

    const modePractice = document.getElementById('mode-practice');
    const modeExam = document.getElementById('mode-exam');
    const timerRow = document.getElementById('exam-timer-row');

    function syncModeButtons() {
      modePractice.classList.toggle('tui-btn-primary', mode === 'practice');
      modeExam.classList.toggle('tui-btn-primary', mode === 'exam');
      timerRow.hidden = mode !== 'exam';
    }

    modePractice.addEventListener('click', () => {
      mode = 'practice';
      syncModeButtons();
    });
    modeExam.addEventListener('click', () => {
      mode = 'exam';
      syncModeButtons();
    });

    document.getElementById('toggle-timer').addEventListener('click', (e) => {
      timerEnabled = !timerEnabled;
      e.currentTarget.textContent = `[ timer: ${timerEnabled ? 'ON' : 'off'} ]`;
    });

    document.getElementById('toggle-sq').addEventListener('click', (e) => {
      shuffleQuestions = !shuffleQuestions;
      e.currentTarget.textContent = `[ ${shuffleQuestions ? 'ON' : 'off'} ]`;
    });

    document.getElementById('toggle-sc').addEventListener('click', (e) => {
      shuffleChoices = !shuffleChoices;
      e.currentTarget.textContent = `[ ${shuffleChoices ? 'ON' : 'off'} ]`;
    });

    document.getElementById('btn-start-quiz').addEventListener('click', () => {
      startQuiz(data.questions);
    });

    document.getElementById('btn-start-missed')?.addEventListener('click', () => {
      const missedSet = new Set(savedMissedIds);
      const subset = data.questions.filter((q) => missedSet.has(q.id));
      startQuiz(subset.length ? subset : data.questions);
    });
  }

  function renderQuestion() {
    if (session.completed) {
      stopTimer();
      persistSummary();
      renderResults();
      return;
    }

    const q = session.queue[session.index];
    const existingResult = session.results.find((r) => r.questionId === q.id);
    const total = session.queue.length;
    const answeredCount = session.results.length;
    const correctSoFar = session.results.filter((r) => r.isCorrect).length;

    const qHandoutKey = q.handoutKey || handoutKey;
    const isFlagged = (store.getHandoutProgress(qHandoutKey).flaggedIds || []).includes(q.id);

    const timerText = session.timerSeconds
      ? `<span id="quiz-timer">${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(
          remainingSeconds % 60
        ).padStart(2, '0')}</span>`
      : '';

    const statusTitle = `quiz :: ${data.handout} :: round ${session.round} :: ${String(
      session.index + 1
    ).padStart(2, '0')}/${String(total).padStart(2, '0')}`;

    const choicesHtml = ['A', 'B', 'C', 'D']
      .map((letter, idx) => {
        let cls = 'choice-row';
        let tag = '';
        if (existingResult) {
          if (letter === existingResult.correct) {
            cls += ' choice-ok';
            tag = '&lt;&boxh;&boxh; [OK] correct';
          } else if (letter === existingResult.selected) {
            cls += ' choice-bad';
            tag = '&lt;&boxh;&boxh; [X] your pick';
          }
        }
        return `
          <button
            type="button"
            class="${cls}"
            data-choice="${letter}"
            ${existingResult ? 'disabled' : ''}
          >
            <span><span class="choice-key">[${letter}]</span> ${escHtml(q.choices[letter])}</span>
            ${tag ? `<span class="choice-tag">${tag}</span>` : `<span class="card-meta desktop-only">[${idx + 1}]</span>`}
          </button>
        `;
      })
      .join('');

    panel.innerHTML = `
      <div class="tui-box tui-active quiz-question-box">
        <div class="tui-title">${escHtml(statusTitle)}</div>
        <div class="quiz-header-row">
          <span class="quiz-compact-progress">
            <span>${session.index + 1}/${total}</span>
            <span class="mobile-hide">&middot; round ${session.round}</span>
            <span>&middot;</span>
            <span>${session.mode === 'practice' ? `${correctSoFar}/${answeredCount}` : 'exam'}</span>
            ${timerText ? ` &middot; ${timerText}` : ''}
          </span>
          <button
            type="button"
            id="btn-flag-q"
            class="tui-btn quiz-flag-btn ${isFlagged ? 'tui-btn-danger' : ''}"
            aria-label="${isFlagged ? 'Unflag question' : 'Flag question'}"
            title="Flag question (F)"
          >
            <span class="desktop-only">${isFlagged ? '[flagged (F)]' : '[flag (F)]'}</span>
            <span class="mobile-only" aria-hidden="true">${isFlagged ? '&#x2691;!' : '&#x2691;'}</span>
          </button>
        </div>
        <div class="ascii-progress">${escHtml(formatAsciiBar(session.index + (existingResult ? 1 : 0), total, 18))}</div>
        <p id="quiz-prompt" class="quiz-prompt" data-question-id="${escHtml(q.id)}"></p>
        <div class="choices-list">${choicesHtml}</div>
        ${
          existingResult
            ? `<div class="quiz-explanation">${mdInline(existingResult.explanation)}</div>`
            : ''
        }
        <div class="quiz-footer ${existingResult ? 'has-next' : ''}">
          ${
            existingResult
              ? `<button type="button" id="btn-next-q" class="tui-btn tui-btn-primary quiz-next-btn">
                  &gt; ${session.index + 1 >= total ? 'see results' : 'next'}<span class="cursor-blink">_</span>
                </button>`
              : `<span class="card-meta desktop-only">keys: 1-4 / A-D to answer</span>`
          }
        </div>
      </div>
    `;

    const promptEl = document.getElementById('quiz-prompt');
    if (existingResult) {
      promptEl.textContent = `> ${q.prompt}`;
    } else {
      skipTypewriter = revealTypewriter(promptEl, `> ${q.prompt}`, store);
    }

    panel.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => handlePick(btn.dataset.choice));
    });

    document.getElementById('btn-flag-q')?.addEventListener('click', () => {
      const flagged = store.toggleFlag(qHandoutKey, q.id);
      const btn = document.getElementById('btn-flag-q');
      if (btn) {
        btn.innerHTML = `
          <span class="desktop-only">${flagged ? '[flagged (F)]' : '[flag (F)]'}</span>
          <span class="mobile-only" aria-hidden="true">${flagged ? '&#x2691;!' : '&#x2691;'}</span>
        `;
        btn.setAttribute('aria-label', flagged ? 'Unflag question' : 'Flag question');
        btn.classList.toggle('tui-btn-danger', flagged);
      }
      showToast(flagged ? '[ok] flagged to weak spots' : '[ok] unflagged');
    });

    document.getElementById('btn-next-q')?.addEventListener('click', handleNext);
  }

  function handlePick(letter) {
    if (!session || session.completed) return;
    if (skipTypewriter) {
      skipTypewriter();
      skipTypewriter = null;
    }
    const q = session.queue[session.index];
    if (session.results.find((r) => r.questionId === q.id)) return;

    const { session: nextSession, feedback } = submitAnswer(session, letter);
    session = nextSession;

    if (feedback) {
      announce(
        feedback.isCorrect
          ? 'Correct'
          : `Incorrect, answer is ${feedback.correct}`
      );
    }

    renderQuestion();
  }

  function handleNext() {
    if (!session || session.completed) return;
    const q = session.queue[session.index];
    if (!session.results.find((r) => r.questionId === q.id)) return;
    session = advanceQuiz(session);
    if (session.completed) {
      stopTimer();
      persistSummary();
      renderResults();
    } else {
      renderQuestion();
    }
  }

  function renderResults() {
    const summary = getQuizSummary(session);
    const isClearedAfterRetry = session.round > 1 && summary.cleared;

    if (isClearedAfterRetry) {
      const lines = getClearedBoxLines();
      panel.innerHTML = `
        <div class="tui-box tui-active">
          <div class="tui-title">cleared!</div>
          <pre id="cleared-box" class="results-ascii"></pre>
          <p class="card-meta">Completed in round ${summary.round} &middot; ${summary.elapsedSeconds}s</p>
          <div class="continue-bar">
            <button type="button" id="btn-restart-quiz" class="tui-btn tui-btn-primary">&gt; retake full quiz_</button>
            <a href="#/" class="tui-btn">[ cd ~ ]</a>
          </div>
        </div>
      `;
      const boxEl = document.getElementById('cleared-box');
      if (shouldPlayWow(store)) {
        boxEl.textContent = '';
        lines.forEach((line, idx) => {
          setTimeout(() => {
            if (boxEl) boxEl.textContent += (idx > 0 ? '\n' : '') + line;
          }, idx * 140);
        });
      } else {
        boxEl.textContent = lines.join('\n');
      }
      document.getElementById('btn-restart-quiz')?.addEventListener('click', renderStartScreen);
      return;
    }

    const missedHtml = summary.missedResults
      .map(
        (r) => `
        <details class="missed-item">
          <summary>Q${r.number}: ${escHtml(r.prompt)}</summary>
          <div style="margin-top:8px;">
            <div><strong style="color:var(--bad);">Your answer:</strong> ${
              r.selected ? `[${r.selected}] ${escHtml(r.choices[r.selected] || '')}` : 'Timed out'
            }</div>
            <div><strong style="color:var(--ok);">Correct answer:</strong> [${r.correct}] ${escHtml(
              r.choices[r.correct]
            )}</div>
            <div class="quiz-explanation">${mdInline(r.explanation)}</div>
          </div>
        </details>
      `
      )
      .join('');

    panel.innerHTML = `
      <div class="tui-box tui-active">
        <div class="tui-title">results :: round ${summary.round}</div>
        ${
          summary.percentage === 100
            ? `<pre class="results-ascii">${escHtml(getAllClearBanner())}</pre>`
            : `<div class="tui-h1">${summary.correctCount}/${summary.total} (${summary.percentage}%)</div>`
        }
        <div class="ascii-progress">${escHtml(formatAsciiBar(summary.correctCount, summary.total, 20))}</div>
        <div class="card-meta">
          <span>time: ${summary.elapsedSeconds}s</span>
          <span>&middot;</span>
          <span>${
            summary.wrongCount === 0
              ? 'all clear!'
              : `retry the ${summary.wrongCount} you missed`
          }</span>
        </div>

        <div class="continue-bar">
          ${
            summary.wrongCount > 0
              ? `<button type="button" id="btn-retry-missed" class="tui-btn tui-btn-primary">
                  &gt; retry missed (${summary.wrongCount})<span class="cursor-blink">_</span>
                </button>`
              : ''
          }
          <button type="button" id="btn-restart-quiz" class="tui-btn">[ new quiz ]</button>
          <a href="#/weak" class="tui-btn">[ weak spots ]</a>
        </div>

        ${
          summary.missedResults.length > 0
            ? `<h2 class="tui-h2">missed questions (${summary.missedResults.length})</h2>${missedHtml}`
            : ''
        }
      </div>
    `;

    document.getElementById('btn-retry-missed')?.addEventListener('click', handleRetry);
    document.getElementById('btn-restart-quiz')?.addEventListener('click', renderStartScreen);
  }

  function handleRetry() {
    if (!session || !session.completed) return;
    const summary = getQuizSummary(session);
    if (summary.wrongCount === 0) return;
    session = startRetryRound(session, data.questions);
    renderQuestion();
  }

  activeQuizController = {
    pick: handlePick,
    next: handleNext,
    retry: handleRetry,
    flag: () => document.getElementById('btn-flag-q')?.click(),
  };

  if (options.autoStart) {
    startQuiz(data.questions, { shuffleQuestions: true, shuffleChoices: false });
  } else {
    renderStartScreen();
  }

  return () => {
    stopTimer();
    if (skipTypewriter) skipTypewriter();
    activeQuizController = null;
  };
}

function renderDrillTab(panel, data) {
  setRightRail([]);
  const deck = buildDrillDeck(data.lookAlikes);
  let session = createDrillSession(deck);

  function render() {
    if (session.cleared) {
      panel.innerHTML = `
        <div class="tui-box tui-active">
          <div class="tui-title">drill cleared</div>
          <pre class="results-ascii">${escHtml(getClearedBoxLines().join('\n'))}</pre>
          <div class="continue-bar">
            <button type="button" id="btn-drill-restart" class="tui-btn tui-btn-primary">&gt; drill all again_</button>
          </div>
        </div>
      `;
      document.getElementById('btn-drill-restart')?.addEventListener('click', () => {
        session = createDrillSession(deck);
        render();
      });
      return;
    }

    if (session.completed) {
      panel.innerHTML = `
        <div class="tui-box tui-active">
          <div class="tui-title">round ${session.round} complete</div>
          <p>Got it: ${session.gotItIds.length} &middot; Need review again: ${session.againIds.length}</p>
          <button type="button" id="btn-drill-next-round" class="tui-btn tui-btn-primary">
            &gt; retry ${session.againIds.length} cards<span class="cursor-blink">_</span>
          </button>
        </div>
      `;
      document.getElementById('btn-drill-next-round')?.addEventListener('click', () => {
        session = nextDrillRound(session);
        render();
      });
      return;
    }

    const card = session.queue[session.index];
    const total = session.queue.length;

    panel.innerHTML = `
      <div class="tui-box tui-active drill-box">
        <div class="tui-title">look-alike drill :: round ${session.round} :: ${session.index + 1}/${total}</div>
        <div class="ascii-progress">${escHtml(formatAsciiBar(session.index, total, 18))}</div>
        <div id="drill-card" class="drill-card" tabindex="0" role="button" aria-label="Flip card">
          <div class="card-meta">${escHtml(card.group)}</div>
          ${
            !session.flipped
              ? `
                <div style="font-size:1.05rem;font-weight:700;">Clue: ${escHtml(card.clues)}</div>
                <div class="card-meta">${escHtml(card.what)}</div>
                <div class="card-meta">[ click or press Space to reveal term ]</div>
              `
              : `
                <div class="drill-term">${escHtml(card.term)}</div>
                <div><strong>Key difference:</strong> ${escHtml(card.difference)}</div>
                ${card.trap ? `<div class="quiz-explanation">Trap: ${mdInline(card.trap)}</div>` : ''}
              `
          }
        </div>
        <div class="quiz-footer drill-footer">
          <button type="button" id="btn-drill-flip" class="tui-btn">[ flip<span class="desktop-only"> (Space)</span> ]</button>
          <div class="drill-grade-btns">
            <button type="button" id="btn-drill-again" class="tui-btn tui-btn-danger">[ again<span class="desktop-only"> (2)</span> ]</button>
            <button type="button" id="btn-drill-gotit" class="tui-btn tui-btn-primary">&gt; got it<span class="desktop-only"> (1)</span>_</button>
          </div>
        </div>
      </div>
    `;

    const doFlip = () => {
      session = flipDrillCard(session);
      render();
    };
    const doGrade = (ok) => {
      session = gradeDrillCard(session, ok);
      render();
    };

    document.getElementById('drill-card')?.addEventListener('click', doFlip);
    document.getElementById('btn-drill-flip')?.addEventListener('click', doFlip);
    document.getElementById('btn-drill-gotit')?.addEventListener('click', () => doGrade(true));
    document.getElementById('btn-drill-again')?.addEventListener('click', () => doGrade(false));

    activeDrillController = {
      flip: doFlip,
      gotIt: () => doGrade(true),
      again: () => doGrade(false),
    };
  }

  render();

  return () => {
    activeDrillController = null;
  };
}

async function renderHandoutView(container, route) {
  const data = await getHandoutData(route.subject, route.handout);
  store.setLastVisited({ subject: route.subject, handout: route.handout, tab: route.tab });

  const idx = manifest.handouts.findIndex(
    (h) => h.subject === route.subject && h.handout === route.handout
  );
  const prevH = idx > 0 ? manifest.handouts[idx - 1] : null;
  const nextH = idx < manifest.handouts.length - 1 ? manifest.handouts[idx + 1] : null;

  const tabs = [
    { id: 'reviewer', label: 'Reviewer', shortLabel: 'Rev' },
    { id: 'pdf', label: 'PDF', shortLabel: 'PDF' },
    { id: 'quiz', label: 'Quiz', shortLabel: 'Quiz' },
    { id: 'drill', label: 'Drill', shortLabel: 'Drill' },
  ];

  const tabsHtml = tabs
    .map((t) => {
      const active = t.id === route.tab;
      const label = active ? `[*${t.label}*]` : `[ ${t.label} ]`;
      return `<a href="#/${route.subject}/${route.handout}/${t.id}" class="tab-link ${
        active ? 'active' : ''
      }"><span class="tab-desktop">${label}</span><span class="tab-mobile">${t.shortLabel}</span></a>`;
    })
    .join('');

  container.innerHTML = `
    <div class="handout-heading">
      <div class="card-meta">${escHtml(data.subjectTitle)}</div>
      <h1 class="tui-h1">${escHtml(data.handoutTitle)}</h1>
    </div>
    <nav class="tabbar" aria-label="Handout sections">${tabsHtml}</nav>
    <div id="tab-panel" class="tab-panel"></div>
    <nav class="prev-next-nav" aria-label="Adjacent handouts">
      <div>${
        prevH
          ? `<a class="tui-btn" href="#/${prevH.subject}/${prevH.handout}/${route.tab}">&lt; prev: ${escHtml(
              prevH.title
            )}</a>`
          : ''
      }</div>
      <div>${
        nextH
          ? `<a class="tui-btn" href="#/${nextH.subject}/${nextH.handout}/${route.tab}">next: ${escHtml(
              nextH.title
            )} &gt;</a>`
          : ''
      }</div>
    </nav>
  `;

  const panel = document.getElementById('tab-panel');
  if (route.tab === 'reviewer') {
    activeCleanup = await renderReviewerTab(panel, data);
  } else if (route.tab === 'pdf') {
    setRightRail([]);
    activeCleanup = await mountPdfViewer(panel, {
      pdfUrl: data.pdfUrl,
      pdfFile: data.pdfFile,
      pdfKey: `${data.subject}/${data.handout}`,
      store,
      loadPdfJs,
    });
  } else if (route.tab === 'quiz') {
    activeCleanup = renderQuizTab(panel, data);
  } else if (route.tab === 'drill') {
    activeCleanup = renderDrillTab(panel, data);
  }
}

async function renderWeakSpotsView(container) {
  setRightRail([]);
  const entries = store.getAllWeakSpots();

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="tui-box tui-active">
        <div class="tui-title">weak spots</div>
        <h1 class="tui-h1">No weak spots yet</h1>
        <p class="card-meta">Questions you miss or flag (F) appear here across all 8 handouts.</p>
        <a href="#/" class="tui-btn tui-btn-primary">&gt; back to home_</a>
      </div>
    `;
    return;
  }

  const groups = [];
  const allWeakQuestions = [];

  for (const entry of entries) {
    const [subject, handout] = entry.handoutKey.split('/');
    try {
      const data = await getHandoutData(subject, handout);
      const idSet = new Set(entry.combinedIds);
      const questions = data.questions
        .filter((q) => idSet.has(q.id))
        .map((q) => ({ ...q, handoutKey: entry.handoutKey }));

      if (questions.length > 0) {
        groups.push({ data, entry, questions });
        allWeakQuestions.push(...questions);
      }
    } catch {
      // skip unknown
    }
  }

  if (allWeakQuestions.length === 0) {
    container.innerHTML = `
      <div class="tui-box">
        <div class="tui-title">weak spots</div>
        <p>All weak spots cleared!</p>
        <a href="#/" class="tui-btn tui-btn-primary">&gt; cd ~_</a>
      </div>
    `;
    return;
  }

  const groupsHtml = groups
    .map(
      ({ data, entry, questions }) => `
      <section class="tui-box" style="margin-top:16px;">
        <div class="tui-title">${escHtml(data.subjectShort)} / ${escHtml(data.handoutTitle)}</div>
        <div class="choices-list">
          ${questions
            .map((q) => {
              const isMissed = entry.missedIds.includes(q.id);
              const isFlagged = entry.flaggedIds.includes(q.id);
              const tags = [isMissed ? 'missed' : '', isFlagged ? 'flagged' : '']
                .filter(Boolean)
                .join(' + ');
              return `
                <div class="setting-row weak-row">
                  <div style="min-width:0;">
                    <div class="card-meta">[${tags}] Q${q.number}</div>
                    <div>${escHtml(q.prompt)}</div>
                  </div>
                  <button
                    type="button"
                    class="tui-btn weak-clear-btn"
                    data-clear-key="${escHtml(entry.handoutKey)}"
                    data-clear-id="${escHtml(q.id)}"
                  >
                    [clear]
                  </button>
                </div>
              `;
            })
            .join('')}
        </div>
      </section>
    `
    )
    .join('');

  container.innerHTML = `
    <div class="tui-box tui-active">
      <div class="tui-title">weak spots :: ${allWeakQuestions.length} items</div>
      <h1 class="tui-h1">Weak Spots</h1>
      <p class="card-meta">Questions you missed or flagged across all handouts. Answering them right removes them.</p>
      <button type="button" id="btn-weak-quiz" class="tui-btn tui-btn-primary">
        &gt; start weak spots quiz (${allWeakQuestions.length})<span class="cursor-blink">_</span>
      </button>
    </div>
    <div id="weak-content">${groupsHtml}</div>
  `;

  document.getElementById('btn-weak-quiz')?.addEventListener('click', () => {
    const target = document.getElementById('weak-content');
    activeCleanup = renderQuizTab(
      target,
      { subject: 'weak', handout: 'all', questions: allWeakQuestions },
      { weakMode: true, autoStart: true }
    );
  });

  container.querySelectorAll('[data-clear-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.clearWeakSpot(btn.dataset.clearKey, btn.dataset.clearId);
      updateSidebar({ view: 'weak' });
      renderWeakSpotsView(container);
    });
  });
}

function renderSettingsView(container) {
  setRightRail([]);
  const theme = store.getTheme();
  const readingFont = store.getReadingFont();
  const wowEnabled = store.getWowEnabled();

  container.innerHTML = `
    <div class="tui-box tui-active">
      <div class="tui-title">settings</div>
      <h1 class="tui-h1">Preferences</h1>

      <div class="setting-row setting-row-stack">
        <div>
          <strong>Theme</strong>
          <div class="card-meta">dark, paper (light), crt (phosphor), amber</div>
        </div>
        <div class="settings-theme-group">
          ${THEMES.map(
            (t) =>
              `<button type="button" class="tui-btn ${
                t === theme ? 'tui-btn-primary' : ''
              }" data-set-theme="${t}">[${t}]</button>`
          ).join('')}
        </div>
      </div>

      <div class="setting-row">
        <div>
          <strong>Reading font (Inter)</strong>
          <div class="card-meta">Use Inter for reviewer prose instead of JetBrains Mono</div>
        </div>
        <button type="button" id="btn-toggle-font" class="tui-btn">
          [ ${readingFont ? 'ON' : 'off'} ]
        </button>
      </div>

      <div class="setting-row">
        <div>
          <strong>Terminal animations (wow effects)</strong>
          <div class="card-meta">Boot sequence, banner decode, typewriter reveal</div>
        </div>
        <button type="button" id="btn-toggle-wow" class="tui-btn">
          [ ${wowEnabled ? 'ON' : 'off'} ]
        </button>
      </div>

      <div class="setting-row">
        <div>
          <strong>Reset saved progress</strong>
          <div class="card-meta">Clears best scores, missed questions, flags, and preferences</div>
        </div>
        <button type="button" id="btn-reset-all" class="tui-btn tui-btn-danger">
          [ reset progress ]
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll('[data-set-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = store.setTheme(btn.dataset.setTheme);
      applyTheme(next);
      renderSettingsView(container);
      showToast(`[ok] theme: ${next}`);
    });
  });

  document.getElementById('btn-toggle-font')?.addEventListener('click', () => {
    const next = store.setReadingFont(!store.getReadingFont());
    applyReadingFont(next);
    renderSettingsView(container);
  });

  document.getElementById('btn-toggle-wow')?.addEventListener('click', () => {
    store.setWowEnabled(!store.getWowEnabled());
    renderSettingsView(container);
  });

  document.getElementById('btn-reset-all')?.addEventListener('click', () => {
    store.resetAll();
    applyTheme(store.getTheme());
    applyReadingFont(store.getReadingFont());
    updateSidebar({ view: 'settings' });
    renderSettingsView(container);
    showToast('[ok] progress reset');
  });
}

function render404(container, route) {
  setRightRail([]);
  container.innerHTML = `
    <div class="tui-box tui-active">
      <div class="tui-title">404</div>
      <pre style="color:var(--bad);white-space:pre-wrap;">bash: cd: ${escHtml(
        route.path || '/unknown'
      )}: no such file or directory</pre>
      <a href="#/" class="tui-btn tui-btn-primary">&gt; [ cd ~ ]<span class="cursor-blink">_</span></a>
    </div>
  `;
}

async function handleRoute() {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
  closeDrawer();

  const route = parseHash(window.location.hash, manifest);
  setBreadcrumb(route);
  updateSidebar(route);

  const container = document.getElementById('app-view');
  if (!container) return;

  if (route.view === 'home') {
    renderHome(container);
  } else if (route.view === 'weak') {
    await renderWeakSpotsView(container);
  } else if (route.view === 'settings') {
    renderSettingsView(container);
  } else if (route.view === 'handout') {
    await renderHandoutView(container, route);
  } else {
    render404(container, route);
  }
}

function bindGlobalShortcuts() {
  const helpModal = document.getElementById('help-modal');
  const openHelp = () => (helpModal.hidden = false);
  const closeHelp = () => (helpModal.hidden = true);

  document.getElementById('btn-help')?.addEventListener('click', openHelp);
  document.getElementById('help-close')?.addEventListener('click', closeHelp);
  helpModal?.querySelector('[data-close-modal="help"]')?.addEventListener('click', closeHelp);

  document.addEventListener('keydown', (e) => {
    const tag = (e.target?.tagName || '').toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette?.open();
      return;
    }

    if (e.key === 'Escape') {
      if (palette?.isOpen()) palette.close();
      if (!helpModal.hidden) closeHelp();
      closeDrawer();
      return;
    }

    if (isInput || palette?.isOpen() || !helpModal.hidden) return;

    if (e.key === '/') {
      e.preventDefault();
      palette?.open();
      return;
    }
    if (e.key === '?') {
      e.preventDefault();
      openHelp();
      return;
    }

    if (activeQuizController) {
      const k = e.key.toUpperCase();
      if (['1', '2', '3', '4'].includes(k)) {
        e.preventDefault();
        activeQuizController.pick(['A', 'B', 'C', 'D'][Number(k) - 1]);
      } else if (['A', 'B', 'C', 'D'].includes(k)) {
        e.preventDefault();
        activeQuizController.pick(k);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        activeQuizController.next();
      } else if (k === 'F') {
        e.preventDefault();
        activeQuizController.flag();
      } else if (k === 'R') {
        e.preventDefault();
        activeQuizController.retry();
      }
      return;
    }

    if (activeDrillController) {
      if (e.key === ' ') {
        e.preventDefault();
        activeDrillController.flip();
      } else if (e.key === '1' || e.key.toLowerCase() === 'g') {
        e.preventDefault();
        activeDrillController.gotIt();
      } else if (e.key === '2' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        activeDrillController.again();
      }
    }
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // ignore registration failure on unsupported context
    });
  }
  const badge = document.getElementById('offline-badge');
  const syncOnline = () => {
    if (badge) badge.hidden = navigator.onLine;
  };
  window.addEventListener('online', syncOnline);
  window.addEventListener('offline', syncOnline);
  syncOnline();
}

async function init() {
  applyTheme(store.getTheme());
  applyReadingFont(store.getReadingFont());
  logConsoleEasterEgg();

  manifest = await fetchJson('/manifest.json');
  const searchIndex = await fetchJson('/search-index.json').catch(() => []);
  initSearch(searchIndex);

  palette = createPaletteController({
    manifest,
    onTheme: (theme) => {
      store.setTheme(theme);
      applyTheme(theme);
      showToast(`[ok] theme: ${theme}`);
    },
    onNavigate: (route) => navigate(route),
  });

  document.getElementById('btn-menu')?.addEventListener('click', toggleDrawer);
  document.getElementById('sidebar-backdrop')?.addEventListener('click', closeDrawer);
  document.getElementById('btn-search')?.addEventListener('click', () => palette.open());

  const cycleTheme = () => {
    const curr = store.getTheme();
    const next = THEMES[(THEMES.indexOf(curr) + 1) % THEMES.length];
    store.setTheme(next);
    applyTheme(next);
    showToast(`[ok] theme: ${next}`);
  };

  const shareCurrentPage = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('[ok] link copied');
    } catch {
      showToast('[ok] copy URL from address bar');
    }
  };

  document.getElementById('btn-theme')?.addEventListener('click', cycleTheme);
  document.getElementById('drawer-btn-theme')?.addEventListener('click', cycleTheme);
  document.getElementById('btn-share')?.addEventListener('click', shareCurrentPage);
  document.getElementById('drawer-btn-share')?.addEventListener('click', () => {
    closeDrawer();
    shareCurrentPage();
  });

  bindGlobalShortcuts();
  registerServiceWorker();

  await runBootSequence(manifest, store);
  window.addEventListener('hashchange', handleRoute);
  await handleRoute();
}

init();


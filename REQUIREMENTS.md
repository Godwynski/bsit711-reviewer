# BSIT-711 Pre-Finals Reviewer: Requirements & Plan (v3, audited)

| | |
|---|---|
| Status | Audited draft, waiting for "go" |
| Project folder | `C:\Users\Godwyn\Documents\Projects\bsit711-reviewer\` |
| Audience | Me plus friends sharing the link, mostly on phones |
| Decisions locked | Public site, no mixed-subject quiz, GitHub + Vercel auto-deploy, ASCII/terminal design |

---

## 0. Audit summary (changes since v2)
| # | Finding | Fix in v3 |
|---|---|---|
| A1 | **Build would break on Vercel.** The build script read files from my local `Academics` folder, which Vercel can't see. | Content is copied into the repo (`content/`) with `npm run sync`. Vercel only parses what's committed. |
| A2 | **PDFs don't display inline on Android Chrome**, and display poorly on iOS. Most of my friends are on phones. | Use **PDF.js** (pinned, from a CDN) for the viewer on all devices. Keep Open/Download as a fallback. |
| A3 | Two visual specs contradicted each other: an Inter/indigo "card" style vs an ASCII terminal style. | One design system only (§6), terminal style. Inter is kept only as the optional "reading font". |
| A4 | Hard to find a term across 8 reviewers. | **Ctrl+K / `/` command palette** searches all terms, questions and handouts. It's useful and fits the terminal look. |
| A5 | Instant feedback makes practice easy but doesn't feel like the real exam. | Add an **Exam mode**: no feedback until the end, optional timer, then Retry missed. |
| A6 | Look-alike terms are the main reason students lose points, but they were only readable, not drillable. | **Look-alike drill**: flip cards built from the §2 tables of each reviewer. |
| A7 | Missed questions only stayed with each handout. | **Weak spots** page that collects missed and flagged questions across all subjects. |
| A8 | Phone data and signal at school can be unreliable. | **Offline support (PWA)**: after the first visit, the reviewers and quizzes work offline and it can be installed to the home screen. |
| A9 | The plan's sections were out of order (open questions in the middle, UI split in two). | The document is restructured: Goal → Content → Features → UX → Design → Tech → Quality → Delivery. |
| A10 | Shuffling the choice order would break explanations that say "(A) is wrong". | When shuffling, letters in explanations are remapped. Choice shuffle stays OFF by default. |
| A11 | No way to mark a question you're unsure about. | A **flag** button on every question. Flagged questions go to Weak spots. |
| A12 | The "wow" moments weren't specified. | A short boot sequence, a typewriter effect, a CRT theme, and themed ASCII scenes (§6.4). All can be skipped and respect reduced motion. |

---

## 1. Goal
One place to review for the pre-finals multiple-choice exam. Pick a subject, then a handout, and from there **read the reviewer, check the PDF, or take the quiz**. The quiz focuses on fixing mistakes with **Retry missed**. It should be fast, work on phones and offline, and be easy to share.

**Success means:**
- A first-time user on a phone reaches a quiz question in ≤3 taps.
- Retry-missed loops until no questions are left.
- Any term can be found in ≤2 seconds with search.

## 2. Content
- **Source:** `...\Academics\BSIT-711\Reviewers\Pre-Finals\<Subject>\`. It has 5 subjects and 8 handouts. Euthenics 2 is excluded.

| Subject (slug) | Handouts |
|---|---|
| Computer Graphics Programming (`graphics`) | Scene Graph Framework |
| Game Development (`gamedev`) | Gameplay, Levels |
| Information Assurance & Security (`infosec`) | Cloud Computing Threats & Countermeasures |
| IT Service Management (`itsm`) | Service Systems Economics I, II |
| Network Technology 2 (`network`) | Compute, Storage |

- **`npm run sync`** copies the PDFs and `Reviewer_*.md` files into `content/<subject>/<handout>/`. These copies are committed.
- **Parsing:** the build reads these sections of each reviewer:
  - §1 Key Terms table → terms used by search
  - §2 look-alike group tables → flip cards for the look-alike drill
  - §5 questions + Answer Key → the quiz
  - §6 Cram sheet → the cram view

## 3. Features

### 3.1 Navigation
- **F1 Home:**
  - Subject sections with handout cards. Each card shows the question count, a best-score bar, a "missed N" badge, and a "last studied" time.
  - A "Continue where you left off" link.
- **F2 Sidebar file tree:** lists every handout and is always visible on desktop. On phones it's a slide-out drawer.
- **F3 Handout page tabs:** `[ Reviewer ] [ PDF ] [ Quiz ] [ Drill ]`. Each tab has its own link (`#/network/storage/quiz`), so the Back button, bookmarks and shared links all work.
- **F4 Command palette** (Ctrl+K, `/`, or a 🔍 button on phones):
  - Fuzzy search over handouts, key terms (with definition preview), and question text.
  - Commands such as `theme crt`, `go storage quiz`, `weak spots`.
- **F5 Previous/next handout** links at the bottom of every page.

### 3.2 Reviewer tab
- **F6** Shows the reviewer as formatted text.
  - The "On this page" list is pinned on desktop and becomes a "jump to" menu on phones.
  - Wide tables scroll sideways inside the table only, never the whole page.
- **F7** The Answer Key is collapsed until you choose `[ show answers ]`.
- **F8** A **Cram mode** toggle shows only §6 (cram sheet) and §4 (lists), for the last 10 minutes before the exam.
- **F9 Split view** on desktop: the reviewer on the left and the PDF on the right.

### 3.3 PDF tab
- **F10** PDF.js viewer: page up/down, zoom, fit to width, page number. It fills the screen height.
- **F11** Open-in-new-tab and Download buttons.

### 3.4 Quiz tab
- **F12 Start screen:**
  - Choose a mode, **Practice** (instant feedback) or **Exam** (feedback at the end, optional timer of N×1 min).
  - Toggles: shuffle questions (ON), shuffle choices (OFF).
  - If you have missed questions saved from before: a `[ practice my N missed ]` button.
- **F13 Question screen:**
  - One question at a time. Choices are A–D buttons; keys `1-4` and `A-D` also work.
  - **Practice:** choices lock after answering. The right answer shows `[OK]` and a wrong pick shows `[X]`. The explanation appears.
  - **Exam:** the next question appears straight away, with no feedback.
  - Flag button (`F` key). Progress bar and score.
- **F14 Results:**
  - Score, time taken, and missed questions you can expand (your answer, the right answer, the explanation).
- **F15 Retry missed:**
  - A new round containing only the questions you got wrong, showing `round N :: K left`.
  - Rounds repeat until none are left, then the CLEARED screen. Also available from the R key.
- **F16 Saved progress** (localStorage, best effort):
  - Saves best score, last score, missed questions, flagged questions, last place visited, and theme.
  - A `[ reset progress ]` button in settings.
  - The site still works if storage is blocked.

### 3.5 Drill tab (look-alike terms)
- **F17** Flip cards generated from each look-alike group. The front shows a clue ("block storage, low latency, single AZ") and the back shows the term with its key difference.
- You mark each card "got it" or "again". Cards marked "again" come back, the same idea as Retry missed.

### 3.6 Weak spots page (`#/weak`)
- **F18** All missed and flagged questions from every subject, grouped by handout.
- One button starts a quiz from these questions.
- Questions you clear are removed.

### 3.7 Sharing, offline, extras
- **F19 Share:**
  - The Share button uses the phone's built-in share sheet. Otherwise it copies the link and shows a `link copied` message.
  - A preview image (Open Graph) so shared links look good in Messenger.
- **F20 Offline support (PWA):**
  - A service worker pre-caches the site, reviewers and quiz data.
  - PDFs are cached after you first open them.
  - It can be installed to the home screen and shows an `offline` indicator when there's no connection.
- **F21** Search engines are blocked (`noindex`), so the site is shareable but doesn't show up in Google.

## 4. UX principles
1. Content first. Each screen has one main action, shown as a `>` prompt.
2. Keyboard controls are the same everywhere:
   - `1-4` answer
   - `Enter` next
   - `R` retry
   - `F` flag
   - `/` search
   - `?` show the shortcut list
3. Phones come first: tap targets are at least 44px, the header sticks to the top, and the tab bar is easy to reach with a thumb.
4. Nothing spoils answers by accident: the answer key is collapsed and Exam mode hides feedback.
5. Every "wow" effect can be skipped, plays only once per session, and is off when the phone or computer is set to reduce motion.

## 5. Information architecture
```
#/                       home
#/weak                   weak spots
#/:subject/:handout/reviewer | pdf | quiz | drill
#/404                    not found
```

## 6. Design system: "clean terminal"
A polished text-mode interface (TUI). All text is real HTML (accessible and crisp). The ASCII look comes from fonts, CSS borders and box-drawing characters.

### 6.1 Tokens (CSS variables defined on `:root`)
| Token | Dark (default) | Light ("paper") | Use |
|---|---|---|---|
| `--bg` | #0B0D10 | #F6F5F1 | page |
| `--panel` | #12151A | #FFFFFF | boxes |
| `--line` | #2A2F38 | #D6D3CB | box borders |
| `--text` / `--dim` | #D8DEE9 / #6B7385 | #1D1F23 / #7A7A72 | text |
| `--accent` | #7AE582 (phosphor green) | #2F7D32 | active item, cursor, `>` prompt |
| `--ok` / `--bad` | #7AE582 / #FF6B6B | #2F7D32 / #C62828 | feedback, always with `[OK]`/`[X]` |

Themes:
- **Dark**: the default.
- **Paper**: light.
- **CRT**: green phosphor, a faint glow and scanlines.
- **Amber**: #FFB000.

The theme is chosen in the command palette or with the theme button.

### 6.2 Type and spacing
- **Fonts:** JetBrains Mono for everything. An optional Inter "reading font" for reviewer text.
- **Sizes:**
  - Body 15–16px with 1.7 line height, and lines are at most 72 characters wide.
  - Headings are uppercase, letter-spaced, and start with `##`.
- **Spacing:** an 8px grid. Boxes have 1px borders with a title cut into the top line (`┌─ TITLE ───┐`). The active box gets a heavy border plus the accent color.

### 6.3 Components
| Component | Look |
|---|---|
| Tab | `[ Reviewer ]`, or `[*Quiz*]` when active, with an accent underline |
| Button | `> retry missed (4)_`, with a blinking cursor on the main action |
| Progress | `[########------] 57%`, characters sized by CSS so they never overflow |
| Choice | Full-width row `[B] Amazon EBS SSD volume`. On hover/focus it shows `>` and is highlighted. |
| Feedback | `<── [OK] correct` / `<── [X] your pick`, plus the explanation as a `// comment` |
| Sidebar | A file tree: `├─ network/` `│  └─ storage` |
| On this page | Dotted leaders: `2 look-alikes ..........` |
| Toast | `[ok] link copied`, bottom-right, 2s |
| Table | An ASCII-style grid `+---+---+` built with CSS borders, zebra rows in dim colors |

### 6.4 Wow moments (all tasteful and skippable)
1. **Boot sequence:**
   - Shown on the first visit of a session, about 1.2s. Clicking or pressing any key skips it.
   ```
   BSIT-711 BIOS v7.11 ...... ok
   mounting /reviewers ....... 8 handouts
   loading questions ......... 160 ok
   > welcome. good luck on pre-finals_
   ```
2. **Hero banner:** a large FIGlet-style `BSIT-711` banner whose characters "decode" (scramble, then settle) once.
3. **Typewriter question reveal:** about 300ms, and skipped instantly if you tap or answer.
4. **Subject ASCII headers:** small line-art icons, one per subject. Graphics is a wireframe cube, GameDev a controller, InfoSec a padlock, ITSM a `[$]-->[$]` flow, and Network linked nodes.
5. **Results scene:** a score bar that fills up, then ends on a short ASCII message:
   - 100% → `ALL CLEAR` banner
   - lower scores → "retry the N you missed"
6. **CLEARED screen** after the last retry round: a box border drawn line by line.
7. **404 page:** `bash: cd: /that-page: no such file or directory`, with a `[ cd ~ ]` button to go home.
8. **Console easter egg** (in the browser's developer console): the banner plus `good luck on pre-finals`.

Accessibility for all of these:
- The decorative ASCII is hidden from screen readers.
- Real headings and labels sit underneath.
- Feedback is announced through an `aria-live` region ("Correct" / "Incorrect, answer is B").

### 6.5 Key layouts
```
DESKTOP ≥1024
┌─ BSIT-711 ─────┬─ ~/network/storage ───────────────────────┬─ index ──────┐
│ ├─ graphics/   │ [ Reviewer ] [ PDF ] [*Quiz*] [ Drill ]  /│ 1 terms ...  │
│ ├─ gamedev/    │──────────────────────────────────────────│ 2 alikes ... │
│ ├─ infosec/    │ ┌─ QUIZ :: storage ─ 07/20 ─ score 5 ──┐ │ 3 traps .... │
│ ├─ itsm/       │ │ [#######-------------] 35%           │ │              │
│ └─ network/    │ │ > A company runs a transactional ... │ │              │
│    ├─ compute  │ │   [A] EBS HDD                        │ │              │
│    └─ storage  │ │   [B] EBS SSD        <── [OK] correct│ │              │
│ ── weak spots  │ │   [C] EFS Archive    <── [X] your pick││              │
│                │ │ // SSD = low-latency random I/O      │ │              │
│                │ │                          > next_     │ │              │
└────────────────┴──────────────────────────────────────────┴──────────────┘
MOBILE <768: [≡] BSIT-711 [/] [◐]   ·  sticky [Rev][PDF][Quiz][Drill]  ·  sidebar = drawer
```

## 7. Tech design
- **Stack:**
  - Static HTML + CSS + vanilla JS (ES modules) with hash routing, and no framework.
  - No build bundler. Only a Node build script.
- **Libraries** (exact versions, from the cdnjs CDN):
  - `marked` (Markdown)
  - `pdf.js` (PDF viewer)
  - `fuse.js` (fuzzy search)
- **Scripts:**
  - `npm run sync`: Academics folder → `content/`. Run locally whenever the reviewers change.
  - `npm run build`: `content/` → `dist/`, which includes:
    - `data/<subject>/<handout>.json`: questions, terms, look-alikes, cram list
    - `search-index.json`
    - `manifest.json`
    - copied PDFs and Markdown
    - a service worker with a cache version hash
  - The build **fails** if any question has ≠4 choices, a missing or invalid answer, or the question count doesn't match the key count.
- **Repo layout:**
  ```
  content/            synced PDFs + reviewers (committed)
  scripts/sync.mjs  scripts/build.mjs  scripts/parse.mjs
  src/  index.html  app.js  router.js  quiz.js  drill.js  search.js  store.js  boot.js  style.css  sw.js
  tests/  parse.test.mjs  quiz.test.mjs  store.test.mjs  e2e.spec.mjs
  vercel.json  package.json  REQUIREMENTS.md  README.md
  ```
- **Vercel:** build command `npm run build`, output folder `dist`, plus long-cache headers for PDFs and data files.

## 8. Quality
- **Unit tests** (`node --test`):
  - The parser, run on all 8 real reviewers: question count equals answer count, 4 choices, valid letter, terms and look-alikes found.
  - A malformed reviewer makes the parser throw an error.
  - Quiz logic:
    - scoring
    - retry contains exactly the missed questions, and an empty retry round means CLEARED
    - shuffle keeps every question exactly once
    - letters in explanations are remapped correctly when choices are shuffled
    - exam mode shows no feedback until results
  - Store: still works when storage is blocked; reset clears everything.
- **E2E** (Playwright, desktop + Pixel phone size):
  - home → subject → each tab
  - the PDF renders a page
  - a quiz with 2 deliberate misses → Retry shows exactly those 2 → CLEARED
  - search finds a term
  - a deep link opens the right tab
  - the site works offline after a reload
- **Checks:**
  - No sideways scrolling at 360px.
  - Lighthouse score ≥90 for performance and accessibility.
  - AA contrast in all 4 themes.
  - The quiz can be completed using only the keyboard.

## 9. Delivery
| # | Milestone | Done when |
|---|---|---|
| M1 | Scaffold, sync, parser + tests | All 8 reviewers parse and the tests pass |
| M2 | Design system + home + sidebar + router | Layouts work at 360/768/1280px |
| M3 | Reviewer + PDF.js + split view + cram mode | PDFs render on desktop and the phone emulation |
| M4 | Quiz (practice, exam, retry, flag) + store | The quiz tests pass |
| M5 | Drill, weak spots, command palette | Search finds terms |
| M6 | Wow layer + themes + PWA + share/OG | Effects can be skipped and the site works offline |
| M7 | E2E + screenshots → GitHub repo → Vercel preview | You review the preview link |
| M8 | Production URL | You approve |

## 10. Out of scope
Accounts, syncing progress between devices, editing in the browser, Euthenics 2, a mixed-subject quiz, and AI-generated questions beyond the reviewers.

## 11. Risks
- **Public PDFs** are school material. You chose a public site, and `noindex` limits discovery. They can be removed from `content/` at any time.
- **Reviewer format changes** would break parsing. The build fails loudly, so a broken quiz never goes live.
- **Wow effects getting annoying** after a few visits. They run once per session, can be skipped, and have an off switch in settings.

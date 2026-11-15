const HERO_ASCII = [
  ' ____  ____ ___ _____     _____ _ _ ',
  '| __ )/ ___|_ _|_   _|   |___  / / |',
  '|  _ \\___ \\| |  | |_____   / /| | |',
  '| |_) |___) | |  | |_____| / / | | |',
  '|____/|____/___| |_|      /_/  |_|_|',
].join('\n');

const SUBJECT_ASCII = {
  cube: [
    '  +---+',
    ' /   /|',
    '+---+ |',
    '|   | +',
    '+---+',
  ].join('\n'),
  gamepad: [
    ' .-------.',
    '| +  o o |',
    " '-------'",
  ].join('\n'),
  lock: [
    '  .--.',
    ' |    |',
    '+------+',
    '| [##] |',
    '+------+',
  ].join('\n'),
  flow: [
    '[$]-->[$]',
    ' ^     |',
    ' +-----+',
  ].join('\n'),
  nodes: [
    '[o]--[o]',
    ' | \\ |',
    '[o]--[o]',
  ].join('\n'),
};

export function prefersReducedMotion() {
  try {
    return (
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  } catch {
    return false;
  }
}

export function shouldPlayWow(store) {
  if (!store.getWowEnabled()) return false;
  if (prefersReducedMotion()) return false;
  return true;
}

export function getHeroAscii() {
  return HERO_ASCII;
}

export function getSubjectAscii(icon) {
  return SUBJECT_ASCII[icon] || SUBJECT_ASCII.cube;
}

export function logConsoleEasterEgg() {
  try {
    console.log(
      `%c${HERO_ASCII}\n\n> good luck on pre-finals_`,
      'color: #7AE582; font-family: monospace; font-weight: bold;'
    );
  } catch {
    // ignore
  }
}

export function runBootSequence(manifest, store) {
  const overlay = document.getElementById('boot-overlay');
  const logEl = document.getElementById('boot-log');
  if (!overlay || !logEl) return Promise.resolve();

  let alreadyBooted = false;
  try {
    alreadyBooted = sessionStorage.getItem('bsit711-booted') === '1';
  } catch {
    alreadyBooted = false;
  }

  if (alreadyBooted || !shouldPlayWow(store)) {
    overlay.hidden = true;
    return Promise.resolve();
  }

  try {
    sessionStorage.setItem('bsit711-booted', '1');
  } catch {
    // ignore
  }

  const lines = [
    'BSIT-711 BIOS v7.11 ...... ok',
    `mounting /reviewers ....... ${manifest.handoutCount} handouts`,
    `loading questions ......... ${manifest.totalQuestions} ok`,
    '> welcome. good luck on pre-finals_',
  ];

  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  logEl.textContent = '';

  return new Promise((resolve) => {
    let finished = false;
    const timers = [];

    const cleanup = () => {
      if (finished) return;
      finished = true;
      timers.forEach((t) => clearTimeout(t));
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      overlay.removeEventListener('click', cleanup);
      document.removeEventListener('keydown', onKeySkip, true);
      resolve();
    };

    const onKeySkip = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      cleanup();
    };

    overlay.addEventListener('click', cleanup);
    document.addEventListener('keydown', onKeySkip, true);

    lines.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          if (finished) return;
          logEl.textContent += (i > 0 ? '\n' : '') + line;
        }, i * 240)
      );
    });

    timers.push(setTimeout(cleanup, 1200));
  });
}

export function animateDecode(el, finalText, store) {
  if (!el) return;
  let decodedOnce = false;
  try {
    decodedOnce = sessionStorage.getItem('bsit711-hero-decoded') === '1';
  } catch {
    decodedOnce = false;
  }

  if (decodedOnce || !shouldPlayWow(store)) {
    el.textContent = finalText;
    return;
  }

  try {
    sessionStorage.setItem('bsit711-hero-decoded', '1');
  } catch {
    // ignore
  }

  const glyphs = '#@%*+=-:.';
  let frame = 0;
  const totalFrames = 10;

  const step = () => {
    frame++;
    const revealRatio = frame / totalFrames;
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i];
      if (ch === '\n' || ch === ' ') {
        out += ch;
      } else if (i / finalText.length <= revealRatio) {
        out += ch;
      } else {
        out += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
    }
    el.textContent = out;
    if (frame < totalFrames) {
      requestAnimationFrame(step);
    } else {
      el.textContent = finalText;
    }
  };
  requestAnimationFrame(step);
}

export function revealTypewriter(el, text, store) {
  if (!el) return () => {};
  if (!shouldPlayWow(store)) {
    el.textContent = text;
    return () => {};
  }

  // Reserve final rendered height so choices below don't shift while typing
  el.textContent = text;
  const targetHeight = el.offsetHeight;
  if (targetHeight > 0) {
    el.style.minHeight = `${targetHeight}px`;
  }

  let idx = 0;
  const stepSize = Math.max(2, Math.ceil(text.length / 18));
  let timer = null;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    if (timer) clearInterval(timer);
    el.textContent = text;
    el.style.minHeight = '';
  };

  el.textContent = '';
  timer = setInterval(() => {
    idx += stepSize;
    if (idx >= text.length) {
      finish();
    } else {
      el.textContent = text.slice(0, idx);
    }
  }, 16);

  return finish;
}

export function getAllClearBanner() {
  return [
    '+-------------------------------+',
    '|   A L L   C L E A R   100%    |',
    '+-------------------------------+',
  ].join('\n');
}

export function getClearedBoxLines() {
  return [
    '+========================================+',
    '|  ROUND CLEARED :: 0 QUESTIONS LEFT     |',
    '|  status: READY FOR PRE-FINALS          |',
    '+========================================+',
  ];
}

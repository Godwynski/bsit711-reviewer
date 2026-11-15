/**
 * Pure quiz engine: shuffling, explanation letter remapping, practice/exam modes, scoring, and retry-missed rounds.
 */

const LETTERS = ['A', 'B', 'C', 'D'];

export function shuffleArray(items, rng = Math.random) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Remaps choice letter references in answer explanations when choices are shuffled.
 * Performs single-pass replacement so swapped letters (e.g. A<->B) never collide.
 */
export function remapExplanationLetters(explanation, oldToNew) {
  if (!explanation || !oldToNew) return explanation;

  const mapLetter = (ch) => oldToNew[ch] || ch;
  const mapGroup = (group) => group.replace(/[A-D]/g, mapLetter);

  // Order of patterns matters: match explicit contexts where A-D refers to a choice letter
  const pattern = new RegExp(
    [
      // Parenthesized list or single letter: (A), (A/B), (A, B), (A and B)
      '\\(\\s*([A-D](?:\\s*(?:,|\\/|and|or)\\s*[A-D])*)\\s*\\)',
      // "Option A" / "Choice B"
      '\\b(Option|Choice)\\s+([A-D])\\b',
      // "Why not A/B/C" or "Why A is wrong"
      '\\b(Why(?:\\s+not)?)\\s+([A-D](?:\\s*\\/\\s*[A-D])*)\\b',
      // Emphasized standalone letter like *A* or **B** or *A (term)*
      '(\\*{1,2})([A-D])(?=\\1|\\s*\\()',
      // "A is wrong/incorrect/correct/right"
      '\\b([A-D])(\\s+is\\s+(?:wrong|incorrect|correct|right))\\b',
      // "answer is B"
      '\\b(answer\\s+is)\\s+([A-D])\\b',
    ].join('|'),
    'g'
  );

  return explanation.replace(
    pattern,
    (
      full,
      parenGroup,
      optWord,
      optLetter,
      whyWord,
      whyGroup,
      starMarks,
      starLetter,
      subjLetter,
      subjSuffix,
      ansPrefix,
      ansLetter
    ) => {
      if (parenGroup) {
        return `(${mapGroup(parenGroup)})`;
      }
      if (optWord && optLetter) {
        return `${optWord} ${mapLetter(optLetter)}`;
      }
      if (whyWord && whyGroup) {
        return `${whyWord} ${mapGroup(whyGroup)}`;
      }
      if (starMarks && starLetter) {
        return `${starMarks}${mapLetter(starLetter)}`;
      }
      if (subjLetter && subjSuffix) {
        return `${mapLetter(subjLetter)}${subjSuffix}`;
      }
      if (ansPrefix && ansLetter) {
        return `${ansPrefix} ${mapLetter(ansLetter)}`;
      }
      return full;
    }
  );
}

export function prepareQuestion(question, { shuffleChoices = false, rng = Math.random } = {}) {
  if (!shuffleChoices) {
    return {
      ...question,
      choices: { ...question.choices },
      choiceMap: { A: 'A', B: 'B', C: 'C', D: 'D' },
    };
  }

  const perm = shuffleArray(LETTERS, rng);
  const newChoices = {};
  const oldToNew = {};

  for (let i = 0; i < LETTERS.length; i++) {
    const newLetter = LETTERS[i];
    const oldLetter = perm[i];
    newChoices[newLetter] = question.choices[oldLetter];
    oldToNew[oldLetter] = newLetter;
  }

  return {
    ...question,
    choices: newChoices,
    answer: oldToNew[question.answer],
    explanation: remapExplanationLetters(question.explanation, oldToNew),
    choiceMap: oldToNew,
  };
}

export function createQuizSession(
  questions,
  {
    mode = 'practice',
    shuffleQuestions = true,
    shuffleChoices = false,
    timerMinutes = null,
    round = 1,
    rng = Math.random,
    now = Date.now,
  } = {}
) {
  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      mode,
      round,
      shuffleQuestions,
      shuffleChoices,
      timerSeconds: timerMinutes ? timerMinutes * 60 : null,
      queue: [],
      index: 0,
      results: [],
      completed: true,
      cleared: true,
      startedAt: now(),
      finishedAt: now(),
    };
  }

  const ordered = shuffleQuestions ? shuffleArray(questions, rng) : [...questions];
  const queue = ordered.map((q) => prepareQuestion(q, { shuffleChoices, rng }));

  return {
    mode,
    round,
    shuffleQuestions,
    shuffleChoices,
    timerSeconds: mode === 'exam' && timerMinutes ? timerMinutes * 60 : null,
    queue,
    index: 0,
    results: [],
    completed: false,
    cleared: false,
    startedAt: now(),
    finishedAt: null,
  };
}

export function submitAnswer(session, selectedLetter, { now = Date.now } = {}) {
  if (session.completed || session.index >= session.queue.length) {
    throw new Error('Quiz session is already completed');
  }
  const letter = String(selectedLetter || '').toUpperCase();
  if (!LETTERS.includes(letter)) {
    throw new Error(`Invalid choice letter: "${selectedLetter}"`);
  }

  const current = session.queue[session.index];
  // Prevent double answering the same question in practice mode
  const existing = session.results.find((r) => r.questionId === current.id);
  if (existing) {
    return {
      session,
      feedback: session.mode === 'practice' ? existing : null,
    };
  }

  const isCorrect = letter === current.answer;
  const entry = {
    questionId: current.id,
    number: current.number,
    prompt: current.prompt,
    choices: current.choices,
    selected: letter,
    correct: current.answer,
    isCorrect,
    explanation: current.explanation,
    handoutKey: current.handoutKey || null,
  };

  const results = [...session.results, entry];

  if (session.mode === 'exam') {
    const nextIndex = session.index + 1;
    const completed = nextIndex >= session.queue.length;
    const nextSession = {
      ...session,
      results,
      index: nextIndex,
      completed,
      finishedAt: completed ? now() : null,
    };
    return {
      session: nextSession,
      feedback: null, // Exam mode hides feedback until results
    };
  }

  // Practice mode: stays on current question so user sees immediate feedback, then calls advanceQuiz()
  const nextSession = {
    ...session,
    results,
  };

  return {
    session: nextSession,
    feedback: entry,
  };
}

export function advanceQuiz(session, { now = Date.now } = {}) {
  if (session.completed) return session;
  const nextIndex = session.index + 1;
  const completed = nextIndex >= session.queue.length;
  return {
    ...session,
    index: nextIndex,
    completed,
    finishedAt: completed ? now() : null,
  };
}

export function finishQuizByTimeout(session, { now = Date.now } = {}) {
  if (session.completed) return session;
  const answeredIds = new Set(session.results.map((r) => r.questionId));
  const extraResults = [];

  for (const q of session.queue) {
    if (!answeredIds.has(q.id)) {
      extraResults.push({
        questionId: q.id,
        number: q.number,
        prompt: q.prompt,
        choices: q.choices,
        selected: null,
        correct: q.answer,
        isCorrect: false,
        explanation: q.explanation,
        handoutKey: q.handoutKey || null,
      });
    }
  }

  return {
    ...session,
    results: [...session.results, ...extraResults],
    index: session.queue.length,
    completed: true,
    finishedAt: now(),
  };
}

export function getQuizSummary(session) {
  const total = session.queue.length;
  const correctResults = session.results.filter((r) => r.isCorrect);
  const missedResults = session.results.filter((r) => !r.isCorrect);
  const missedIds = new Set(missedResults.map((r) => r.questionId));
  const missedQuestions = session.queue.filter((q) => missedIds.has(q.id));
  const clearedIds = correctResults.map((r) => r.questionId);
  const correctCount = correctResults.length;
  const wrongCount = missedResults.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 100;
  const elapsedSeconds =
    session.finishedAt && session.startedAt
      ? Math.max(0, Math.round((session.finishedAt - session.startedAt) / 1000))
      : 0;

  return {
    round: session.round,
    mode: session.mode,
    total,
    correctCount,
    wrongCount,
    percentage,
    missedResults,
    missedQuestions,
    missedIds: [...missedIds],
    clearedIds,
    elapsedSeconds,
    cleared: total === 0 || wrongCount === 0,
  };
}

export function startRetryRound(
  previousSession,
  sourceQuestions,
  { rng = Math.random, now = Date.now } = {}
) {
  const summary = getQuizSummary(previousSession);
  if (summary.missedQuestions.length === 0) {
    return {
      ...previousSession,
      queue: [],
      results: [],
      index: 0,
      round: previousSession.round + 1,
      completed: true,
      cleared: true,
      finishedAt: now(),
    };
  }

  // Pull fresh unshuffled source questions if provided so choices aren't double-remapped
  const missedSet = new Set(summary.missedIds);
  const baseQuestions = sourceQuestions
    ? sourceQuestions.filter((q) => missedSet.has(q.id))
    : summary.missedQuestions;

  return createQuizSession(baseQuestions, {
    mode: previousSession.mode,
    shuffleQuestions: previousSession.shuffleQuestions,
    shuffleChoices: previousSession.shuffleChoices,
    timerMinutes: null,
    round: previousSession.round + 1,
    rng,
    now,
  });
}

export function formatAsciiBar(current, total, width = 20) {
  if (total <= 0) return `[${'#'.repeat(width)}] 100%`;
  const ratio = Math.max(0, Math.min(1, current / total));
  const filled = Math.round(ratio * width);
  const empty = Math.max(0, width - filled);
  const pct = Math.round(ratio * 100);
  return `[${'#'.repeat(filled)}${'-'.repeat(empty)}] ${pct}%`;
}

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  shuffleArray,
  remapExplanationLetters,
  prepareQuestion,
  createQuizSession,
  submitAnswer,
  advanceQuiz,
  finishQuizByTimeout,
  getQuizSummary,
  startRetryRound,
} from '../src/quiz.js';

const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    prompt: 'Which EBS volume fits transactional DBs?',
    choices: { A: 'HDD', B: 'SSD', C: 'Glacier', D: 'Tape' },
    answer: 'B',
    explanation: 'SSD is fast. *HDD (A)* is sequential. Option C is archival.',
  },
  {
    id: 'q2',
    number: 2,
    prompt: 'Which S3 class auto-moves tiers?',
    choices: { A: 'Standard', B: 'One Zone-IA', C: 'Intelligent-Tiering', D: 'Deep Archive' },
    answer: 'C',
    explanation: 'Intelligent-Tiering moves tiers. Why not A/B/D: fixed tiers.',
  },
  {
    id: 'q3',
    number: 3,
    prompt: 'Which service mounts via NFS?',
    choices: { A: 'EFS', B: 'EBS', C: 'S3', D: 'Glacier' },
    answer: 'A',
    explanation: 'EFS uses NFS. *B* is single-AZ block. Choice D is archival.',
  },
];

describe('quiz engine', () => {
  it('shuffleArray preserves every question exactly once', () => {
    const shuffled = shuffleArray(SAMPLE_QUESTIONS, () => 0.25);
    assert.equal(shuffled.length, SAMPLE_QUESTIONS.length);
    const origIds = SAMPLE_QUESTIONS.map((q) => q.id).sort();
    const shufIds = shuffled.map((q) => q.id).sort();
    assert.deepEqual(shufIds, origIds);
    // Does not mutate input
    assert.equal(SAMPLE_QUESTIONS[0].id, 'q1');
  });

  it('remaps explanation choice letters accurately without colliding or altering prose "A"', () => {
    const map = { A: 'B', B: 'C', C: 'D', D: 'A' };
    const text =
      'A company uses SSD. *HDD (A)* is wrong while Option B and Choice C fail. Why not A/D: A is incorrect, answer is B.';
    const remapped = remapExplanationLetters(text, map);
    assert.ok(remapped.startsWith('A company uses SSD.'), 'Must keep prose article "A" untouched');
    assert.ok(remapped.includes('*HDD (B)*'), `Expected (B), got: ${remapped}`);
    assert.ok(remapped.includes('Option C'), `Expected Option C, got: ${remapped}`);
    assert.ok(remapped.includes('Choice D'), `Expected Choice D, got: ${remapped}`);
    assert.ok(remapped.includes('Why not B/A:'), `Expected Why not B/A:, got: ${remapped}`);
    assert.ok(remapped.includes('B is incorrect'), `Expected B is incorrect, got: ${remapped}`);
    assert.ok(remapped.includes('answer is C'), `Expected answer is C, got: ${remapped}`);
  });

  it('prepareQuestion with shuffleChoices updates answer and explanation consistently', () => {
    // Deterministic rng that produces permutation
    let step = 0;
    const vals = [0.1, 0.7, 0.3];
    const rng = () => vals[step++ % vals.length];

    const prepared = prepareQuestion(SAMPLE_QUESTIONS[0], { shuffleChoices: true, rng });
    assert.deepEqual(Object.keys(prepared.choices).sort(), ['A', 'B', 'C', 'D']);
    // Correct choice text must still be 'SSD' at prepared.answer
    assert.equal(prepared.choices[prepared.answer], 'SSD');
    const newA = prepared.choiceMap.A;
    assert.ok(
      prepared.explanation.includes(`(${newA})`),
      `Expected remapped (${newA}) in "${prepared.explanation}"`
    );
  });

  it('scores practice mode with immediate feedback and loops retry-missed until CLEARED', () => {
    let session = createQuizSession(SAMPLE_QUESTIONS, {
      mode: 'practice',
      shuffleQuestions: false,
      shuffleChoices: false,
      now: () => 1000,
    });

    // Q1 wrong (pick A instead of B)
    let res = submitAnswer(session, 'A');
    assert.equal(res.feedback.isCorrect, false);
    assert.equal(res.feedback.correct, 'B');
    session = advanceQuiz(res.session, { now: () => 2000 });

    // Q2 right (pick C)
    res = submitAnswer(session, 'C');
    assert.equal(res.feedback.isCorrect, true);
    session = advanceQuiz(res.session, { now: () => 3000 });

    // Q3 wrong (pick D instead of A)
    res = submitAnswer(session, 'D');
    assert.equal(res.feedback.isCorrect, false);
    session = advanceQuiz(res.session, { now: () => 5000 });

    assert.equal(session.completed, true);
    const summary1 = getQuizSummary(session);
    assert.equal(summary1.correctCount, 1);
    assert.equal(summary1.wrongCount, 2);
    assert.equal(summary1.percentage, 33);
    assert.equal(summary1.cleared, false);
    assert.deepEqual(summary1.missedIds, ['q1', 'q3']);

    // Retry round 2 contains ONLY q1 and q3
    let retrySession = startRetryRound(session, SAMPLE_QUESTIONS, { now: () => 6000 });
    assert.equal(retrySession.round, 2);
    assert.deepEqual(
      retrySession.queue.map((q) => q.id),
      ['q1', 'q3']
    );

    // Answer both correctly
    retrySession = advanceQuiz(submitAnswer(retrySession, 'B').session, { now: () => 7000 });
    retrySession = advanceQuiz(submitAnswer(retrySession, 'A').session, { now: () => 8000 });

    const summary2 = getQuizSummary(retrySession);
    assert.equal(summary2.correctCount, 2);
    assert.equal(summary2.wrongCount, 0);
    assert.equal(summary2.cleared, true);

    // Next retry after 0 misses returns CLEARED empty queue
    const doneSession = startRetryRound(retrySession, SAMPLE_QUESTIONS, { now: () => 9000 });
    assert.equal(doneSession.cleared, true);
    assert.equal(doneSession.queue.length, 0);
  });

  it('exam mode hides feedback until completion and handles timeout cleanly', () => {
    let session = createQuizSession(SAMPLE_QUESTIONS, {
      mode: 'exam',
      shuffleQuestions: false,
      timerMinutes: 3,
      now: () => 1000,
    });
    assert.equal(session.timerSeconds, 180);

    const r1 = submitAnswer(session, 'B');
    assert.equal(r1.feedback, null, 'Exam mode must return null feedback');
    assert.equal(r1.session.index, 1, 'Exam mode auto-advances');

    // Simulate timeout with 2 unanswered questions remaining
    const timedOut = finishQuizByTimeout(r1.session, { now: () => 181000 });
    assert.equal(timedOut.completed, true);
    const summary = getQuizSummary(timedOut);
    assert.equal(summary.total, 3);
    assert.equal(summary.correctCount, 1);
    assert.equal(summary.wrongCount, 2);
    assert.equal(summary.elapsedSeconds, 180);
  });
});

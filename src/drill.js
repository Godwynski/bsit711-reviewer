/**
 * Pure Look-Alike Drill engine (flip cards with "got it" / "again" retry loop).
 */

export function buildDrillDeck(lookAlikes = []) {
  const cards = [];
  let idx = 0;
  for (const group of lookAlikes) {
    for (const item of group.items) {
      idx++;
      cards.push({
        id: `card-${idx}`,
        group: group.group,
        trap: group.trap || '',
        term: item.term,
        what: item.what,
        difference: item.difference,
        clues: item.clues || item.what,
      });
    }
  }
  return cards;
}

export function createDrillSession(cards) {
  return {
    round: 1,
    queue: [...cards],
    index: 0,
    flipped: false,
    againIds: [],
    gotItIds: [],
    completed: cards.length === 0,
    cleared: cards.length === 0,
  };
}

export function flipDrillCard(session) {
  if (session.completed) return session;
  return { ...session, flipped: !session.flipped };
}

export function gradeDrillCard(session, knewIt) {
  if (session.completed || session.index >= session.queue.length) return session;
  const current = session.queue[session.index];
  const againIds = knewIt ? session.againIds : [...session.againIds, current.id];
  const gotItIds = knewIt ? [...session.gotItIds, current.id] : session.gotItIds;
  const nextIndex = session.index + 1;
  const completed = nextIndex >= session.queue.length;
  return {
    ...session,
    againIds,
    gotItIds,
    index: nextIndex,
    flipped: false,
    completed,
    cleared: completed && againIds.length === 0,
  };
}

export function nextDrillRound(session) {
  const againSet = new Set(session.againIds);
  const nextQueue = session.queue.filter((c) => againSet.has(c.id));
  if (nextQueue.length === 0) {
    return {
      ...session,
      queue: [],
      index: 0,
      flipped: false,
      againIds: [],
      completed: true,
      cleared: true,
    };
  }
  return {
    round: session.round + 1,
    queue: nextQueue,
    index: 0,
    flipped: false,
    againIds: [],
    gotItIds: [],
    completed: false,
    cleared: false,
  };
}

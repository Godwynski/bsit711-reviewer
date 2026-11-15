import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.js';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}

function createThrowingStorage() {
  return {
    getItem() {
      throw new Error('SecurityError: storage blocked');
    },
    setItem() {
      throw new Error('QuotaExceededError: storage blocked');
    },
    removeItem() {
      throw new Error('SecurityError: storage blocked');
    },
  };
}

describe('store', () => {
  it('persists theme, quiz results, weak spots, and resets cleanly', () => {
    const storage = createMemoryStorage();
    const store = createStore(storage);

    assert.equal(store.getTheme(), 'dark');
    store.setTheme('crt');
    assert.equal(store.getTheme(), 'crt');

    store.recordQuizResult('network/storage', {
      score: 18,
      total: 22,
      missedIds: ['network-storage-q3', 'network-storage-q7'],
      clearedIds: [],
    });

    const p1 = store.getHandoutProgress('network/storage');
    assert.equal(p1.bestScore, 18);
    assert.equal(p1.lastScore, 18);
    assert.deepEqual(p1.missedIds, ['network-storage-q3', 'network-storage-q7']);

    // Retry clears q3, keeps q7, and new flag adds q10
    store.recordQuizResult('network/storage', {
      score: 1,
      total: 2,
      missedIds: ['network-storage-q7'],
      clearedIds: ['network-storage-q3'],
    });
    const p2 = store.getHandoutProgress('network/storage');
    assert.equal(p2.bestScore, 18, 'Lower retry round score must not overwrite bestScore');
    assert.deepEqual(p2.missedIds, ['network-storage-q7']);

    assert.equal(store.toggleFlag('network/storage', 'network-storage-q10'), true);
    const weak = store.getAllWeakSpots();
    assert.equal(weak.length, 1);
    assert.deepEqual(weak[0].combinedIds.sort(), ['network-storage-q10', 'network-storage-q7']);

    // Recreate store from same storage to confirm persistence
    const store2 = createStore(storage);
    assert.equal(store2.getTheme(), 'crt');
    assert.equal(store2.getHandoutProgress('network/storage').bestScore, 18);

    // Reset clears everything
    store2.resetAll();
    assert.equal(store2.getTheme(), 'dark');
    assert.equal(store2.getAllWeakSpots().length, 0);
    assert.equal(store2.getHandoutProgress('network/storage').bestScore, null);
  });

  it('continues working in memory when localStorage throws', () => {
    const store = createStore(createThrowingStorage());

    assert.equal(store.getTheme(), 'dark');
    assert.doesNotThrow(() => store.setTheme('amber'));
    assert.equal(store.getTheme(), 'amber');

    assert.doesNotThrow(() =>
      store.recordQuizResult('itsm/economics-1', {
        score: 10,
        total: 22,
        missedIds: ['itsm-economics-1-q5'],
        clearedIds: [],
      })
    );
    assert.deepEqual(store.getHandoutProgress('itsm/economics-1').missedIds, ['itsm-economics-1-q5']);

    assert.doesNotThrow(() => store.toggleFlag('itsm/economics-1', 'itsm-economics-1-q2'));
    assert.equal(store.getAllWeakSpots()[0].combinedIds.length, 2);

    assert.doesNotThrow(() => store.resetAll());
    assert.equal(store.getTheme(), 'dark');
    assert.equal(store.getAllWeakSpots().length, 0);
  });

  it('rejects invalid theme values', () => {
    const store = createStore(createMemoryStorage());
    assert.throws(() => store.setTheme('neon-pink'), /Invalid theme/i);
  });
});

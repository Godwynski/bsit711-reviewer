import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, getPageTitle } from '../src/router.js';

const MOCK_MANIFEST = {
  handouts: [
    { subject: 'network', handout: 'storage', title: 'Storage' },
    { subject: 'graphics', handout: 'scene-graph', title: 'Scene Graph Framework' },
  ],
};

describe('router', () => {
  it('parses home, weak, settings, handout, and 404 routes', () => {
    assert.deepEqual(parseHash('', MOCK_MANIFEST), { view: 'home' });
    assert.deepEqual(parseHash('#/', MOCK_MANIFEST), { view: 'home' });
    assert.deepEqual(parseHash('#/weak', MOCK_MANIFEST), { view: 'weak' });
    assert.deepEqual(parseHash('#/settings', MOCK_MANIFEST), { view: 'settings' });

    assert.deepEqual(parseHash('#/network/storage', MOCK_MANIFEST), {
      view: 'handout',
      subject: 'network',
      handout: 'storage',
      tab: 'reviewer',
    });
    assert.deepEqual(parseHash('#/network/storage/quiz', MOCK_MANIFEST), {
      view: 'handout',
      subject: 'network',
      handout: 'storage',
      tab: 'quiz',
    });

    assert.deepEqual(parseHash('#/404', MOCK_MANIFEST), { view: '404', path: '/404' });
    assert.deepEqual(parseHash('#/nope', MOCK_MANIFEST), { view: '404', path: '/nope' });
    assert.deepEqual(parseHash('#/network/missing/quiz', MOCK_MANIFEST), {
      view: '404',
      path: '/network/missing/quiz',
    });
    assert.deepEqual(parseHash('#/network/storage/badtab', MOCK_MANIFEST), {
      view: '404',
      path: '/network/storage/badtab',
    });
  });

  it('generates distinct page titles per view', () => {
    assert.equal(getPageTitle({ view: 'home' }), 'BSIT-711 // Pre-Finals Reviewer');
    assert.equal(getPageTitle({ view: 'weak' }), 'Weak Spots | BSIT-711');
    assert.equal(getPageTitle({ view: 'settings' }), 'Settings | BSIT-711');
    assert.equal(getPageTitle({ view: '404', path: '/nope' }), '404 Not Found | BSIT-711');
    assert.equal(
      getPageTitle(
        { view: 'handout', subject: 'network', handout: 'storage', tab: 'quiz' },
        { handoutTitle: 'Storage' }
      ),
      'Storage (Quiz) | BSIT-711'
    );
    assert.equal(
      getPageTitle({ view: 'handout', subject: 'network', handout: 'storage', tab: 'pdf' }),
      'storage (PDF) | BSIT-711'
    );
  });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mdInline } from '../src/text.js';
test('renders bold, italic, code', () => {
  assert.equal(mdInline('**B** and *HDD (A)* use `io1`'), '<strong>B</strong> and <em>HDD (A)</em> use <code>io1</code>');
});
test('escapes html before formatting', () => {
  assert.equal(mdInline('<img onerror=x> *a*'), '&lt;img onerror=x&gt; <em>a</em>');
});
test('handles empty/nullish input', () => {
  assert.equal(mdInline(undefined), '');
  assert.equal(mdInline('plain'), 'plain');
});

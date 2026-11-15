import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseReviewer } from '../scripts/parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '..', 'content');

function getAllContentMarkdownFiles() {
  const files = [];
  for (const subject of fs.readdirSync(CONTENT_DIR)) {
    const subPath = path.join(CONTENT_DIR, subject);
    if (!fs.statSync(subPath).isDirectory()) continue;
    for (const handout of fs.readdirSync(subPath)) {
      const hPath = path.join(subPath, handout);
      if (!fs.statSync(hPath).isDirectory()) continue;
      for (const file of fs.readdirSync(hPath)) {
        if (file.endsWith('.md')) {
          files.push({
            label: `${subject}/${handout}/${file}`,
            idPrefix: `${subject}-${handout}`,
            fullPath: path.join(hPath, file),
          });
        }
      }
    }
  }
  return files;
}

describe('parseReviewer', () => {
  it('parses all 8 real synced reviewers cleanly with valid questions, terms, and look-alikes', () => {
    const files = getAllContentMarkdownFiles();
    assert.equal(files.length, 8, `Expected 8 reviewer files in content/, found ${files.length}`);

    let totalQuestions = 0;
    for (const f of files) {
      const md = fs.readFileSync(f.fullPath, 'utf8');
      const parsed = parseReviewer(md, f.label, f.idPrefix);

      assert.ok(parsed.terms.length > 0, `${f.label} should have key terms`);
      assert.ok(parsed.lookAlikes.length > 0, `${f.label} should have look-alike groups`);
      assert.ok(parsed.questions.length >= 20, `${f.label} should have >=20 questions`);
      assert.ok(parsed.cramItems.length > 0, `${f.label} should have cram items`);
      assert.ok(parsed.bodyMarkdown.length > 0, `${f.label} should have bodyMarkdown`);
      assert.ok(!parsed.bodyMarkdown.includes('## Answer Key'), `${f.label} bodyMarkdown must exclude Answer Key`);

      for (const q of parsed.questions) {
        assert.deepEqual(
          Object.keys(q.choices).sort(),
          ['A', 'B', 'C', 'D'],
          `${f.label} Q${q.number} must have 4 choices A-D`
        );
        assert.match(q.answer, /^[A-D]$/, `${f.label} Q${q.number} answer must be A-D`);
        assert.ok(q.explanation.length > 10, `${f.label} Q${q.number} must have explanation`);
      }
      totalQuestions += parsed.questions.length;
    }
    assert.ok(totalQuestions >= 160, `Expected >=160 total questions, got ${totalQuestions}`);
  });

  it('throws on empty or malformed markdown input', () => {
    assert.throws(() => parseReviewer('', 'empty.md'), /Empty markdown/i);
    assert.throws(() => parseReviewer('# Only Title', 'missing.md'), /Missing section/i);
  });

  it('throws when a question does not have exactly 4 choices', () => {
    const badMd = `
# Sample
## 1. Key Terms
| Term | Short definition | Memory hook |
| :--- | :--- | :--- |
| **Foo** | Bar | Baz |

## 2. Look-Alike / Confusing Terms
### Group 1: A vs B
| Term | What it is | Key difference | Clue words |
| :--- | :--- | :--- | :--- |
| **A** | alpha | first | a |

## 5. Situational Practice Questions
1. Question one?
   A. Choice A
   B. Choice B
   C. Choice C

## Answer Key
1. **A. Choice A** — Because A is right.
`;
    assert.throws(() => parseReviewer(badMd, 'bad-choices.md'), /invalid choices/i);
  });

  it('throws when question count does not match answer key count', () => {
    const mismatchMd = `
# Sample
## 1. Key Terms
| Term | Short definition | Memory hook |
| :--- | :--- | :--- |
| **Foo** | Bar | Baz |

## 2. Look-Alike / Confusing Terms
### Group 1: A vs B
| Term | What it is | Key difference | Clue words |
| :--- | :--- | :--- | :--- |
| **A** | alpha | first | a |

## 5. Situational Practice Questions
1. Question one?
   A. Choice A
   B. Choice B
   C. Choice C
   D. Choice D

2. Question two?
   A. Choice A
   B. Choice B
   C. Choice C
   D. Choice D

## Answer Key
1. **A. Choice A** — Because A is right.
`;
    assert.throws(() => parseReviewer(mismatchMd, 'mismatch.md'), /does not match Answer Key count/i);
  });

  it('throws when answer key has an invalid letter', () => {
    const badLetterMd = `
# Sample
## 1. Key Terms
| Term | Short definition | Memory hook |
| :--- | :--- | :--- |
| **Foo** | Bar | Baz |

## 2. Look-Alike / Confusing Terms
### Group 1: A vs B
| Term | What it is | Key difference | Clue words |
| :--- | :--- | :--- | :--- |
| **A** | alpha | first | a |

## 5. Situational Practice Questions
1. Question one?
   A. Choice A
   B. Choice B
   C. Choice C
   D. Choice D

## Answer Key
1. **Z. Choice Z** — Invalid letter.
`;
    assert.throws(() => parseReviewer(badLetterMd, 'bad-letter.md'), /invalid letter/i);
  });
});

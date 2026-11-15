/**
 * Pure Markdown reviewer parser & validator.
 * Fails loudly if questions, choices, answer keys, key terms, or look-alikes are malformed.
 */

function normalizeText(raw) {
  return String(raw)
    .replace(/\r\n?/g, '\n')
    .replace(/â€”/g, '—')
    .replace(/â€“/g, '–')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"');
}

function stripOuterBold(text) {
  const trimmed = text.trim();
  const match = trimmed.match(/^\*\*(.+)\*\*$/s);
  if (match && !match[1].includes('**')) {
    return match[1].trim();
  }
  // Also handle cases where bold wraps the whole question prompt cleanly
  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
    const inner = trimmed.slice(2, -2);
    // Only strip if balanced (no unescaped '**' inside closing early)
    let depth = 0;
    let balanced = true;
    for (let i = 0; i < inner.length - 1; i++) {
      if (inner[i] === '*' && inner[i + 1] === '*') {
        depth = depth === 0 ? 1 : 0;
        i++;
      }
    }
    if (balanced && depth === 0) return inner.trim();
  }
  return trimmed;
}

function stripInlineMarkdown(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function splitTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null;
  const inner = trimmed.slice(1, -1);
  return inner.split('|').map((cell) => cell.trim());
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function parseMarkdownTable(lines) {
  const rows = [];
  let headerSeen = false;
  let sepSeen = false;
  for (const line of lines) {
    const cells = splitTableRow(line);
    if (!cells) {
      if (headerSeen && sepSeen && rows.length > 0) break;
      continue;
    }
    if (!headerSeen) {
      headerSeen = true;
      continue;
    }
    if (!sepSeen && isSeparatorRow(cells)) {
      sepSeen = true;
      continue;
    }
    rows.push(cells);
  }
  return rows;
}

function parseKeyTerms(sectionLines, sourceName) {
  const rows = parseMarkdownTable(sectionLines);
  const terms = rows
    .filter((cells) => cells.length >= 2)
    .map((cells) => ({
      term: stripInlineMarkdown(cells[0]),
      definition: cells[1],
      hook: cells[2] || '',
    }))
    .filter((t) => t.term.length > 0 && t.definition.length > 0);

  if (terms.length === 0) {
    throw new Error(`[${sourceName}] Section 1 (Key Terms) produced 0 terms`);
  }
  return terms;
}

function parseLookAlikes(sectionLines, sourceName) {
  const groups = [];
  let currentGroup = null;

  const flushGroup = () => {
    if (!currentGroup) return;
    const rows = parseMarkdownTable(currentGroup.lines);
    const items = rows
      .filter((cells) => cells.length >= 3)
      .map((cells) => ({
        term: stripInlineMarkdown(cells[0]),
        what: cells[1],
        difference: cells[2],
        clues: cells[3] || '',
      }))
      .filter((item) => item.term.length > 0);

    if (items.length === 0) {
      throw new Error(`[${sourceName}] Look-alike group "${currentGroup.title}" has no table rows`);
    }

    groups.push({
      group: currentGroup.title,
      trap: currentGroup.trap,
      items,
    });
    currentGroup = null;
  };

  for (const line of sectionLines) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      flushGroup();
      currentGroup = {
        title: heading[1].trim(),
        trap: '',
        lines: [],
      };
      continue;
    }
    if (!currentGroup) continue;
    const trapMatch = line.match(/^>\s*\*\*Trap[^*]*\*\*:?\s*(.+)$/i);
    if (trapMatch) {
      currentGroup.trap = trapMatch[1].trim();
    } else {
      currentGroup.lines.push(line);
    }
  }
  flushGroup();

  if (groups.length === 0) {
    throw new Error(`[${sourceName}] Section 2 (Look-Alikes) produced 0 groups`);
  }
  return groups;
}

function parseQuestionsSection(sectionLines, sourceName) {
  const questions = [];
  let current = null;

  const finalizeQuestion = () => {
    if (!current) return;
    const letters = Object.keys(current.choices).sort();
    if (letters.join('') !== 'ABCD') {
      throw new Error(
        `[${sourceName}] Question ${current.number} has invalid choices [${letters.join(', ')}]; expected A, B, C, D`
      );
    }
    for (const l of letters) {
      if (!current.choices[l]) {
        throw new Error(`[${sourceName}] Question ${current.number} choice ${l} is empty`);
      }
    }
    questions.push(current);
    current = null;
  };

  for (const rawLine of sectionLines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed === '---') continue;

    const qMatch = trimmed.match(/^(?:\*\*)?(\d+)\.(?:\*\*)?\s+(.+)$/);
    if (qMatch) {
      finalizeQuestion();
      const num = Number(qMatch[1]);
      const prompt = stripOuterBold(qMatch[2]);
      if (!prompt) {
        throw new Error(`[${sourceName}] Question ${num} has an empty prompt`);
      }
      current = {
        number: num,
        prompt,
        choices: {},
      };
      continue;
    }

    const cMatch = trimmed.match(/^(?:-\s*)?([A-Za-z])[.)]\s+(.+)$/);
    if (cMatch && current) {
      const letter = cMatch[1].toUpperCase();
      if (!['A', 'B', 'C', 'D'].includes(letter)) {
        throw new Error(
          `[${sourceName}] Question ${current.number} has invalid choice letter "${letter}"`
        );
      }
      if (current.choices[letter]) {
        throw new Error(
          `[${sourceName}] Question ${current.number} has duplicate choice "${letter}"`
        );
      }
      current.choices[letter] = cMatch[2].trim();
      continue;
    }

    throw new Error(`[${sourceName}] Unexpected line in Section 5: "${trimmed}"`);
  }
  finalizeQuestion();

  if (questions.length === 0) {
    throw new Error(`[${sourceName}] Section 5 (Situational Practice Questions) produced 0 questions`);
  }

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].number !== i + 1) {
      throw new Error(
        `[${sourceName}] Expected question ${i + 1}, got ${questions[i].number}`
      );
    }
  }

  return questions;
}

function parseAnswerKeySection(sectionLines, sourceName) {
  const answers = [];

  for (const rawLine of sectionLines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed === '---') continue;

    const match = trimmed.match(/^(\d+)\.\s+\*\*([A-Za-z])([^*]*)\*\*\s*(?:[—–-]\s*)?(.*)$/);
    if (!match) {
      throw new Error(`[${sourceName}] Malformed Answer Key line: "${trimmed}"`);
    }

    const number = Number(match[1]);
    const letter = match[2].toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(letter)) {
      throw new Error(`[${sourceName}] Answer Key ${number} has invalid letter "${letter}"`);
    }

    const boldSuffix = match[3] ? match[3].trim() : '';
    // Validate separator after letter in boldSuffix if non-empty
    if (
      boldSuffix &&
      !/^[.)—–\-(]/.test(boldSuffix)
    ) {
      throw new Error(`[${sourceName}] Answer Key ${number} malformed answer token "${match[2]}${boldSuffix}"`);
    }

    const explanation = (match[4] || '').trim();
    if (!explanation) {
      throw new Error(`[${sourceName}] Answer Key ${number} is missing explanation`);
    }

    answers.push({
      number,
      answer: letter,
      answerLabel: boldSuffix.replace(/^[.)—–\-\s]+/, '').replace(/\.$/, '').trim(),
      explanation,
    });
  }

  if (answers.length === 0) {
    throw new Error(`[${sourceName}] Answer Key section produced 0 answers`);
  }

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].number !== i + 1) {
      throw new Error(
        `[${sourceName}] Expected Answer Key ${i + 1}, got ${answers[i].number}`
      );
    }
  }

  return answers;
}

function parseCramItems(sectionLines) {
  return sectionLines
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

export function parseReviewer(rawMarkdown, sourceName = 'reviewer.md', idPrefix = 'q') {
  if (typeof rawMarkdown !== 'string' || !rawMarkdown.trim()) {
    throw new Error(`[${sourceName}] Empty markdown input`);
  }

  const text = normalizeText(rawMarkdown);
  const lines = text.split('\n');

  let title = '';
  const sections = [];
  let currentSection = null;
  const preamble = [];

  for (const line of lines) {
    if (!title && line.startsWith('# ')) {
      title = line.slice(2).trim();
    }
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      if (currentSection) sections.push(currentSection);
      currentSection = { heading: h2[1].trim(), lines: [] };
    } else if (currentSection) {
      currentSection.lines.push(line);
    } else {
      preamble.push(line);
    }
  }
  if (currentSection) sections.push(currentSection);

  const findSection = (re) => sections.find((s) => re.test(s.heading));

  const sec1 = findSection(/^1\.\s*Key Terms/i);
  const sec2 = findSection(/^2\.\s*Look-Alike/i);
  const sec4 = findSection(/^4\.\s*Lists/i);
  const sec5 = findSection(/^5\.\s*Situational Practice Questions/i);
  const sec6 = findSection(/^6\.\s*Last-Minute Cram Sheet/i);
  const secAk = findSection(/^Answer Key/i);

  if (!sec1) throw new Error(`[${sourceName}] Missing section: ## 1. Key Terms`);
  if (!sec2) throw new Error(`[${sourceName}] Missing section: ## 2. Look-Alike`);
  if (!sec5) throw new Error(`[${sourceName}] Missing section: ## 5. Situational Practice Questions`);
  if (!secAk) throw new Error(`[${sourceName}] Missing section: ## Answer Key`);

  const terms = parseKeyTerms(sec1.lines, sourceName);
  const lookAlikes = parseLookAlikes(sec2.lines, sourceName);
  const rawQuestions = parseQuestionsSection(sec5.lines, sourceName);
  const rawAnswers = parseAnswerKeySection(secAk.lines, sourceName);

  if (rawQuestions.length !== rawAnswers.length) {
    throw new Error(
      `[${sourceName}] Question count (${rawQuestions.length}) does not match Answer Key count (${rawAnswers.length})`
    );
  }

  const questions = rawQuestions.map((q, idx) => {
    const a = rawAnswers[idx];
    if (q.number !== a.number) {
      throw new Error(
        `[${sourceName}] Question number ${q.number} does not match Answer Key ${a.number}`
      );
    }
    return {
      id: `${idPrefix}-q${q.number}`,
      number: q.number,
      prompt: q.prompt,
      choices: q.choices,
      answer: a.answer,
      explanation: a.explanation,
    };
  });

  const bodySections = sections.filter((s) => !/^Answer Key/i.test(s.heading));
  const bodyMarkdown = [
    ...preamble,
    ...bodySections.flatMap((s) => [`## ${s.heading}`, ...s.lines]),
  ]
    .join('\n')
    .trim();

  const answerKeyMarkdown = [`## ${secAk.heading}`, ...secAk.lines].join('\n').trim();
  const listsMarkdown = sec4 ? [`## ${sec4.heading}`, ...sec4.lines].join('\n').trim() : '';
  const cramMarkdown = sec6 ? [`## ${sec6.heading}`, ...sec6.lines].join('\n').trim() : '';
  const cramItems = sec6 ? parseCramItems(sec6.lines) : [];

  const toc = bodySections.map((s) => ({
    heading: s.heading,
    id: s.heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-'),
  }));

  return {
    title: title || sourceName,
    terms,
    lookAlikes,
    questions,
    cramItems,
    cramMarkdown,
    listsMarkdown,
    bodyMarkdown,
    answerKeyMarkdown,
    toc,
  };
}

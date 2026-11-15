import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parseReviewer } from './parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SUBJECT_META = {
  graphics: {
    order: 1,
    title: 'Computer Graphics Programming',
    short: 'Graphics',
    icon: 'cube',
    handouts: {
      'scene-graph': { order: 1, title: 'Scene Graph Framework' },
    },
  },
  gamedev: {
    order: 2,
    title: 'Game Development',
    short: 'GameDev',
    icon: 'gamepad',
    handouts: {
      gameplay: { order: 1, title: 'Gameplay' },
      levels: { order: 2, title: 'Levels' },
    },
  },
  infosec: {
    order: 3,
    title: 'Information Assurance & Security',
    short: 'InfoSec',
    icon: 'lock',
    handouts: {
      'cloud-threats': { order: 1, title: 'Cloud Computing Threats & Countermeasures' },
    },
  },
  itsm: {
    order: 4,
    title: 'IT Service Management',
    short: 'ITSM',
    icon: 'flow',
    handouts: {
      'economics-1': { order: 1, title: 'Service Systems Economics I' },
      'economics-2': { order: 2, title: 'Service Systems Economics II' },
    },
  },
  network: {
    order: 5,
    title: 'Network Technology 2',
    short: 'Network 2',
    icon: 'nodes',
    handouts: {
      compute: { order: 1, title: 'Compute' },
      storage: { order: 2, title: 'Storage' },
    },
  },
};

function humanizeSlug(slug) {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
}

function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * Generates a crisp terminal-themed PNG image (pure Node zlib, zero external deps).
 */
function createTerminalPng(width, height, drawFn) {
  const raw = Buffer.alloc(height * (1 + width * 4));
  const setPx = (x, y, r, g, b, a = 255) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * (1 + width * 4) + 1 + x * 4;
    raw[idx] = r;
    raw[idx + 1] = g;
    raw[idx + 2] = b;
    raw[idx + 3] = a;
  };
  const fillRect = (rx, ry, rw, rh, r, g, b, a = 255) => {
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) setPx(x, y, r, g, b, a);
    }
  };
  drawFn({ width, height, setPx, fillRect });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function generateOgPng() {
  return createTerminalPng(1200, 630, ({ width, height, fillRect }) => {
    fillRect(0, 0, width, height, 11, 13, 16); // --bg #0B0D10
    fillRect(48, 48, width - 96, height - 96, 18, 21, 26); // --panel #12151A
    // Accent border frame
    fillRect(48, 48, width - 96, 4, 122, 229, 130);
    fillRect(48, height - 52, width - 96, 4, 42, 47, 56);
    fillRect(48, 48, 4, height - 96, 42, 47, 56);
    fillRect(width - 52, 48, 4, height - 96, 42, 47, 56);
    // Terminal prompt bars & status stripes
    fillRect(96, 140, 240, 22, 122, 229, 130);
    fillRect(96, 200, 680, 36, 216, 222, 233);
    fillRect(96, 265, 520, 20, 107, 115, 133);
    fillRect(96, 330, 820, 14, 42, 47, 56);
    fillRect(96, 366, 760, 14, 42, 47, 56);
    fillRect(96, 402, 640, 14, 42, 47, 56);
    fillRect(96, 480, 360, 44, 122, 229, 130);
  });
}

function generateAppIconPng(size) {
  return createTerminalPng(size, size, ({ fillRect }) => {
    fillRect(0, 0, size, size, 11, 13, 16);
    const pad = Math.floor(size * 0.12);
    const border = Math.max(2, Math.floor(size * 0.04));
    fillRect(pad, pad, size - pad * 2, border, 122, 229, 130);
    fillRect(pad, size - pad - border, size - pad * 2, border, 122, 229, 130);
    fillRect(pad, pad, border, size - pad * 2, 122, 229, 130);
    fillRect(size - pad - border, pad, border, size - pad * 2, 122, 229, 130);
    // '>' prompt and '_' cursor inside icon
    const s = Math.floor(size * 0.06);
    const ox = Math.floor(size * 0.28);
    const oy = Math.floor(size * 0.34);
    fillRect(ox, oy, s * 2, s, 122, 229, 130);
    fillRect(ox + s, oy + s, s * 2, s, 122, 229, 130);
    fillRect(ox + s * 2, oy + s * 2, s * 2, s, 122, 229, 130);
    fillRect(ox + s, oy + s * 3, s * 2, s, 122, 229, 130);
    fillRect(ox, oy + s * 4, s * 2, s, 122, 229, 130);
    fillRect(Math.floor(size * 0.54), oy + s * 4, Math.floor(size * 0.2), s, 122, 229, 130);
  });
}

export function buildSite(rootDir = ROOT) {
  const contentDir = path.join(rootDir, 'content');
  const srcDir = path.join(rootDir, 'src');
  const distDir = path.join(rootDir, 'dist');

  if (!fs.existsSync(contentDir)) {
    throw new Error(`content/ directory missing at ${contentDir}. Run "npm run sync" first.`);
  }

  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  // Copy src/ files to dist/
  copyDirRecursive(srcDir, distDir);

  const subjectDirs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => {
      const oa = SUBJECT_META[a]?.order ?? 99;
      const ob = SUBJECT_META[b]?.order ?? 99;
      return oa - ob || a.localeCompare(b);
    });

  const subjects = [];
  const flatHandouts = [];
  const searchIndex = [];
  const precacheUrls = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/router.js',
    '/quiz.js',
    '/drill.js',
    '/search.js',
    '/store.js',
    '/boot.js',
    '/manifest.json',
    '/search-index.json',
    '/app.webmanifest',
  ];

  let totalQuestions = 0;

  for (const subjectSlug of subjectDirs) {
    const sMeta = SUBJECT_META[subjectSlug] || {
      order: 99,
      title: humanizeSlug(subjectSlug),
      short: humanizeSlug(subjectSlug),
      icon: 'cube',
      handouts: {},
    };

    const subjectPath = path.join(contentDir, subjectSlug);
    const handoutDirs = fs
      .readdirSync(subjectPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort((a, b) => {
        const oa = sMeta.handouts[a]?.order ?? 99;
        const ob = sMeta.handouts[b]?.order ?? 99;
        return oa - ob || a.localeCompare(b);
      });

    const subjectHandouts = [];

    for (const handoutSlug of handoutDirs) {
      const hMeta = sMeta.handouts[handoutSlug] || {
        order: 99,
        title: humanizeSlug(handoutSlug),
      };

      const handoutDir = path.join(subjectPath, handoutSlug);
      const files = fs.readdirSync(handoutDir);
      const mdFile = files.find((f) => f.endsWith('.md'));
      const pdfFile = files.find((f) => f.endsWith('.pdf'));

      if (!mdFile) {
        throw new Error(`Missing reviewer .md file in ${subjectSlug}/${handoutSlug}`);
      }
      if (!pdfFile) {
        throw new Error(`Missing handout .pdf file in ${subjectSlug}/${handoutSlug}`);
      }

      const rawMd = fs.readFileSync(path.join(handoutDir, mdFile), 'utf8');
      const parsed = parseReviewer(
        rawMd,
        `${subjectSlug}/${handoutSlug}/${mdFile}`,
        `${subjectSlug}-${handoutSlug}`
      );

      // Copy raw files into dist/content/<subject>/<handout>/
      const distContentDir = path.join(distDir, 'content', subjectSlug, handoutSlug);
      fs.mkdirSync(distContentDir, { recursive: true });
      fs.copyFileSync(path.join(handoutDir, mdFile), path.join(distContentDir, mdFile));
      fs.copyFileSync(path.join(handoutDir, pdfFile), path.join(distContentDir, pdfFile));

      const dataRelPath = `data/${subjectSlug}/${handoutSlug}.json`;
      const pdfRelPath = `content/${subjectSlug}/${handoutSlug}/${pdfFile}`;
      const mdRelPath = `content/${subjectSlug}/${handoutSlug}/${mdFile}`;

      const handoutData = {
        subject: subjectSlug,
        subjectTitle: sMeta.title,
        subjectShort: sMeta.short,
        handout: handoutSlug,
        handoutTitle: hMeta.title,
        docTitle: parsed.title,
        pdfFile,
        pdfUrl: `/${pdfRelPath}`,
        mdUrl: `/${mdRelPath}`,
        dataUrl: `/${dataRelPath}`,
        questionCount: parsed.questions.length,
        termCount: parsed.terms.length,
        lookAlikeCount: parsed.lookAlikes.reduce((acc, g) => acc + g.items.length, 0),
        toc: parsed.toc,
        terms: parsed.terms,
        lookAlikes: parsed.lookAlikes,
        questions: parsed.questions,
        cramItems: parsed.cramItems,
        cramMarkdown: parsed.cramMarkdown,
        listsMarkdown: parsed.listsMarkdown,
        bodyMarkdown: parsed.bodyMarkdown,
        answerKeyMarkdown: parsed.answerKeyMarkdown,
      };

      const distDataPath = path.join(distDir, dataRelPath);
      fs.mkdirSync(path.dirname(distDataPath), { recursive: true });
      fs.writeFileSync(distDataPath, JSON.stringify(handoutData, null, 2));

      precacheUrls.push(`/${dataRelPath}`);
      totalQuestions += parsed.questions.length;

      const summary = {
        subject: subjectSlug,
        subjectTitle: sMeta.title,
        subjectShort: sMeta.short,
        handout: handoutSlug,
        title: hMeta.title,
        docTitle: parsed.title,
        questionCount: parsed.questions.length,
        termCount: parsed.terms.length,
        lookAlikeGroupCount: parsed.lookAlikes.length,
        dataUrl: `/${dataRelPath}`,
        pdfUrl: `/${pdfRelPath}`,
        pdfFile,
      };

      subjectHandouts.push(summary);
      flatHandouts.push(summary);

      // Search index entries: handout, terms, questions
      searchIndex.push({
        type: 'handout',
        title: `${sMeta.short} / ${hMeta.title}`,
        preview: `${parsed.questions.length} questions · ${parsed.terms.length} key terms`,
        subject: subjectSlug,
        handout: handoutSlug,
        tab: 'reviewer',
        route: `#/${subjectSlug}/${handoutSlug}/reviewer`,
      });

      for (const term of parsed.terms) {
        searchIndex.push({
          type: 'term',
          title: term.term,
          preview: term.definition,
          hook: term.hook,
          subject: subjectSlug,
          handout: handoutSlug,
          tab: 'reviewer',
          route: `#/${subjectSlug}/${handoutSlug}/reviewer`,
        });
      }

      for (const q of parsed.questions) {
        searchIndex.push({
          type: 'question',
          title: `Q${q.number}: ${q.prompt}`,
          preview: `${sMeta.short} / ${hMeta.title}`,
          subject: subjectSlug,
          handout: handoutSlug,
          questionNumber: q.number,
          tab: 'quiz',
          route: `#/${subjectSlug}/${handoutSlug}/quiz`,
        });
      }
    }

    subjects.push({
      slug: subjectSlug,
      title: sMeta.title,
      short: sMeta.short,
      icon: sMeta.icon,
      handouts: subjectHandouts,
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    handoutCount: flatHandouts.length,
    totalQuestions,
    subjects,
    handouts: flatHandouts,
  };

  fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(distDir, 'search-index.json'), JSON.stringify(searchIndex));

  // Robots.txt (F21: block search engines)
  fs.writeFileSync(path.join(distDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

  // OG & PWA icons
  fs.writeFileSync(path.join(distDir, 'og-image.png'), generateOgPng());
  fs.writeFileSync(path.join(distDir, 'icon-192.png'), generateAppIconPng(192));
  fs.writeFileSync(path.join(distDir, 'icon-512.png'), generateAppIconPng(512));

  // Web app manifest (PWA)
  const webManifest = {
    name: 'BSIT-711 Pre-Finals Reviewer',
    short_name: 'BSIT-711',
    description: 'Clean terminal reviewer, PDF viewer, and retry-missed quiz for BSIT-711 pre-finals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0D10',
    theme_color: '#0B0D10',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  fs.writeFileSync(path.join(distDir, 'app.webmanifest'), JSON.stringify(webManifest, null, 2));

  // Compute deterministic hash for sw.js
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ manifest, searchIndex }))
    .digest('hex')
    .slice(0, 12);

  const swPath = path.join(distDir, 'sw.js');
  if (fs.existsSync(swPath)) {
    let swSource = fs.readFileSync(swPath, 'utf8');
    swSource = swSource
      .replace('__CACHE_VERSION__', `bsit711-v1-${hash}`)
      .replace('__PRECACHE_URLS__', JSON.stringify(precacheUrls));
    fs.writeFileSync(swPath, swSource);
  }

  return { manifest, searchCount: searchIndex.length, cacheHash: hash };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = buildSite();
  console.log(
    `Built dist/: ${result.manifest.handoutCount} handouts, ${result.manifest.totalQuestions} questions, ${result.searchCount} search items (cache ${result.cacheHash})`
  );
}

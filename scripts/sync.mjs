import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SOURCE = 'C:/Users/Godwyn/Documents/Academics/BSIT-711/Reviewers/Pre-Finals';
const SOURCE_DIR = process.env.SYNC_SOURCE || DEFAULT_SOURCE;
const CONTENT_DIR = path.join(ROOT, 'content');

const SUBJECT_MAP = {
  'Computer Graphics Programming': 'graphics',
  'Game Development': 'gamedev',
  'Information Assurance and Security': 'infosec',
  'IT Service Management': 'itsm',
  'Network Technology 2': 'network',
};

const HANDOUT_SLUG_MAP = {
  Scene_Graph_Framework: 'scene-graph',
  Gameplay: 'gameplay',
  Levels: 'levels',
  Cloud_Computing_Threats_and_Countermeasures: 'cloud-threats',
  IT_Service_Systems_Economics_Part_I: 'economics-1',
  IT_Service_Systems_Economics_Part_II: 'economics-2',
  Compute: 'compute',
  Storage: 'storage',
};

function slugify(name) {
  if (HANDOUT_SLUG_MAP[name]) return HANDOUT_SLUG_MAP[name];
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function syncContent(sourceDir = SOURCE_DIR, contentDir = CONTENT_DIR) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Sync source not found: ${sourceDir}`);
  }

  fs.rmSync(contentDir, { recursive: true, force: true });
  fs.mkdirSync(contentDir, { recursive: true });

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
  const synced = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'Euthenics 2') continue;

    const subjectSlug = SUBJECT_MAP[entry.name] || slugify(entry.name);
    const subjectSrc = path.join(sourceDir, entry.name);
    const files = fs.readdirSync(subjectSrc);

    const mdFiles = files.filter((f) => /^Reviewer_(.+)\.md$/i.test(f));
    const pdfFiles = files.filter((f) => /\.pdf$/i.test(f));

    for (const mdFile of mdFiles) {
      const match = mdFile.match(/^Reviewer_(.+)\.md$/i);
      const rawName = match[1];
      const handoutSlug = slugify(rawName);
      const matchingPdf = pdfFiles.find((p) => p.toLowerCase().includes(rawName.toLowerCase()));

      if (!matchingPdf) {
        throw new Error(`No matching PDF found for ${entry.name}/${mdFile}`);
      }

      const destDir = path.join(contentDir, subjectSlug, handoutSlug);
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(path.join(subjectSrc, mdFile), path.join(destDir, mdFile));
      fs.copyFileSync(path.join(subjectSrc, matchingPdf), path.join(destDir, matchingPdf));

      synced.push({
        subject: subjectSlug,
        handout: handoutSlug,
        mdFile,
        pdfFile: matchingPdf,
      });
    }
  }

  return synced;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const synced = syncContent();
  console.log(`Synced ${synced.length} handouts into content/:`);
  for (const item of synced) {
    console.log(`  - ${item.subject}/${item.handout}: ${item.mdFile} + ${item.pdfFile}`);
  }
}

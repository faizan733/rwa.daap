import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const requiredFiles = [
  'src/app/App.jsx',
  'src/pages/marketplace/index.jsx',
  'src/pages/portfolio/index.jsx',
  'src/pages/compliance/index.jsx',
  'src/pages/presale/index.jsx',
  'src/pages/staking/index.jsx',
  'src/pages/swap/index.jsx',
  'src/shared/components/ui/ErrorBoundary.jsx',
  'public/favicon.svg',
  'Tasks.pdf',
];

for (const relativePath of requiredFiles) {
  const info = await stat(resolve(root, relativePath));
  assert(info.isFile(), `Required file is missing: ${relativePath}`);
}

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
assert.equal(packageJson.version, '3.0.0');
assert(!packageJson.dependencies.request, 'Deprecated request dependency must remain removed.');
assert(!packageJson.dependencies.axios, 'Unused axios dependency must remain removed.');

const appSource = await readFile(resolve(root, 'src/app/App.jsx'), 'utf8');
for (const route of ['/gallery', '/portfolio', '/compliance', '/presale', '/stake', '/swap']) {
  assert(appSource.includes(`path="${route}"`), `Required route is missing: ${route}`);
}

const gallerySource = await readFile(resolve(root, 'src/features/marketplace/GalleryItems.jsx'), 'utf8');
assert(gallerySource.includes('vaultx_watchlist'));
assert(gallerySource.includes('current.length >= 3'));

const complianceSource = await readFile(resolve(root, 'src/pages/compliance/index.jsx'), 'utf8');
assert(complianceSource.includes('vaultx_compliance_checklist'));
assert(complianceSource.includes('Manual review required'));

const pdf = await readFile(resolve(root, 'Tasks.pdf'));
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
assert(pdf.length > 50_000, 'Task PDF appears incomplete.');

console.log(`Verified ${requiredFiles.length} required artifacts, core routes, local-state controls, dependency cleanup, and task PDF.`);

// لوحات كتالوج الأساليب كصور: node scripts/gallery.mjs [outDir]  (الافتراضي ../deliverables/catalog)
// أو صورة لأسلوب واحد: node scripts/gallery.mjs <outDir> chat sketch bars-3d
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [outDir = '../deliverables/catalog', ...ids] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
try {
  const comps = await getCompositions(serveUrl, {port: 3124});
  const wanted = ids.length ? comps.filter((c) => ids.includes(c.id.replace(/^style-/, ''))) : comps.filter((c) => c.id.startsWith('Gallery-'));
  for (const c of wanted) {
    const frame = 70; // GALLERY_FRAME: most styles have finished entering by now
    await renderStill({serveUrl, composition: c, frame, output: path.join(outDir, `${c.id}.png`), scale: c.id.startsWith('style-') ? 0.5 : 1, port: 3124});
    console.log('wrote', c.id);
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

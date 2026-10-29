// Render review stills: node scripts/stills.mjs <composition> <outDir> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [compId, outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: compId, inputProps: {}, port: 3123});
try {
for (const f of frames) {
  await renderStill({
    serveUrl,
    composition,
    frame: Number(f),
    output: path.join(outDir, `f${f.padStart(5, '0')}.png`),
    scale: Number(process.env.SCALE ?? 0.3),
    port: 3123,
  });
  process.stdout.write(`${f} `);
}
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true}); // bundles copy public/ (~0.6 GB) each time
}
console.log('done');

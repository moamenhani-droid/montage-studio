// صور مراجعة بتجميع واحد: node scripts/stills.mjs <composition> <outDir> <frame> [frame...]
// SCALE=0.4 لتصغير الصور. يعمل على منفذ منفصل عن الاستوديو، وينظّف نسخة التجميع دائماً.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const [compId, outDir, ...frames] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
try {
  const composition = await selectComposition({serveUrl, id: compId, inputProps: {}, port: 3123});
  for (const f of frames.length ? frames : ['0']) {
    await renderStill({serveUrl, composition, frame: Number(f), output: path.join(outDir, `${compId}-f${f.padStart(5, '0')}.png`), scale: Number(process.env.SCALE ?? 0.3), port: 3123});
    process.stdout.write(`${f} `);
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true}); // bundles copy public/ each time
}
console.log('done');

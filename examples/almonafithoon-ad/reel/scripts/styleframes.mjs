// Render the phase-1 styleframes once from a single bundle: node scripts/styleframes.mjs <outDir>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
const all = ['SF0-DesignSystem', 'SF1-MatchCut', 'SF2-Problem', 'SF3-LogoBuild', 'SF4-Services', 'SF5-Process', 'SF6-Slogan'];
const ids = process.argv.slice(3).length ? process.argv.slice(3) : all;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id, inputProps: {}, port: 3125});
  await renderStill({serveUrl, composition, output: path.join(outDir, `${id}.png`), port: 3125});
  process.stdout.write(`${id} `);
}
fs.rmSync(serveUrl, {recursive: true, force: true});
console.log('done');

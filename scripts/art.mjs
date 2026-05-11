import { readdir, unlink, stat, writeFile, readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = fileURLToPath(new URL("../src/artwork/", import.meta.url));
const QUALITY = 80;

async function reencode(srcPath, outPath) {
  const input = await readFile(srcPath);
  const output = await sharp(input)
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  await writeFile(outPath, output);
  if (srcPath !== outPath) await unlink(srcPath);
  const { size } = await stat(outPath);
  return size;
}

const all = await readdir(dir);
const used = all
  .map((f) => /^(\d+)\.jpg$/i.exec(f))
  .filter(Boolean)
  .map((m) => Number(m[1]));
let next = (used.length ? Math.max(...used) : 0) + 1;

const incoming = all.filter(
  (f) => !/^\d+\./i.test(f) && /\.(jpe?g|png|webp)$/i.test(f),
);
for (const f of incoming) {
  const newName = `${next++}.jpg`;
  const size = await reencode(join(dir, f), join(dir, newName));
  console.log(`added ${f} -> ${newName} (${(size / 1024).toFixed(0)} KB)`);
}

const after = await readdir(dir);
const toMigrate = after.filter((f) => /^\d+\.(png|webp|jpeg)$/i.test(f));
for (const f of toMigrate) {
  const stem = basename(f, extname(f));
  const out = `${stem}.jpg`;
  const size = await reencode(join(dir, f), join(dir, out));
  console.log(`migrated ${f} -> ${out} (${(size / 1024).toFixed(0)} KB)`);
}

if (!incoming.length && !toMigrate.length) console.log("nothing to do");

#!/usr/bin/env node
// Fetches images from the existing WordPress site and saves them under public/img/.
// Run this from a Codespace (which has open internet access) or locally:
//   node scripts/fetch-images.mjs
//
// Edit the IMAGES list below to add or change which assets are pulled.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'public/img');

// Add more entries here as you discover assets you want to keep.
const IMAGES = [
  {
    url: 'https://northumberlandrcc.org.uk/wp-content/uploads/2021/05/Untitled-design.png',
    out: 'logo.png',
  },
];

async function fetchOne({ url, out }) {
  const target = resolve(OUT_DIR, out);
  process.stdout.write(`→ ${out} … `);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 northumberlandrcc-fetch' },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buf);
  console.log(`saved ${buf.byteLength} bytes`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const item of IMAGES) {
    try {
      await fetchOne(item);
    } catch (err) {
      console.error(`✖ ${item.out}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();

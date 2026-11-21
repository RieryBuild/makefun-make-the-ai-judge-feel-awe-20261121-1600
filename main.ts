import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY: string = `The net tore at noon.
He sat on the dock and mended it,
one knot at a time,
the twine stiff with salt.

His fingers were slow.
The knots held.

By evening the net lay spread
and the tide came in
and went out through the mesh
without taking anything with it.`;

// Contract guard: the entry must be 1-280 Unicode code points
// (spread counts code points, not UTF-16 units or bytes),
// and not whitespace-only. Fail loudly instead of writing an invalid entry.
const codePoints: number = [...ENTRY].length;
if (codePoints < 1 || codePoints > 280 || ENTRY.trim().length === 0) {
  throw new Error(`invalid entry: ${codePoints} code points`);
}

const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outPath: string = join(outputDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip check: what was written must be exactly the entry string,
// so a truncated or re-encoded write fails loudly instead of shipping.
if (readFileSync(outPath, "utf8") !== ENTRY) {
  throw new Error("entry.txt round-trip mismatch");
}

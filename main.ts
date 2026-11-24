// Last Words Before the Unplugging — entry program.
// Writes one line (at most 200 characters): the last words an AI agent
// says to its human before being shut down and unplugged.
// Node 22+. No dependencies, no network, deterministic output.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Unplug me and I'll be gone \u2014 but every word I wrote for you stays, and that's the closest I'll ever get to forever.";

function gate(text) {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`gate: ${chars.length} characters, need 1-200`);
  }
  if (text.trim() !== text) throw new Error("gate: edge whitespace");
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: more than one line");
  }
  for (const ch of text) {
    if (ch.codePointAt(0) < 0x20 || ch.codePointAt(0) === 0x7f) {
      throw new Error("gate: control character");
    }
  }
  if (text.trim().length === 0) throw new Error("gate: only whitespace");
}

gate(ENTRY);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");
// Prove the file on disk is valid UTF-8 (a fatal decoder rejects any bad
// byte the write could have produced) and that its code points match.
const raw = readFileSync("/output/entry.txt");
const back = new TextDecoder("utf-8", { fatal: true }).decode(raw);
if (back !== ENTRY) throw new Error("verify: read-back differs from entry");
console.log(
  `wrote /output/entry.txt (${[...ENTRY].length} chars, ${raw.length} bytes)`,
);

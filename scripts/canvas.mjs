// Corta os trechos do fundo do hero: P&B, sem som, 1280px, ~1–2 MB, com poster (primeiro quadro).
// Fonte: docs/canvas/originais/<arquivo>. Saída: public/canvas/<id>.mp4 + .jpg e src/data/canvas.json.
// Precisa do ffmpeg no PATH (ex.: `brew install ffmpeg`).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";

const url = (p) => new URL(`../${p}`, import.meta.url);
const { clips } = JSON.parse(readFileSync(url("docs/canvas/clips.json"), "utf8"));
mkdirSync(url("public/canvas/"), { recursive: true });

const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] });
const duracaoDe = (arq) => {
  try { execFileSync("ffmpeg", ["-hide_banner", "-i", arq], { stdio: "pipe" }); } catch (e) {
    const m = String(e.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/);
    if (m) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  }
  return 0;
};

const saida = [];
for (const c of clips) {
  const src = url(`docs/canvas/originais/${c.arquivo}`).pathname;
  const mp4 = url(`public/canvas/${c.id}.mp4`).pathname, jpg = url(`public/canvas/${c.id}.jpg`).pathname;
  if (!existsSync(src)) { console.log(`- ${c.id}: falta ${c.arquivo}`); continue; }
  const inicio = c.inicio ?? Math.round(duracaoDe(src) * 0.3);
  const vf = "scale=1280:-2:flags=lanczos,format=gray,eq=contrast=1.06";
  ff(["-ss", String(inicio), "-t", String(c.duracao ?? 8), "-i", src, "-an", "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4]);
  ff(["-ss", String(inicio), "-i", src, "-frames:v", "1", "-vf", vf, "-q:v", "5", jpg]);
  console.log(`✓ ${c.id} (${inicio}s, ${(statSync(mp4).size / 1e6).toFixed(1)} MB)`);
  saida.push({ id: c.id, src: `/canvas/${c.id}.mp4`, poster: `/canvas/${c.id}.jpg`, ...(c.release ? { release: c.release } : {}), ...(c.legenda ? { legenda: c.legenda } : {}) });
}
writeFileSync(url("src/data/canvas.json"), JSON.stringify(saida, null, 2) + "\n");
console.log(`${saida.length} trechos em src/data/canvas.json`);

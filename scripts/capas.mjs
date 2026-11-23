// Baixa as capas dos lançamentos pelo oEmbed público do Spotify para public/capas/<id>.jpg (640px).
// Roda à mão quando entrar lançamento novo: `npm run capas` e depois commit das imagens.
// O build não depende da rede: dados.mjs só liga a capa se o arquivo existir.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const releases = JSON.parse(readFileSync(new URL("../src/data/releases.json", import.meta.url), "utf8"));
const dir = new URL("../public/capas/", import.meta.url);
mkdirSync(dir, { recursive: true });
const forcar = process.argv.includes("--forcar");

// versão de 320px de cada capa (órbita e miniaturas), se houver ffmpeg
const temFfmpeg = (() => { try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); return true; } catch { return false; } })();
const miniatura = (id) => {
  const de = fileURLToPath(new URL(`${id}.jpg`, dir)), para = fileURLToPath(new URL(`${id}-320.jpg`, dir));
  if (!temFfmpeg || !existsSync(de) || (existsSync(para) && !forcar)) return;
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", de, "-vf", "scale=320:-2:flags=lanczos", "-q:v", "4", para]);
};

for (const r of releases) {
  const url = r.links?.spotify;
  const alvo = new URL(`${r.id}.jpg`, dir);
  if (!url) { console.log(`- ${r.titulo}: sem link do spotify`); continue; }
  if (existsSync(alvo) && !forcar) { miniatura(r.id); console.log(`= ${r.titulo}: já existe`); continue; }
  try {
    const o = await (await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`)).json();
    // i.scdn.co: troca o tamanho 300 (1e02) pelo 640 (b273) quando der
    const img = String(o.thumbnail_url).replace("ab67616d00001e02", "ab67616d0000b273");
    const res = await fetch(img);
    if (!res.ok) throw new Error(`imagem ${res.status}`);
    writeFileSync(alvo, Buffer.from(await res.arrayBuffer()));
    miniatura(r.id);
    console.log(`✓ ${r.titulo}`);
  } catch (e) {
    console.log(`✗ ${r.titulo}: ${e.message}`);
  }
}

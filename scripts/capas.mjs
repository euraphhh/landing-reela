// Baixa as capas dos lançamentos pelo oEmbed público do Spotify para public/capas/<id>.jpg (640px).
// Roda à mão quando entrar lançamento novo: `npm run capas` e depois commit das imagens.
// O build não depende da rede: dados.mjs só liga a capa se o arquivo existir.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const releases = JSON.parse(readFileSync(new URL("../src/data/releases.json", import.meta.url), "utf8"));
const dir = new URL("../public/capas/", import.meta.url);
mkdirSync(dir, { recursive: true });
const forcar = process.argv.includes("--forcar");

for (const r of releases) {
  const url = r.links?.spotify;
  const alvo = new URL(`${r.id}.jpg`, dir);
  if (!url) { console.log(`- ${r.titulo}: sem link do spotify`); continue; }
  if (existsSync(alvo) && !forcar) { console.log(`= ${r.titulo}: já existe`); continue; }
  try {
    const o = await (await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`)).json();
    // i.scdn.co: troca o tamanho 300 (1e02) pelo 640 (b273) quando der
    const img = String(o.thumbnail_url).replace("ab67616d00001e02", "ab67616d0000b273");
    const res = await fetch(img);
    if (!res.ok) throw new Error(`imagem ${res.status}`);
    writeFileSync(alvo, Buffer.from(await res.arrayBuffer()));
    console.log(`✓ ${r.titulo}`);
  } catch (e) {
    console.log(`✗ ${r.titulo}: ${e.message}`);
  }
}

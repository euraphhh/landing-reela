// Gera src/data/releases.json e src/data/artistas.json a partir de
// docs/dados/lancamentos.json (o levantamento do Spotify) + docs/dados/proximos.json.
// Regras:
// - só entra lançamento com liberado = true
// - versão "(Speed)" vira versão do original (mesmo título), não um card à parte
// - sem capa ainda: placeholder em cinza (a cor de cada release vem só da arte)
// - "REELA Music" e "Vários intérpretes" não contam como artista em "quem passou"
import { readFileSync, writeFileSync } from "node:fs";

const ler = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const { lancamentos } = ler("docs/dados/lancamentos.json");
const proximos = ler("docs/dados/proximos.json").map(({ _obs, ...r }) => r);

const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const NAO_ARTISTA = new Set(["REELA Music", "Vários intérpretes"]);
const CINZAS = [["#3a3a3a", "#0a0a0a"], ["#2b2b2b", "#080808"], ["#474747", "#0d0d0d"], ["#333333", "#060606"]];
const primeiroLink = (s) => (Array.isArray(s) ? s[0] : s);

const liberados = lancamentos.filter((l) => l.liberado);
const speed = /\s*\(speed\)\s*$/i;
const base = liberados.filter((l) => !speed.test(l.titulo));
const speeds = liberados.filter((l) => speed.test(l.titulo));

// mais novo primeiro; numeração do arquivo: A01 = o mais antigo
const ordenados = [...base].sort((a, b) => b.ano - a.ano); // sort estável: mantém a ordem do levantamento dentro do ano
const total = ordenados.length;

const releases = ordenados.map((l, i) => {
  const versoes = speeds
    .filter((s) => s.titulo.replace(speed, "").toLowerCase() === l.titulo.toLowerCase())
    .map((s) => ({ nome: "speed", spotify: primeiroLink(s.spotify) }));
  // sem artistas no levantamento: fica vazio (a linha some) em vez de inventar
  const artistas = (l.artistas ?? []).filter((a) => a !== "REELA Music").map((a) => (a === "Vários intérpretes" ? "vários artistas" : a));
  return {
    id: slug(l.titulo),
    num: `A${String(total - i).padStart(2, "0")}`,
    titulo: l.titulo,
    artistas: artistas.join(", "),
    quando: `${l.tipo.toLowerCase()} · ${l.ano}`,
    ano: String(l.ano),
    tipo: l.tipo,
    faixas: l.faixas,
    selo: l.selo,
    creditos: [],
    cor: CINZAS[i % CINZAS.length],
    links: { spotify: primeiroLink(l.spotify) },
    ...(versoes.length ? { versoes } : {}),
  };
});

// quem passou: quem aparece nos lançamentos liberados
const conta = new Map();
for (const l of liberados.filter((l) => !speed.test(l.titulo))) {
  for (const a of l.artistas ?? []) if (!NAO_ARTISTA.has(a)) conta.set(a, (conta.get(a) ?? 0) + 1);
}
const artistas = [...conta.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt"))
  .map(([nome, faixas]) => ({ nome, papel: "", faixas }));

writeFileSync(new URL("../src/data/releases.json", import.meta.url), JSON.stringify([...proximos, ...releases], null, 2) + "\n");
writeFileSync(new URL("../src/data/artistas.json", import.meta.url), JSON.stringify(artistas, null, 2) + "\n");
console.log(`${proximos.length} próximos + ${releases.length} lançamentos, ${artistas.length} artistas`);

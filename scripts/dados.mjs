// Gera src/data/releases.json e src/data/artistas.json a partir de:
// - docs/dados/lancamentos.json (o levantamento do Spotify)
// - docs/dados/creditos.json (quem fez beat/mix/master/arte, por título)
// - docs/dados/proximos.json (o que ainda não saiu)
// Regras:
// - só entra lançamento com liberado = true
// - versão "(Speed)" vira versão do original (mesmo título), não um card à parte
// - sem capa ainda: placeholder em cinza (a cor de cada release vem só da arte)
// - "REELA Music" não conta como artista; quem passou = artistas + créditos
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ler = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const { lancamentos } = ler("docs/dados/lancamentos.json");
const { _obs, ...creditos } = ler("docs/dados/creditos.json");
const proximos = ler("docs/dados/proximos.json").map(({ _obs, ...r }) => r);
const { _obs: _o2, ...pessoas } = ler("docs/dados/pessoas.json");

const slug = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const CINZAS = [["#3a3a3a", "#0a0a0a"], ["#2b2b2b", "#080808"], ["#474747", "#0d0d0d"], ["#333333", "#060606"]];
const PAPEIS = ["beat", "mix", "master", "arte"];
const primeiroLink = (s) => (Array.isArray(s) ? s[0] : s);
const lista = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs.at(-1)}`);

// "mix: raphh, Krys" + "master: raphh, Krys" → "mix e master: raphh, Krys"
function juntarCreditos(c = {}) {
  const grupos = new Map();
  for (const p of PAPEIS) {
    if (!c[p]?.length) continue;
    const chave = c[p].join("|");
    grupos.set(chave, [...(grupos.get(chave) ?? []), p]);
  }
  const gerais = [...grupos.entries()].map(([nomes, papeis]) => ({ papel: lista(papeis), nome: nomes.split("|").join(", ") }));
  // créditos por faixa (EP): "beat · VOO: Ninez"
  const porFaixa = (c.faixas ?? []).flatMap((f) =>
    PAPEIS.filter((p) => f[p]?.length).map((p) => ({ papel: `${p} · ${f.titulo}`, nome: f[p].join(", ") }))
  );
  return [...porFaixa, ...gerais];
}

const liberados = lancamentos.filter((l) => l.liberado);
const speed = /\s*\(speed\)\s*$/i;
const base = liberados.filter((l) => !speed.test(l.titulo));
const speeds = liberados.filter((l) => speed.test(l.titulo));
const ordenados = [...base].sort((a, b) => b.ano - a.ano); // estável: mantém a ordem do levantamento dentro do ano
const total = ordenados.length;

const artistasDe = (l) => {
  const c = creditos[l.titulo] ?? {};
  const a = c.artistas ?? l.artistas ?? [];
  return a.filter((x) => x !== "REELA Music").map((x) => (x === "Vários intérpretes" ? "vários artistas" : x));
};

const releases = ordenados.map((l, i) => {
  const versoes = speeds
    .filter((s) => s.titulo.replace(speed, "").toLowerCase() === l.titulo.toLowerCase())
    .map((s) => ({ nome: "speed", spotify: primeiroLink(s.spotify) }));
  return {
    id: slug(l.titulo),
    num: `A${String(total - i).padStart(2, "0")}`,
    titulo: l.titulo,
    artistas: artistasDe(l).join(", "),
    quando: `${l.tipo.toLowerCase()} · ${l.ano}`,
    ano: String(l.ano),
    tipo: l.tipo,
    faixas: l.faixas,
    selo: l.selo.replace(/\s*\(.*\)\s*$/, ""),
    creditos: juntarCreditos(creditos[l.titulo]),
    cor: CINZAS[i % CINZAS.length],
    // capa baixada por scripts/capas.mjs; sem ela, o placeholder
    ...(existsSync(new URL(`../public/capas/${slug(l.titulo)}.jpg`, import.meta.url)) ? { capa: `/capas/${slug(l.titulo)}.jpg` } : {}),
    links: { spotify: primeiroLink(l.spotify) },
    ...(versoes.length ? { versoes } : {}),
  };
});

// quem passou: cada pessoa, com os papéis que teve e em quantos lançamentos
// 1ª passada: quem canta em algum lançamento (artista ali sem ser o beatmaker, ou artista declarado nos créditos)
const cantores = new Set();
for (const l of base) {
  const c = creditos[l.titulo] ?? {};
  for (const n of artistasDe(l)) if (!(c.beat ?? []).includes(n) || (c.artistas ?? []).includes(n)) cantores.add(n);
}
cantores.add("T'H"); // canta no Rolê (Remix), além de produzir (raphh, 2026-11-23)
const gente = new Map();
const marcar = (nome, papel, titulo) => {
  if (["REELA Music", "Vários intérpretes", "vários artistas"].includes(nome)) return;
  const g = gente.get(nome) ?? { papeis: new Set(), titulos: new Set(), por: new Map() };
  g.papeis.add(papel); g.titulos.add(titulo);
  g.por.set(titulo, (g.por.get(titulo) ?? new Set()).add(papel));
  gente.set(nome, g);
};
for (const l of base) {
  const c = creditos[l.titulo] ?? {};
  for (const p of PAPEIS) for (const n of c[p] ?? []) marcar(n, p, l.titulo);
  for (const f of c.faixas ?? []) for (const p of PAPEIS) for (const n of f[p] ?? []) marcar(n, p, l.titulo);
  // aparece como artista sem ser o beatmaker da faixa → voz (ou se já canta em outro lançamento: ver abaixo)
  for (const n of artistasDe(l)) if (!(c.beat ?? []).includes(n) || (c.artistas ?? []).includes(n) || cantores.has(n)) marcar(n, "voz", l.titulo);
  for (const n of artistasDe(l)) gente.get(n)?.titulos.add(l.titulo);
}
const ORDEM = ["voz", ...PAPEIS];
const artistas = [...gente.entries()]
  .map(([nome, g]) => {
    const extra = pessoas[nome] ?? {};
    const links = Object.fromEntries(Object.entries(extra.links ?? {}).filter(([, v]) => v));
    return {
      nome,
      slug: slug(nome),
      papel: lista(ORDEM.filter((p) => g.papeis.has(p))),
      faixas: g.titulos.size,
      // o que fez em cada lançamento, na ordem do laço
      lancamentos: releases.filter((r) => g.titulos.has(r.titulo)).map((r) => ({ id: r.id, papel: lista(ORDEM.filter((p) => g.por.get(r.titulo)?.has(p))) })),
      ...(extra.pagina ? { pagina: true } : {}),
      ...(extra.foto ? { foto: extra.foto } : {}),
      ...(extra.bio ? { bio: extra.bio } : {}),
      ...(Object.keys(links).length ? { links } : {}),
    };
  })
  .sort((a, b) => b.faixas - a.faixas || a.nome.localeCompare(b.nome, "pt"));

writeFileSync(new URL("../src/data/releases.json", import.meta.url), JSON.stringify([...proximos, ...releases], null, 2) + "\n");
writeFileSync(new URL("../src/data/artistas.json", import.meta.url), JSON.stringify(artistas, null, 2) + "\n");
console.log(`${proximos.length} próximos + ${releases.length} lançamentos, ${artistas.length} pessoas`);

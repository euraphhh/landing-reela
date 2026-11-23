// Gera src/styles/tokens.css a partir de docs/marca/tokens.json.
// O JSON é a fonte; não edite o CSS à mão.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = new URL("../docs/marca/tokens.json", import.meta.url);
const out = new URL("../src/styles/tokens.css", import.meta.url);
const t = JSON.parse(readFileSync(src, "utf8"));

// id do tema no tokens.json → valor de data-tema no <html>
const TEMA = { dark: "madrugada", light: "papel" };
const [primeiro, ...outros] = t.color.themes.map((th) => th.id);

const alias = (v) => (typeof v === "string" ? v.replace(/^\{(.+)\}$/, "var(--$1)") : v);
const valor = (tok, tema) => {
  const v = tok.value;
  if (typeof v === "string") return tema === primeiro ? alias(v) : null; // fixo nos dois temas
  return v[tema] != null ? alias(v[tema]) : null;
};

const linhas = (tema) =>
  t.color.tokens
    .map((tok) => [tok.name, valor(tok, tema)])
    .filter(([, v]) => v != null)
    .map(([n, v]) => `  --${n}: ${v};`);

const tipo = t.type.groups.flatMap((g) =>
  g.styles.flatMap((s) => [
    `  --t-${s.name}-family: var(--f-${g.family === "display" ? "display" : "text"});`,
    `  --t-${s.name}-size: ${s.fontSize};`,
    `  --t-${s.name}-lh: ${s.lineHeight};`,
    `  --t-${s.name}-weight: ${s.fontWeight};`,
    ...(s.letterSpacing ? [`  --t-${s.name}-ls: ${s.letterSpacing};`] : []),
  ])
);
const fam = (k) => (k === "sans" ? "text" : k);
const familias = Object.entries(t.type.families).map(
  ([k, v]) => `  --f-${fam(k)}-fallback: ${v};`
);
const lista = (fam) => (t[fam]?.tokens ?? []).map((tok) => `  --${tok.name}: ${tok.value};`);

const css = `/* reela — gerado de docs/marca/tokens.json por scripts/tokens.mjs. não edite. */
:root,
html[data-tema="${TEMA[primeiro]}"] {
${linhas(primeiro).join("\n")}
  color-scheme: ${primeiro === "dark" ? "dark" : "light"};
}
${outros
  .map(
    (id) => `html[data-tema="${TEMA[id]}"] {
${linhas(id).join("\n")}
  color-scheme: ${id === "dark" ? "dark" : "light"};
}`
  )
  .join("\n")}
:root {
${familias.join("\n")}
${tipo.join("\n")}
${lista("spacing").join("\n")}
${lista("radius").join("\n")}
}
`;

mkdirSync(new URL("../src/styles/", import.meta.url), { recursive: true });
writeFileSync(out, css);
console.log("tokens.css gerado");

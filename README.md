# reelamusic.com

Vitrine da reela music. Next.js (App Router, export estático) + GSAP + Lenis. Deploy na Vercel.

## Comandos

| comando | o que faz |
|---|---|
| `npm run dev` | servidor local |
| `npm run build` | gera tokens e dados e exporta o site estático em `out/` |
| `npm run dados` | regenera `src/data/*.json` a partir de `docs/dados/` |
| `npm run capas` | baixa as capas do Spotify para `public/capas/` (rodar quando entrar lançamento novo e commitar as imagens) |
| `npm run tokens` | regenera `src/styles/tokens.css` a partir de `docs/marca/tokens.json` |

## Onde mexer

- **Lançamentos:** `docs/dados/lancamentos.json` (levantamento do Spotify; só entra `liberado: true`)
- **Créditos (beat, mix, master, arte):** `docs/dados/creditos.json`, por título. EP com créditos por faixa usa `faixas`.
- **Próximos lançamentos:** `docs/dados/proximos.json`
- **Prévia própria:** arquivo em `public/audio/` + campo `previa` (e `bpm`). Sem ela, a prévia é o player do Spotify no detalhe.
- **Links de streaming e e-mail:** `src/data/links.ts`. O selo "protótipo" sai com `MOSTRAR_SELO_PROTOTIPO = false`.
- **Marca:** `docs/marca/` (tokens, logos, fontes, README da marca).

## Regras de movimento

Dois momentos ligados ao scroll (manifesto e laço do fim), mais a bolinha de quem passou.
Curvas suaves, sem back/elastic/bounce, com uma exceção aprovada: a gota do toggle claro/escuro (elastic). Título do release no laço entra com blur (vindo do /lab). Com `prefers-reduced-motion`: sem Lenis, sem animação, nada escondido.
Todo GSAP dentro de `useGSAP({ scope })`; ScrollTrigger, Draggable, SplitText e Lenis limpos no unmount.

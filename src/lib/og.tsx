/**
 * Imagens de preview (Open Graph, 1200×630) geradas no build com next/og.
 * Fontes e capas lidas do disco; o layout segue a marca: preto, branco, cor só na capa.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
const raiz = process.cwd();

async function fontes() {
  const [unb, inter] = await Promise.all([
    readFile(join(raiz, "docs/marca/fonts/Unbounded-Light.woff")),
    readFile(join(raiz, "docs/marca/fonts/InterDisplay-Medium.otf")),
  ]);
  return [
    { name: "Unbounded", data: unb, weight: 300 as const, style: "normal" as const },
    { name: "Inter", data: inter, weight: 500 as const, style: "normal" as const },
  ];
}

/** /capas/x.jpg → data URI (o gerador não busca arquivos pela rede no build) */
export async function imagem(caminhoPublico?: string) {
  if (!caminhoPublico) return null;
  try {
    const buf = await readFile(join(raiz, "public", caminhoPublico));
    const tipo = caminhoPublico.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${tipo};base64,${buf.toString("base64")}`;
  } catch { return null; }
}

/** o símbolo (reela-symbol-white.svg, traço afinado) em branco */
function Simbolo({ tam }: { tam: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 100 100" fill="#fff">
      <path d="M50 0A50 50 0 1 0 100 50H87A37 37 0 1 1 50 13Z" />
      <path d="M48 0H75V13H48Z" />
      <path d="M31 50a19 19 0 1 0 38 0a19 19 0 1 0 -38 0Z" />
    </svg>
  );
}

function Lockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Simbolo tam={40} />
      <span style={{ fontFamily: "Unbounded", fontSize: 30, color: "#fff" }}>reela</span>
      <span style={{ fontFamily: "Unbounded", fontSize: 30, color: "#8A8A8A" }}>music</span>
    </div>
  );
}

type Card = {
  kick: string;
  titulo: string;
  linha?: string;
  /** data URI da imagem (capa ou foto); sem ela, o símbolo gigante cortado */
  img?: string | null;
  /** foto de pessoa: retrato, não quadrado */
  retrato?: boolean;
};

/** resposta PNG estática (as rotas og.png são geradas no build) */
export const OG_HEADERS = { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" };

export async function cardOG({ kick, titulo, linha, img, retrato }: Card) {
  const tam = titulo.length > 22 ? 64 : titulo.length > 14 ? 78 : 96;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#000", color: "#fff", padding: 64, gap: 56, fontFamily: "Inter", position: "relative", overflow: "hidden" }}>
        {img ? (
          <img src={img} width={retrato ? 430 : 502} height={502} style={{ objectFit: "cover", flexShrink: 0 }} />
        ) : (
          // sem imagem: o símbolo inteiro à direita. a abertura e a cauda ficam no quadrante superior direito,
          // então nada de cortar pela borda (pareceria anel fechado)
          <div style={{ position: "absolute", right: 72, top: 65, display: "flex" }}><Simbolo tam={500} /></div>
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <span style={{ fontSize: 22, color: "#A3A3A3", letterSpacing: 1 }}>{kick}</span>
            <span style={{ fontFamily: "Unbounded", fontSize: tam, lineHeight: 1.02, maxWidth: img ? 560 : 520 }}>{titulo}</span>
            {linha && <span style={{ fontSize: 26, color: "#A3A3A3", maxWidth: 560 }}>{linha}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Lockup />
            <span style={{ fontSize: 20, color: "#A3A3A3" }}>reelamusic.com</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fontes(), headers: OG_HEADERS }
  );
}

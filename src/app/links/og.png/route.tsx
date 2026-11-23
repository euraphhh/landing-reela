// /links/og.png: a bio mostra o mais novo, o preview também
import { RELEASES } from "@/data";
import { cardOG, imagem } from "@/lib/og";

export const dynamic = "force-static";

export async function GET() {
  const r = RELEASES[0];
  return cardOG({ kick: `reela music · o mais novo · ${r.quando}`, titulo: r.titulo, linha: r.artistas || undefined, img: await imagem(r.capa) });
}

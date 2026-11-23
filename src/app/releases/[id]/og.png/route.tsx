// /releases/<id>/og.png: preview do lançamento com a capa
import { RELEASES } from "@/data";
import { cardOG, imagem } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return RELEASES.map((r) => ({ id: r.id }));
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = RELEASES.find((x) => x.id === id)!;
  return cardOG({ kick: `${r.num} · ${r.quando}`, titulo: r.titulo, linha: r.artistas || undefined, img: await imagem(r.capa) });
}

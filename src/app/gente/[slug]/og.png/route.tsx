// /gente/<slug>/og.png: preview da pessoa com a foto
import { ARTISTAS } from "@/data";
import { cardOG, imagem } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTISTAS.filter((a) => a.pagina).map((a) => ({ slug: a.slug }));
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = ARTISTAS.find((x) => x.slug === slug)!;
  return cardOG({ kick: a.titulo ?? "quem passou pela reela", titulo: a.nome, linha: a.funcoes ?? a.papel, img: await imagem(a.foto), retrato: Boolean(a.foto) });
}

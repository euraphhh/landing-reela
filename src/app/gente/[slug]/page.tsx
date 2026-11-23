import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTISTAS, RELEASES } from "@/data";
import { PaginaPessoa } from "@/components/Pessoa/PaginaPessoa";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
const COM_PAGINA = ARTISTAS.filter((a) => a.pagina);

export function generateStaticParams() {
  return COM_PAGINA.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = COM_PAGINA.find((x) => x.slug === slug);
  if (!a) return {};
  const titulo = `${a.nome} · reela music`;
  const desc = `${a.papel}. ${a.faixas} ${a.faixas > 1 ? "lançamentos" : "lançamento"} com a reela.`;
  const capa = a.foto ?? RELEASES.find((r) => r.id === a.lancamentos[0]?.id)?.capa;
  return {
    title: titulo,
    description: desc,
    alternates: { canonical: `/gente/${a.slug}/` },
    openGraph: { title: titulo, description: desc, type: "profile", locale: "pt_BR", url: `/gente/${a.slug}/`, images: capa ? [{ url: capa, width: 640, height: 640 }] : undefined },
    twitter: { card: "summary", title: titulo, description: desc, images: capa ? [capa] : undefined },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const a = COM_PAGINA.find((x) => x.slug === slug);
  if (!a) notFound();
  return <PaginaPessoa a={a} />;
}

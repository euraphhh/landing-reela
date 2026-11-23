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
  return {
    title: titulo,
    description: desc,
    alternates: { canonical: `/people/${a.slug}/` },
    openGraph: { title: titulo, description: desc, type: "profile", locale: "pt_BR", url: `/people/${a.slug}/`, images: [{ url: `/people/${a.slug}/og.png`, width: 1200, height: 630, alt: a.nome }] },
    twitter: { card: "summary_large_image", title: titulo, description: desc, images: [`/people/${a.slug}/og.png`] },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const a = COM_PAGINA.find((x) => x.slug === slug);
  if (!a) notFound();
  return <PaginaPessoa a={a} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RELEASES } from "@/data";
import { PaginaRelease } from "@/components/Release/PaginaRelease";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return RELEASES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const r = RELEASES.find((x) => x.id === id);
  if (!r) return {};
  const titulo = `${r.titulo} · reela music`;
  const desc = [r.artistas, r.quando, r.selo ? `℗ ${r.selo}` : null].filter(Boolean).join(" · ");
  const imagens = r.capa ? [{ url: r.capa, width: 640, height: 640, alt: `capa de ${r.titulo}` }] : undefined;
  return {
    title: titulo,
    description: desc,
    alternates: { canonical: `/releases/${r.id}/` },
    openGraph: { title: titulo, description: desc, type: "music.album", locale: "pt_BR", url: `/releases/${r.id}/`, images: imagens },
    twitter: { card: "summary", title: titulo, description: desc, images: r.capa ? [r.capa] : undefined },
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const i = RELEASES.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  return <PaginaRelease i={i} />;
}

/**
 * /links: a página da bio (Instagram, TikTok). Uma coluna, feita pro celular:
 * o lançamento mais recente com o player, os caminhos principais e as redes.
 * Só aparecem links que existem (href diferente de "#").
 */
import type { Metadata } from "next";
import { RELEASES } from "@/data";
import { EMAIL_HREF, STREAMING } from "@/data/links";
import { Arte } from "@/components/Arte/Arte";
import { Parceiro } from "@/components/Parceiro/Parceiro";
import { Grao } from "@/components/Grao/Grao";
import { embed } from "@/components/Release/ReleaseInfo";
import { LacoTopo } from "@/components/Links/LacoTopo";
import s from "./links.module.css";

const ULTIMO = RELEASES[0];

export const metadata: Metadata = {
  title: "reela music · links",
  description: `selo de trap e r&b. o mais novo: ${ULTIMO.titulo}.`,
  alternates: { canonical: "/links/" },
  openGraph: { title: "reela music", description: `o mais novo: ${ULTIMO.titulo}.`, url: "/links/", images: [{ url: "/links/og.png", width: 1200, height: 630, alt: `o mais novo da reela: ${ULTIMO.titulo}` }] },
  twitter: { card: "summary_large_image", images: ["/links/og.png"] },
};

const real = (href?: string) => Boolean(href && href !== "#");

export default function Links() {
  const r = ULTIMO;
  const player = embed(r.links?.spotify);
  const caminhos = [
    { rot: "todos os lançamentos", href: "/#releases" },
    { rot: "como funciona", href: "/como-funciona/" },
    { rot: "quem passou por aqui", href: "/#gente" },
  ];
  const redes = STREAMING.filter((p) => real(p.href));

  return (
    <>
      <Grao />
      <main id="conteudo" className={s.pagina}>
        <header className={s.topo}>
          <LacoTopo className={s.sym} />
          <h1 className={s.nome}>reela<i>music</i></h1>
          <p className="t-caption">selo de trap e r&amp;b. de novo, até amanhecer.</p>
        </header>

        <section className={s.novo} aria-labelledby="l-novo">
          <a className={s.release} href={`/releases/${r.id}/`}>
            <Arte r={r} className={s.capa} />
            <span className={s.info}>
              <span className="t-credit">o mais novo · {r.quando}</span>
              <strong id="l-novo">{r.titulo}</strong>
              {r.artistas && <span className="t-caption">{r.artistas}</span>}
            </span>
          </a>
          {player && (
            <iframe className={s.player} title={`ouvir ${r.titulo} no spotify`} src={player} loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
          )}
        </section>

        <nav className={s.botoes} aria-label="caminhos">
          {r.links?.spotify && <a className={`${s.botao} ${s.cheio}`} href={r.links.spotify} target="_blank" rel="noopener noreferrer">ouvir {r.titulo} no spotify <span aria-hidden="true">↗</span></a>}
          <a className={s.botao} href={EMAIL_HREF}>mandar faixa <span aria-hidden="true">→</span></a>
          {caminhos.map((c) => (
            <a key={c.href} className={s.botao} href={c.href}>{c.rot} <span aria-hidden="true">→</span></a>
          ))}
        </nav>

        {redes.length > 0 && (
          <nav className={s.redes} aria-label="a reela nas plataformas">
            {redes.map((p) => (
              <a key={p.id} href={p.href} target="_blank" rel="noopener noreferrer">{p.nome}</a>
            ))}
          </nav>
        )}

        <footer className={s.rodape}>
          <Parceiro />
          <span className="t-credit">© {new Date().getFullYear()} reela music · <a href="/privacidade/" className="lnk-rodape">privacidade</a></span>
        </footer>
      </main>
    </>
  );
}

/**
 * Página de uma pessoa (/gente/<slug>/): quem é, o que faz, os links e cada lançamento com a reela
 * com o papel dela ali. Sem foto, o retrato é o mosaico das capas.
 */
import type { Artista } from "@/types";
import { RELEASES } from "@/data";
import { Casca, Rodape } from "@/components/Casca/Casca";
import { Arte } from "@/components/Arte/Arte";
import { LinkDividido } from "@/components/LinkDividido/LinkDividido";
import s from "./PaginaPessoa.module.css";

const REDES = [
  { id: "spotify", nome: "spotify" },
  { id: "instagram", nome: "instagram" },
  { id: "tiktok", nome: "tiktok" },
  { id: "youtube", nome: "youtube" },
] as const;

/** open.spotify.com/…/artist/<id> → player de artista (faixas populares) */
const embedArtista = (url?: string) => {
  const m = url?.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?artist\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/artist/${m[1]}?utm_source=generator&theme=0` : null;
};

export function PaginaPessoa({ a }: { a: Artista }) {
  const lancs = a.lancamentos
    .map((l) => ({ ...l, r: RELEASES.find((r) => r.id === l.id)! }))
    .filter((l) => l.r);
  const capas = lancs.map((l) => l.r).filter((r) => r.capa).slice(0, 9);
  const player = embedArtista(a.links?.spotify);
  const n = a.faixas;

  return (
    <Casca>
      <main id="conteudo" tabIndex={-1} className={s.pagina}>
        <nav aria-label="navegação"><a className={s.volta} href="/#gente">← quem passou</a></nav>

        <header className={s.topo}>
          <div className={s.quem}>
            <span className="t-credit">quem passou · {n} {n > 1 ? "lançamentos" : "lançamento"} com a reela</span>
            <h1 className={s.nome}>{a.nome}</h1>
            <p className={s.papel}>{a.papel}</p>
            {a.bio && <p className={s.bio}>{a.bio}</p>}
            {a.links && (
              <ul className={s.redes} aria-label={`${a.nome} nas plataformas`}>
                {REDES.filter((x) => a.links?.[x.id]).map((x) => (
                  <li key={x.id}><LinkDividido texto={x.nome} href={a.links![x.id]!} /></li>
                ))}
              </ul>
            )}
          </div>
          {a.foto ? (
            <img className={s.foto} src={a.foto} alt={a.nome} />
          ) : (
            <div className={s.mosaico} aria-hidden="true" data-n={Math.min(capas.length, 9)}>
              {capas.map((r) => <Arte key={r.id} r={r} />)}
            </div>
          )}
        </header>

        {player && (
          <section className={s.bloco} aria-labelledby="p-ouvir">
            <h2 className="t-title" id="p-ouvir">ouvir {a.nome}</h2>
            <iframe className={s.player} title={`${a.nome} no spotify`} src={player} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
          </section>
        )}

        <section className={s.bloco} aria-labelledby="p-lancs">
          <h2 className="t-title" id="p-lancs">com a reela</h2>
          <ul className={s.grade}>
            {lancs.map(({ r, papel }) => (
              <li key={r.id}>
                <a href={`/releases/${r.id}/`} className={s.card}>
                  <Arte r={r} className={s.capa} />
                  <span className="t-credit">{r.num} · {r.quando}</span>
                  <strong>{r.titulo}</strong>
                  <span className="t-caption">{papel}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Rodape />
      </main>
    </Casca>
  );
}

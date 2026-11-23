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
  // quantos lançamentos com cada função (a partir dos créditos)
  const em = (p: string) => lancs.filter((l) => l.papel.split(/, | e /).includes(p)).length;
  const numeros = [
    { v: String(n), rot: n > 1 ? "lançamentos com a reela" : "lançamento com a reela" },
    ...(a.plays ? [{ v: `${Math.floor(a.plays.spotify / 1000)} mil+`, rot: "plays no spotify*" }] : []),
    ...["voz", "beat", "mix", "master"].map((p) => ({ v: String(em(p)), rot: `com ${p}` })).filter((x) => x.v !== "0"),
  ];
  const dataPlays = a.plays?.em.split("-").reverse().join("/");

  return (
    <Casca>
      <main id="conteudo" tabIndex={-1} className={s.pagina}>
        <nav aria-label="navegação"><a className={s.volta} href="/#gente">← quem passou</a></nav>

        <header className={s.topo}>
          <div className={s.quem}>
            <span className="t-credit">{a.titulo ?? "quem passou"}</span>
            <h1 className={s.nome}>{a.nome}</h1>
            <p className={s.papel}>{a.funcoes ?? a.papel}</p>
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
              {capas.map((r) => <Arte key={r.id} r={r} sizes="(max-width: 860px) 33vw, 15vw" />)}
            </div>
          )}
        </header>

        <section className={s.numeros} aria-label="em números">
          <dl>
            {numeros.map((x) => (
              <div key={x.rot}><dt>{x.rot}</dt><dd>{x.v}</dd></div>
            ))}
          </dl>
          {a.plays && (
            <p className="t-caption">* soma das faixas populares no Spotify em {dataPlays}, só lançamentos da reela. é um piso: o total real é maior.</p>
          )}
        </section>

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
                  <Arte r={r} className={s.capa} sizes="(max-width: 860px) 45vw, 220px" />
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

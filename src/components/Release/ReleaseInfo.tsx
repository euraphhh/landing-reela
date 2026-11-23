/**
 * O conteúdo de um release: texto, player do Spotify, links e créditos.
 * Usado no detalhe (sobre o laço) e na página própria /releases/<id>/.
 * Devolve dois filhos para o grid `.grade`: o bloco de texto e a coluna de créditos.
 */
import type { Release } from "@/types";
import { STREAMING } from "@/data/links";
import { LinkDividido } from "@/components/LinkDividido/LinkDividido";
import s from "./ReleaseInfo.module.css";

export const grade = s.grade;
export const lugarCapa = s.lugar;

const PLATAFORMAS = STREAMING.filter((p) => p.id !== "tiktok");

/** open.spotify.com/…/album/<id> → player embutido */
export const embed = (url?: string) => {
  const m = url?.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(album|track)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : null;
};

type Props = {
  r: Release;
  /** o player só entra quando pedido: no detalhe, só com ele aberto */
  player: boolean;
  idTitulo: string;
  /** h1 na página própria, h2 no detalhe */
  nivel?: "h1" | "h2";
  /** atributo que o detalhe usa para animar a entrada */
  entra?: boolean;
};

export function ReleaseInfo({ r, player, idTitulo, nivel = "h2", entra = false }: Props) {
  const e = entra ? { "data-entra-det": "" } : {};
  const Titulo = nivel;
  const src = player ? embed(r.links?.spotify) : null;
  return (
    <>
      <div className={s.txt}>
        <span className="t-credit" {...e}>{r.num} · {r.quando}</span>
        <Titulo className="t-display" id={idTitulo} {...e}>{r.titulo}</Titulo>
        {r.artistas && <p className={s.artistas} {...e}>{r.artistas}</p>}
        {(r.faixas || r.selo) && (
          <p className="t-caption" {...e} style={{ margin: 0 }}>
            {[r.faixas && r.faixas > 1 ? `${r.faixas} faixas` : null, r.selo ? `℗ ${r.selo}` : null].filter(Boolean).join(" · ")}
          </p>
        )}
        {src && (
          <iframe
            className={s.player} {...e} title={`ouvir ${r.titulo} no spotify`} src={src} loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
        <ul className={s.links} aria-label="ouvir este release" {...e}>
          {PLATAFORMAS.filter((p) => r.links?.[p.id]).map((p) => (
            <li key={p.id}><LinkDividido texto={p.nome} href={r.links![p.id]!} className={s.sl} /></li>
          ))}
          {r.versoes?.filter((v) => v.spotify).map((v) => (
            <li key={v.nome}><LinkDividido texto={v.nome} href={v.spotify!} className={s.sl} /></li>
          ))}
        </ul>
      </div>
      {r.creditos.length > 0 && (
        <aside className={s.creditos} aria-label="créditos" {...e}>
          <span className="t-credit">créditos</span>
          <dl>
            {r.creditos.map((c) => (
              <div key={c.papel + c.nome}><dt>{c.papel}</dt><dd>{c.nome}</dd></div>
            ))}
          </dl>
        </aside>
      )}
    </>
  );
}

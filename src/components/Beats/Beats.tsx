import { BEATS } from "@/data/links";
import { BeatstarsB } from "@/components/marca/BeatstarsB";
import s from "./Beats.module.css";

/** os catálogos de beats na beatstars: uma linha grande para cada um */
export function Beats() {
  return (
    <section className={s.beats} id="beats" aria-labelledby="beats-h">
      <header className={s.topo}>
        <h2 id="beats-h" className={s.tit}>beats</h2>
        <p className={s.sub}>precisa de beat? escolhe, licencia e grava. os catálogos ficam na beatstars.</p>
      </header>
      <ul className={s.lista}>
        {BEATS.map((b, i) => (
          <li key={b.id}>
            <a className={s.linha} href={b.href} target="_blank" rel="noopener noreferrer">
              <span className="t-credit">0{i + 1}</span>
              <span className={s.quem}>{b.quem}</span>
              <span className={s.sobre}>{b.sobre}</span>
              <span className={s.ir}>
                <BeatstarsB className={s.marca} />
                ver catálogo <span aria-hidden="true">↗</span>
                <span className="sr"> (abre a beatstars em nova aba)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

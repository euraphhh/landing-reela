"use client";
import { useRef } from "react";
import { gsap, useGSAP, calmo } from "@/lib/gsap";
import { ARTISTAS, RELEASES } from "@/data";
import { Simbolo } from "@/components/marca/Simbolo";
import { useAncora } from "@/components/providers/SmoothScroll";
import { EV, emitir } from "@/lib/eventos";
import s from "./QuemPassou.module.css";

/** índice do lançamento mais recente com esse nome nos créditos */
const primeiroDe = (nome: string) =>
  Math.max(0, RELEASES.findIndex((r) => r.artistas.split(", ").includes(nome)));

export function QuemPassou() {
  const sec = useRef<HTMLElement>(null);
  const ancora = useAncora();

  // no hover, o ponto cai de novo no centro do laço
  const { contextSafe } = useGSAP({ scope: sec });
  const cair = contextSafe((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (calmo()) return;
    e.currentTarget.querySelectorAll<SVGCircleElement>(".ponto").forEach((p) => {
      const r = Number(p.dataset.r ?? 20);
      gsap.fromTo(p, { attr: { cy: -12, r: r / 2 } }, { attr: { cy: 50, r }, duration: 0.55, ease: "power2.out", overwrite: true });
    });
  });

  return (
    <section ref={sec} className={s.gente} id="gente" aria-labelledby="gente-h">
      <div className={s.cab}>
        <h2 className="t-display" id="gente-h">quem passou<br />por aqui.</h2>
        <p>gente que gravou, cantou ou produziu com a reela. do coletivo até agora.</p>
      </div>
      <ul className={s.rol}>
        {ARTISTAS.map((a) => {
          const i = primeiroDe(a.nome);
          return (
            <li key={a.nome}>
              <a
                href="#releases"
                onPointerEnter={cair}
                onClick={(e) => ancora(e, () => emitir(EV.release, i))}
                aria-label={`${a.nome}, ${a.faixas} ${a.faixas > 1 ? "lançamentos" : "lançamento"}. ver no laço`}
              >
                <Simbolo variante="animavel" className={s.mini} />
                <span className={s.nome}>{a.nome}</span>
                <span className="t-caption">{a.papel}</span>
                <span className="t-credit">{a.faixas} {a.faixas > 1 ? "lançamentos" : "lançamento"}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

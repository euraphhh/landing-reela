"use client";
/** 404: o laço se desenha e o ponto cai, como na entrada. a faixa não existe; a página volta. */
import { useRef } from "react";
import { gsap, useGSAP, calmo } from "@/lib/gsap";
import { Simbolo } from "@/components/marca/Simbolo";
import { Casca, Rodape } from "@/components/Casca/Casca";
import s from "./NaoEncontrada.module.css";

export function NaoEncontrada() {
  const sym = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (calmo()) return;
    const el = sym.current!;
    const tl = gsap.timeline();
    tl.fromTo(el.querySelectorAll(".laco"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, ease: "power2.inOut" }, 0.2);
    el.querySelectorAll<SVGCircleElement>(".ponto").forEach((p) => {
      const r = Number(p.dataset.r ?? 20);
      tl.fromTo(p, { attr: { cy: -12, r: r / 2 }, opacity: 0 }, { attr: { cy: 50, r }, opacity: 1, duration: 0.7, ease: "power2.out" }, 1.4);
    });
    tl.fromTo("[data-entra]", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 1.1);
  }, { scope: sym });

  return (
    <Casca>
      <main id="content" tabIndex={-1} className={s.pagina}>
        <div ref={sym} className={s.centro}>
          <div className={s.sym}><Simbolo variante="animavel" /></div>
          <span className="t-credit" data-entra>404</span>
          <h1 className="t-display" data-entra>essa faixa não existe.</h1>
          <p className="t-caption" data-entra>o link pode ter mudado, ou a faixa nunca saiu.</p>
          <div className={s.acoes} data-entra>
            <a className="btn btn-1" href="/">voltar pro começo</a>
            <a className="btn btn-2" href="/#releases">ver os lançamentos</a>
          </div>
        </div>
        <Rodape />
      </main>
    </Casca>
  );
}

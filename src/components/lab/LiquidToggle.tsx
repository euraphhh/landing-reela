"use client";
/**
 * Liquid toggle: o ponto atravessa o trilho e uma gota atrasada vai atrás, colando nele
 * (filtro "gooey": blur + contraste de alfa). A gota chega com elastic, de propósito.
 */
import { useEffect, useId, useRef } from "react";
import { gsap, calmo } from "@/lib/gsap";
import { useTema } from "@/hooks/useTema";
import s from "./LiquidToggle.module.css";

export function LiquidToggle() {
  const { tema, alternar } = useTema();
  const ponto = useRef<SVGCircleElement>(null);
  const gota = useRef<SVGCircleElement>(null);
  const primeiro = useRef(true);
  const f = useId().replace(/:/g, "");
  const ligado = tema === "madrugada";

  useEffect(() => {
    const x = ligado ? 92 : 28;
    if (primeiro.current || calmo()) { gsap.set([ponto.current, gota.current], { attr: { cx: x } }); primeiro.current = false; return; }
    gsap.to(ponto.current, { attr: { cx: x }, duration: 0.45, ease: "power3.inOut" });
    gsap.to(gota.current, { attr: { cx: x }, duration: 1.1, delay: 0.06, ease: "elastic.out(1, 0.35)" });
    gsap.fromTo(ponto.current, { attr: { r: 20 } }, { attr: { r: 16 }, duration: 0.22, yoyo: true, repeat: 1, ease: "sine.inOut" });
  }, [ligado]);

  return (
    <div className={s.wrap}>
      <button className={s.toggle} type="button" role="switch" aria-checked={ligado} aria-label="tema escuro" onClick={alternar}>
        <svg viewBox="0 0 120 56" aria-hidden="true">
          <defs>
            <filter id={f}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
              <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
            </filter>
          </defs>
          <rect x="1" y="1" width="118" height="54" rx="27" className={s.trilho} />
          <g filter={`url(#${f})`}>
            <circle ref={gota} cx="28" cy="28" r="15" className={s.bola} />
            <circle ref={ponto} cx="28" cy="28" r="18" className={s.bola} />
          </g>
        </svg>
      </button>
      <span className="t-caption">{ligado ? "escuro" : "claro"} · clica para trocar o tema do site</span>
    </div>
  );
}

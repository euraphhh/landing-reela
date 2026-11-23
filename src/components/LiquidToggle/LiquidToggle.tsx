"use client";
/**
 * Toggle claro/escuro líquido (vindo do lab, aprovado em 2026-11-23): o ponto atravessa o trilho
 * e uma gota atrasada vai atrás, colando nele (filtro "gooey": blur + contraste de alfa).
 * A gota chega com elastic: exceção consciente à regra "sem bounce/elastic".
 */
import { useEffect, useId, useRef } from "react";
import { gsap, calmo } from "@/lib/gsap";
import { useTema } from "@/hooks/useTema";
import s from "./LiquidToggle.module.css";

export function LiquidToggle({ className, rotulo = true }: { className?: string; rotulo?: boolean }) {
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
    gsap.fromTo(ponto.current, { attr: { r: 18 } }, { attr: { r: 15 }, duration: 0.22, yoyo: true, repeat: 1, ease: "sine.inOut" });
  }, [ligado]);

  useEffect(() => () => { gsap.killTweensOf([ponto.current, gota.current]); }, []);

  return (
    <button className={[s.toggle, className].filter(Boolean).join(" ")} type="button" role="switch" aria-checked={ligado} aria-label="tema escuro"
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); alternar({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }}>
      {rotulo && <span className={s.rotulo} aria-hidden="true">{ligado ? "escuro" : "claro"}</span>}
      <svg className={s.svg} viewBox="0 0 120 56" aria-hidden="true">
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
  );
}

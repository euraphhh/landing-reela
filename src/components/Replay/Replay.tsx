"use client";
/**
 * O fim: o laço se desenha com a descida (momento de scroll nº 2).
 * Continuar descendo no fim enche a barra e a página volta ao começo — o laço não fecha, a página volta.
 */
import { useCallback, useEffect, useRef } from "react";
import { gsap, useGSAP, calmo } from "@/lib/gsap";
import { Simbolo } from "@/components/marca/Simbolo";
import { Parceiro } from "@/components/Parceiro/Parceiro";
import { useScroll } from "@/components/providers/SmoothScroll";
import { EV, emitir } from "@/lib/eventos";
import s from "./Replay.module.css";

const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Replay() {
  const sec = useRef<HTMLElement>(null);
  const sym = useRef<HTMLDivElement>(null);
  const puxa = useRef<HTMLElement>(null);
  const voltando = useRef(false);
  const { ir } = useScroll();

  useGSAP(
    () => {
      if (calmo()) return;
      const laco = sym.current!.querySelectorAll(".laco");
      gsap.fromTo(laco, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: sec.current, start: "top 85%", end: "top 15%", scrub: true } });
      sym.current!.querySelectorAll<SVGCircleElement>(".ponto").forEach((p) => {
        const r = Number(p.dataset.r ?? 20);
        gsap.fromTo(p, { attr: { cy: -12, r: r / 2 }, opacity: 0 }, { attr: { cy: 50, r }, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: sec.current, start: "top 25%", end: "top 5%", scrub: true } });
      });
    },
    { scope: sec }
  );

  const replay = useCallback(() => {
    if (voltando.current) return;
    voltando.current = true;
    const fim = () => {
      voltando.current = false;
      gsap.set(puxa.current, { scaleX: 0 });
      document.getElementById("top")?.focus({ preventScroll: true });
      emitir(EV.entrada);
    };
    if (calmo()) { window.scrollTo(0, 0); fim(); return; }
    gsap.to(puxa.current, { scaleX: 1, duration: 0.3 });
    ir(0, { duration: 2.4, easing: inOutCubic, lock: true, onComplete: fim });
  }, [ir]);

  // continuar descendo no fim
  useEffect(() => {
    let carga = 0, ty = 0;
    const noFim = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const empurra = (dy: number) => {
      if (voltando.current) return;
      if (!noFim()) { if (carga) { carga = 0; gsap.to(puxa.current, { scaleX: 0, duration: 0.3 }); } return; }
      if (dy <= 0) return;
      carga = Math.min(1, carga + dy / 900);
      gsap.to(puxa.current, { scaleX: carga, duration: 0.2, overwrite: true });
      if (carga >= 1) { carga = 0; replay(); }
    };
    const roda = (e: WheelEvent) => empurra(e.deltaY);
    const ini = (e: TouchEvent) => { ty = e.touches[0].clientY; };
    const move = (e: TouchEvent) => { const y = e.touches[0].clientY; empurra((ty - y) * 1.6); ty = y; };
    addEventListener("wheel", roda, { passive: true });
    addEventListener("touchstart", ini, { passive: true });
    addEventListener("touchmove", move, { passive: true });
    return () => {
      removeEventListener("wheel", roda);
      removeEventListener("touchstart", ini);
      removeEventListener("touchmove", move);
      gsap.killTweensOf(puxa.current);
    };
  }, [replay]);

  return (
    <section ref={sec} className={s.replay} id="replay" aria-labelledby="rep-h">
      <div className={s.dentro}>
        <div ref={sym} className={s.sym}><Simbolo variante="animavel" /></div>
        <h2 className="t-display" id="rep-h">aperta o replay.</h2>
        <button className="btn btn-2" type="button" onClick={replay}>voltar pro começo</button>
        <div className={s.puxa} aria-hidden="true"><i ref={puxa} /></div>
        <span className="t-caption" aria-hidden="true">ou continua descendo.</span>
      </div>
      <footer className={s.rodape}>
        <span style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <Parceiro />
          <span className="t-credit">© {new Date().getFullYear()} reela music</span>
        </span>
        <span className="t-credit" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="/privacy/" className="lnk-rodape">privacidade</a>
          são josé dos campos, sp
        </span>
      </footer>
    </section>
  );
}

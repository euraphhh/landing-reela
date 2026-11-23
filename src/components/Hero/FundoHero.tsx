"use client";
/**
 * Fundo do hero: trechos dos visualizers (P&B, sem som) revezando com fade.
 * Sem trechos processados (src/data/canvas.json vazio), cai no filme em canvas.
 * Reduced motion ou economia de dados: só o poster. Pausa fora da tela e com a aba escondida.
 */
import { useEffect, useRef, useState } from "react";
import { gsap, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import clipsJson from "@/data/canvas.json";
import { Filme } from "./Filme";
import s from "./FundoHero.module.css";

type Clip = { id: string; src: string; poster: string; release?: string; legenda?: string };
const CLIPS = clipsJson as Clip[];
const nomeDe = (c: Clip) => c.legenda ?? RELEASES.find((r) => r.id === c.release)?.titulo ?? "";

export function FundoHero({ className }: { className?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const vids = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [atual, setAtual] = useState(0);
  const [parado, setParado] = useState(false);

  useEffect(() => {
    if (!CLIPS.length) return;
    const economia = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (calmo() || economia) { setParado(true); return; }
    const [a, b] = vids.map((v) => v.current!);
    let frente = a, tras = b, i = 0, visivel = true, vivo = true;

    const tocar = (v: HTMLVideoElement) => { if (visivel && !document.hidden) v.play().catch(() => {}); };
    const proximo = () => {
      if (!vivo) return;
      i = (i + 1) % CLIPS.length;
      tras.src = CLIPS[i].src;
      tras.load();
      tras.addEventListener("canplay", function troca() {
        tras.removeEventListener("canplay", troca);
        tocar(tras);
        gsap.to(tras, { opacity: 1, duration: 1.2, ease: "sine.inOut" });
        gsap.to(frente, { opacity: 0, duration: 1.2, ease: "sine.inOut", onComplete: () => frente.pause() });
        [frente, tras] = [tras, frente];
        setAtual(i);
      });
    };
    // um trecho só: loop; vários: revezam no fim de cada um
    const fim = () => proximo();
    a.addEventListener("ended", fim); b.addEventListener("ended", fim);
    if (CLIPS.length === 1) a.loop = true;
    a.src = CLIPS[0].src; gsap.set(a, { opacity: 1 }); gsap.set(b, { opacity: 0 });
    tocar(a);

    const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; visivel ? tocar(frente) : frente.pause(); });
    io.observe(caixa.current!);
    const vis = () => (document.hidden ? frente.pause() : tocar(frente));
    document.addEventListener("visibilitychange", vis);
    return () => {
      vivo = false; io.disconnect(); document.removeEventListener("visibilitychange", vis);
      a.removeEventListener("ended", fim); b.removeEventListener("ended", fim);
      gsap.killTweensOf([a, b]); a.pause(); b.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!CLIPS.length) return <Filme className={className} />;

  return (
    <div ref={caixa} className={[s.fundo, className].filter(Boolean).join(" ")} aria-hidden="true">
      {parado ? (
        <img className={s.midia} src={CLIPS[0].poster} alt="" />
      ) : (
        <>
          <video ref={vids[0]} className={s.midia} muted playsInline preload="auto" poster={CLIPS[0].poster} />
          <video ref={vids[1]} className={s.midia} muted playsInline preload="none" />
        </>
      )}
      <span className={s.veu} />
      {nomeDe(CLIPS[atual]) && <span className={`${s.credito} t-credit`}>no fundo · {nomeDe(CLIPS[atual])}</span>}
    </div>
  );
}

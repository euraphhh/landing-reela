"use client";
/**
 * Music island: o player fechado é uma pílula; ao abrir, cresce num card com capa, progresso e controles.
 * O crescimento é Flip (largura/altura reais, sem escala). Com `previa`, toca de verdade via useSom;
 * sem ela, o progresso é simulado (30s) e há o link para o Spotify.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, EASE, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import { useSom } from "@/hooks/useSom";
import s from "./MusicIsland.module.css";

const COM_CAPA = RELEASES.filter((r) => r.capa);

export function MusicIsland() {
  const ilha = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const eq = useRef<HTMLSpanElement>(null);
  const estado = useRef<Flip.FlipState | null>(null);
  const prog = useRef<gsap.core.Tween | null>(null);
  const [aberta, setAberta] = useState(false);
  const [i, setI] = useState(0);
  const [tocando, setTocando] = useState(false);
  const som = useSom();
  const r = COM_CAPA[i];

  const mudar = (fn: () => void) => { if (ilha.current) estado.current = Flip.getState(ilha.current); fn(); };

  useLayoutEffect(() => {
    if (!estado.current || !ilha.current) return;
    if (!calmo()) Flip.from(estado.current, { duration: 0.6, ease: EASE, scale: false, nested: true });
    estado.current = null;
  }, [aberta]);

  // progresso e equalizador só enquanto toca
  useLayoutEffect(() => {
    prog.current?.kill();
    const bars = eq.current?.querySelectorAll("i") ?? [];
    gsap.killTweensOf(bars);
    if (!tocando) { gsap.to(bars, { scaleY: 0.25, duration: 0.3 }); return; }
    if (barra.current) prog.current = gsap.fromTo(barra.current, { scaleX: 0 }, { scaleX: 1, duration: 30, ease: "none", onComplete: () => setTocando(false) });
    if (!calmo()) bars.forEach((b, k) => gsap.to(b, { scaleY: () => 0.3 + Math.random() * 0.7, duration: 0.28 + k * 0.05, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true }));
    return () => { prog.current?.kill(); gsap.killTweensOf(bars); };
  }, [tocando, i, aberta]);

  const play = () => { if (r.previa) som.alternar(r); setTocando((t) => !t); };
  const passo = (d: number) => { som.parar(); setTocando(false); setI((x) => (x + d + COM_CAPA.length) % COM_CAPA.length); };

  return (
    <div ref={ilha} className={`${s.ilha} ${aberta ? s.aberta : ""}`} data-flip-id="ilha">
      {!aberta ? (
        <button className={s.pilula} type="button" onClick={() => mudar(() => setAberta(true))} aria-label={`abrir player: ${r.titulo}`}>
          <img src={r.capa} alt="" className={s.mini} />
          <span className={s.nome}>{r.titulo}</span>
          <span ref={eq} className={s.eq} aria-hidden="true"><i /><i /><i /><i /></span>
        </button>
      ) : (
        <div className={s.card}>
          <div className={s.topo}>
            <img src={r.capa} alt="" className={s.capa} />
            <div className={s.info}>
              <span className="t-credit">{r.num} · {r.quando}</span>
              <strong>{r.titulo}</strong>
              <span className="t-caption">{r.artistas}</span>
            </div>
            <span ref={eq} className={s.eq} aria-hidden="true"><i /><i /><i /><i /></span>
          </div>
          <span className={s.progresso}><span ref={barra} /></span>
          <div className={s.controles}>
            <button type="button" aria-label="anterior" onClick={() => passo(-1)}>←</button>
            <button type="button" className={s.play} aria-label={tocando ? "pausar" : "tocar"} onClick={play}>{tocando ? "❚❚" : "▶"}</button>
            <button type="button" aria-label="próximo" onClick={() => passo(1)}>→</button>
            {r.links?.spotify && <a href={r.links.spotify} target="_blank" rel="noopener noreferrer" className="t-caption">spotify ↗</a>}
            <button type="button" className={s.fechar} aria-label="fechar player" onClick={() => mudar(() => setAberta(false))}>fechar</button>
          </div>
          {!r.previa && <span className="t-caption">sem arquivo de prévia: progresso simulado.</span>}
        </div>
      )}
    </div>
  );
}

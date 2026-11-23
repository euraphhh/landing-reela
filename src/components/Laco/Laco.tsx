"use client";
/**
 * O laço: os releases giram em órbita em volta do símbolo; a cauda (o topo) escolhe.
 * Arrasto (Draggable + Inertia, com snap), setas ←/→, teclado no palco e "ver em lista".
 * O giro é imperativo (gsap.set em refs); só o índice ativo vira estado React.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, Draggable, ScrollTrigger, SplitText, EASE, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import { Arte } from "@/components/Arte/Arte";
import { Simbolo } from "@/components/marca/Simbolo";
import { useSom } from "@/hooks/useSom";
import { usePulso } from "@/hooks/usePulso";
import { EV, ouvir } from "@/lib/eventos";
import { Detalhe, type DetalheHandle } from "./Detalhe";
import s from "./Laco.module.css";

const N = RELEASES.length;
const STEP = 360 / N;
const dois = (n: number) => String(n).padStart(2, "0");
const norm = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

export function Laco() {
  const sec = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const orbita = useRef<HTMLDivElement>(null);
  const anel = useRef<HTMLDivElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const artes = useRef<(HTMLDivElement | null)[]>([]);
  const titulo = useRef<HTMLParagraphElement>(null);
  const detalhe = useRef<DetalheHandle>(null);

  const [ativo, setAtivo] = useState(0);
  const [listaAberta, setListaAberta] = useState(false);
  const ativoRef = useRef(0);
  const primeiro = useRef(true);
  const irRef = useRef<(i: number) => void>(() => {});
  const arrastou = useRef(false);

  const som = useSom();
  usePulso(anel);

  useGSAP(
    () => {
      const p = palco.current!, orb = orbita.current!;
      const proxy = document.createElement("div");
      let rot = 0, PX = 100;

      const aplicar = (r: number) => {
        rot = r;
        gsap.set(orb, { rotation: r });
        cards.current.forEach((c, i) => {
          if (!c) return;
          const w = Math.abs(norm(i * STEP + r)), k = Math.max(0, 1 - w / STEP);
          gsap.set(c, { scale: 1 + 0.42 * k, opacity: 1 - Math.min(0.7, (w / 180) * 0.85) });
          slots.current[i]!.style.zIndex = String(Math.round(200 - w));
        });
        const idx = ((Math.round(-r / STEP) % N) + N) % N;
        if (idx !== ativoRef.current) { ativoRef.current = idx; setAtivo(idx); }
      };

      const layout = () => {
        const W = p.clientWidth, H = p.clientHeight, cel = window.innerWidth < 860;
        const D = cel ? Math.min(W * 0.5, H * 0.36) : Math.min(W * 0.42, H * 0.44);
        const CW = D * 0.25, CH = CW, R = D / 2 + CH * 0.7;
        PX = CW * 1.5;
        // no celular o palco vem primeiro: abre espaço para a barra fixa (≈76px) acima da capa ativa
        const topo = cel ? 84 : H * 0.09;
        const cx = W / 2, cy = topo + R + CH * 0.72;
        gsap.set(anel.current, { width: D, height: D, left: cx - D / 2, top: cy - D / 2 });
        const pd = D * 0.4 + 4;
        gsap.set(play.current, { width: pd, height: pd, left: cx - pd / 2, top: cy - pd / 2 });
        gsap.set(orb, { left: cx, top: cy });
        slots.current.forEach((sl, i) => sl && gsap.set(sl, { rotation: i * STEP }));
        cards.current.forEach((c) => c && gsap.set(c, { width: CW, left: -CW / 2, top: -R - CH / 2 }));
        gsap.set(proxy, { x: (rot / STEP) * PX });
        aplicar(rot);
      };

      const ir = (i: number) => {
        const atual = Math.round(-rot / STEP);
        let delta = (((i - atual) % N) + N) % N;
        if (delta > N / 2) delta -= N;
        const alvo = -(atual + delta) * STEP;
        gsap.to(proxy, {
          x: (alvo / STEP) * PX, duration: calmo() ? 0 : 0.95, ease: EASE, overwrite: true,
          onUpdate: () => aplicar((Number(gsap.getProperty(proxy, "x")) / PX) * STEP),
        });
      };
      irRef.current = ir;

      const [drag] = Draggable.create(proxy, {
        type: "x", trigger: p, inertia: !calmo(), allowContextMenu: true, dragClickables: true, minimumMovement: 6,
        snap: (x: number) => Math.round(x / PX) * PX,
        onPress() { gsap.killTweensOf(proxy); },
        onDragStart() { arrastou.current = true; },
        onDrag() { aplicar((this.x / PX) * STEP); },
        onThrowUpdate() { aplicar((this.x / PX) * STEP); },
        onRelease() { window.setTimeout(() => (arrastou.current = false), 60); },
      });

      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(p);
      const off = ouvir<number>(EV.release, (i) => window.setTimeout(() => ir(i), 100));

      return () => { ro.disconnect(); off(); drag.kill(); gsap.killTweensOf(proxy); irRef.current = () => {}; };
    },
    { scope: sec }
  );

  // o título do release ativo sobe letra por letra (key = ativo remonta o <p>)
  useGSAP(
    () => {
      if (primeiro.current) { primeiro.current = false; return; }
      if (calmo() || !titulo.current) return;
      const split = new SplitText(titulo.current, { type: "words,chars", mask: "chars" });
      gsap.fromTo(split.chars, { yPercent: 100 }, { yPercent: 0, duration: 0.55, stagger: 0.018, ease: "power3.out" });
      gsap.fromTo("[data-troca]", { opacity: 0 }, { opacity: 1, duration: 0.4, overwrite: true });
      return () => split.revert();
    },
    { scope: sec, dependencies: [ativo], revertOnUpdate: true }
  );

  useEffect(() => { ScrollTrigger.refresh(); }, [listaAberta]);

  const ir = useCallback((i: number) => irRef.current(i), []);
  const abrir = useCallback((i: number) => {
    detalhe.current?.abrir(i, artes.current[i]!, cards.current[i]!);
  }, []);

  const teclas = (e: React.KeyboardEvent) => {
    const a = ativoRef.current;
    if (e.key === "ArrowRight") { e.preventDefault(); ir(a + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); ir(a - 1); }
    else if (e.key === "Home") { e.preventDefault(); ir(0); }
    else if (e.key === "End") { e.preventDefault(); ir(N - 1); }
    else if (e.key === "Enter" && e.target === e.currentTarget) { e.preventDefault(); abrir(a); }
  };

  const r = RELEASES[ativo];
  const tocandoEste = som.tocando === r.id;
  // prévia: arquivo local toca aqui; senão, o player do Spotify no detalhe; sem nenhum dos dois, ainda não tem
  const temOuvir = som.temPrevia(r) || Boolean(r.links?.spotify);
  const ouvirPrevia = () => (som.temPrevia(r) ? som.alternar(r) : abrir(ativo));
  const rotOuvir = !temOuvir ? "prévia em breve" : tocandoEste ? "pausar prévia" : "ouvir prévia";

  return (
    <section ref={sec} className={s.sec} id="releases" aria-labelledby="rel-h">
      <div className={s.info}>
        <h2 className="sr" id="rel-h">releases</h2>
        <div aria-live="polite" className={s.vivo}>
          <div className={`${s.kick} t-credit`} data-troca>
            <span className={s.num}>{r.num}</span><span>{r.quando}</span>
          </div>
          <div className={s.titWrap}>
            <p key={ativo} ref={titulo} className="t-title">{r.titulo}</p>
          </div>
          {r.artistas && <p className={s.artistas} data-troca>{r.artistas}</p>}
          <dl className="creditos" data-troca>
            {r.creditos.map((c) => (
              <div key={c.papel + c.nome} style={{ display: "contents" }}><dt>{c.papel}</dt><dd>{c.nome}</dd></div>
            ))}
          </dl>
        </div>
        <div className={s.acoes}>
          <button className="btn btn-1" type="button" onClick={ouvirPrevia} disabled={!temOuvir}>{rotOuvir}</button>
          <button className="btn btn-2" type="button" onClick={() => abrir(ativo)}>abrir release</button>
        </div>
        <div className={s.passos}>
          <button className={s.passo} type="button" aria-label="release anterior" onClick={() => ir(ativoRef.current - 1)}>←</button>
          <button className={s.passo} type="button" aria-label="próximo release" onClick={() => ir(ativoRef.current + 1)}>→</button>
          <span className={`${s.contador} t-caption`}><b>{dois(ativo + 1)}</b> / {dois(N)}</span>
          <button className={s.verLista} type="button" aria-expanded={listaAberta} aria-controls="lista" onClick={() => setListaAberta((v) => !v)}>
            {listaAberta ? "fechar lista" : "ver em lista"}
          </button>
        </div>
        <ul id="lista" className={s.lista} hidden={!listaAberta}>
          {RELEASES.map((x, i) => (
            <li key={x.id}>
              <button type="button" aria-current={i === ativo} onClick={() => ir(i)}>
                <span className="t-credit">{x.num}</span>
                <span>{x.titulo}<br /><span className="t-caption">{x.artistas}</span></span>
                <span className="t-caption">{x.quando}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={palco} className={s.palco} tabIndex={0} role="group"
        aria-roledescription="carrossel" aria-label="releases no laço. use as setas para girar, enter para abrir."
        onKeyDown={teclas}
      >
        <div ref={anel} className={s.anel} aria-hidden="true"><Simbolo variante="animavel" /></div>
        <button ref={play} className={s.play} type="button" aria-label={rotOuvir} onClick={ouvirPrevia} disabled={!temOuvir}>
          <svg viewBox="0 0 10 10" aria-hidden="true">
            <path d={tocandoEste ? "M2 1H4V9H2ZM6 1H8V9H6Z" : "M2 1L9 5L2 9Z"} fill="currentColor" />
          </svg>
        </button>
        <div ref={orbita} className={s.orbita}>
          {RELEASES.map((x, i) => (
            <div key={x.id} ref={(el) => { slots.current[i] = el; }} className={s.slot}>
              <button
                ref={(el) => { cards.current[i] = el; }}
                className={s.card} type="button" tabIndex={-1}
                aria-current={i === ativo}
                aria-label={[x.num, x.titulo, x.artistas].filter(Boolean).join(", ")}
                onClick={() => { if (arrastou.current) return; if (i === ativoRef.current) abrir(i); else ir(i); }}
              >
                <Arte r={x} ref={(el: HTMLDivElement | null) => { artes.current[i] = el; }} data-flip-id={`capa-${x.id}`} />
              </button>
            </div>
          ))}
        </div>
        <span className={`${s.dica} t-caption`} aria-hidden="true">arrasta o laço · a cauda escolhe</span>
      </div>

      <Detalhe ref={detalhe} />
    </section>
  );
}

"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import { STREAMING } from "@/data/links";
import { Arte } from "@/components/Arte/Arte";
import { LinkDividido } from "@/components/LinkDividido/LinkDividido";
import { useAncora } from "@/components/providers/SmoothScroll";
import { EV, emitir, ouvir } from "@/lib/eventos";
import { Filme } from "./Filme";
import s from "./Hero.module.css";

const NOVA = RELEASES[0];

export function Hero() {
  const sec = useRef<HTMLElement>(null);
  const marca = useRef<HTMLHeadingElement>(null);
  const txt = useRef<HTMLSpanElement>(null);
  const ancora = useAncora();

  useGSAP(
    () => {
      const m = marca.current!, t = txt.current!;

      // o wordmark vaza a tela: 112% da largura da janela, centrado
      const encaixar = () => {
        m.style.fontSize = "100px";
        const w = t.getBoundingClientRect().width || 1;
        const alvo = window.innerWidth * 1.12;
        const gut = parseFloat(getComputedStyle(sec.current!).paddingLeft);
        m.style.fontSize = `${(100 * alvo) / w}px`;
        m.style.marginLeft = `${-gut - (alvo - window.innerWidth) / 2}px`;
      };
      let split: SplitText | null = null;
      const entrar = () => {
        if (calmo()) return;
        split ??= new SplitText(t, { type: "chars", mask: "chars" });
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(split.chars, { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0)
          .fromTo("[data-entra]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.35);
      };

      encaixar();
      let ro: ResizeObserver | null = null;
      let tm = 0;
      const aoMudar = () => { clearTimeout(tm); tm = window.setTimeout(() => { encaixar(); ScrollTrigger.refresh(); }, 120); };
      document.fonts.ready.then(() => {
        encaixar(); ScrollTrigger.refresh(); entrar();
        ro = new ResizeObserver(aoMudar); ro.observe(document.documentElement);
      });
      const off = ouvir(EV.entrada, entrar);
      return () => { off(); ro?.disconnect(); clearTimeout(tm); split?.revert(); };
    },
    { scope: sec }
  );

  return (
    <section ref={sec} className={s.hero} id="topo" aria-label="reela music">
      <Filme className={s.filme} />
      <h1 ref={marca} id="marca" className={s.marca}>
        <span className="sr">reela music, selo de trap e r&amp;b</span>
        <span ref={txt} aria-hidden="true">reela</span>
      </h1>
      <div className={s.baixo}>
        <div className={s.txt}>
          <p className={s.linha} data-entra>
            selo de trap e r&amp;b. <span>a gente faz o beat, a mix e a arte. a faixa é sua.</span>
          </p>
          <ul className={s.links} aria-label="ouvir a reela">
            {STREAMING.map((p) => (
              <li key={p.id} data-entra><LinkDividido texto={p.nome} href={p.href} /></li>
            ))}
          </ul>
        </div>
        <a className={s.agora} href="#releases" data-entra onClick={(e) => ancora(e, () => emitir(EV.release, 0))}>
          <Arte r={NOVA} className={s.agoraArt} />
          <span className={s.rot}>
            <span className="t-credit">{NOVA.num} · {NOVA.quando}</span>
            <strong>a primeira da era nova.</strong>
            <span className="t-caption">abre no laço →</span>
          </span>
        </a>
      </div>
    </section>
  );
}

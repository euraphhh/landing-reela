"use client";
import { useRef } from "react";
import { useGSAP, ScrollTrigger, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import { STREAMING } from "@/data/links";
import { Arte } from "@/components/Arte/Arte";
import { LinkDividido } from "@/components/LinkDividido/LinkDividido";
import { EV, ouvir } from "@/lib/eventos";
import { tocaEntrada, liberarEntrada } from "@/lib/entrada";
import { FundoHero } from "./FundoHero";
import s from "./Hero.module.css";

/** o lançamento mais recente (o primeiro do laço) */
const NOVA = RELEASES[0];

export function Hero() {
  const sec = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sc = sec.current!;
      // a entrada inteira do hero é CSS (Hero.module.css): começa sem esperar o JS (é o LCP).
      // primeira visita: html[data-entrada]; replay: reinicia as animações com a classe .subir
      const replay = () => {
        if (calmo()) return;
        sc.classList.remove(s.subir); void sc.offsetWidth; sc.classList.add(s.subir);
      };
      if (tocaEntrada()) liberarEntrada();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      return ouvir(EV.entrada, replay);
    },
    { scope: sec }
  );

  return (
    <section ref={sec} className={s.hero} id="top" tabIndex={-1} aria-label="reela music">
      <FundoHero className={s.filme} />
      <h1 id="marca" className={s.marca}>
        <span className="sr">reela music, selo de trap e r&amp;b</span>
        {/* cada letra numa máscara; a subida é CSS (primeira visita via data-entrada, replay via .subir) */}
        <span aria-hidden="true" className={s.letras}>
          {"reela".split("").map((c, i) => (
            <span key={i} className={s.ch} style={{ "--i": i } as React.CSSProperties}><span>{c}</span></span>
          ))}
        </span>
      </h1>
      <div className={s.baixo}>
        <div className={s.txt}>
          <p className={s.linha} data-entra style={{ "--j": 0 } as React.CSSProperties}>
            selo de trap e r&amp;b. <span>a gente faz o beat, a mix e a arte. a faixa é sua.</span>
          </p>
          <ul className={s.links} aria-label="ouvir a reela">
            {STREAMING.map((p, j) => (
              <li key={p.id} data-entra style={{ "--j": j + 1 } as React.CSSProperties}><LinkDividido texto={p.nome} href={p.href} /></li>
            ))}
          </ul>
        </div>
        <a className={s.agora} href={`/releases/${NOVA.id}/`} data-entra style={{ "--j": 5 } as React.CSSProperties}>
          <Arte r={NOVA} className={s.agoraArt} sizes="96px" prioridade />
          <span className={s.rot}>
            <span className="t-credit">{NOVA.num} · {NOVA.quando}</span>
            <strong>{NOVA.titulo}</strong>
            <span className="t-caption">o mais novo. ouvir →</span>
          </span>
        </a>
      </div>
    </section>
  );
}

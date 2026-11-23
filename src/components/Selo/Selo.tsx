"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, calmo } from "@/lib/gsap";
import { EMAIL, EMAIL_HREF } from "@/data/links";
import s from "./Selo.module.css";

const LINHAS = [
  "a reela não contrata artista.",
  "contrata música.",
  "a gente entra com beat, mix e arte.",
  "você entra com a voz.",
  "o split fica no papel antes do primeiro play.",
];

/** momento de scroll nº 1: o manifesto acende palavra por palavra */
export function Selo() {
  const sec = useRef<HTMLElement>(null);
  const man = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (calmo()) return;
      const split = new SplitText(man.current!.querySelectorAll("[data-l]"), { type: "words" });
      gsap.fromTo(split.words, { opacity: 0.22 }, {
        opacity: 1, stagger: 0.12, ease: "none",
        scrollTrigger: { trigger: sec.current, start: "top 70%", end: "bottom 75%", scrub: true },
      });
      return () => split.revert();
    },
    { scope: sec }
  );

  return (
    <section ref={sec} className={s.selo} id="label" aria-labelledby="selo-h">
      <h2 className="sr" id="selo-h">o selo</h2>
      <p ref={man} className={s.manifesto}>
        {LINHAS.map((l) => <span key={l} data-l className={s.l}>{l}</span>)}
      </p>
      <aside className={s.aside}>
        <p className="t-heading">tem uma faixa que não sai da cabeça?</p>
        <p className="t-caption">manda o link do pré-mix ou da demo. a gente ouve tudo, responde em até uma semana.</p>
        <a className="btn btn-1" href={EMAIL_HREF} onClick={EMAIL_HREF === "#" ? (e) => e.preventDefault() : undefined}>mandar faixa</a>
        <span className={s.mail}>{EMAIL}</span>
        <a className="lnk-rodape" href="/how-it-works/">como funciona o acordo →</a>
      </aside>
    </section>
  );
}

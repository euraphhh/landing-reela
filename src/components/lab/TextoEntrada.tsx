"use client";
/** Três entradas de título lado a lado: a atual do site, rise por palavra e blur por letra. */
import { useRef, useState } from "react";
import { gsap, useGSAP, SplitText, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import s from "./TextoEntrada.module.css";

const VARIANTES = [
  { id: "atual", nome: "atual · letras sobem", entrar: (el: HTMLElement) => { const sp = new SplitText(el, { type: "words,chars", mask: "chars" }); gsap.fromTo(sp.chars, { yPercent: 100 }, { yPercent: 0, duration: 0.55, stagger: 0.018, ease: "power3.out" }); return sp; } },
  { id: "rise", nome: "rise · palavras sobem e assentam", entrar: (el: HTMLElement) => { const sp = new SplitText(el, { type: "words", mask: "words" }); gsap.fromTo(sp.words, { yPercent: 110, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 0.9, stagger: 0.08, ease: "power4.out", transformOrigin: "0% 100%" }); return sp; } },
  { id: "blur", nome: "blur · letras saem da névoa", entrar: (el: HTMLElement) => { const sp = new SplitText(el, { type: "words,chars" }); gsap.fromTo(sp.chars, { opacity: 0, filter: "blur(12px)", y: 8 }, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.8, stagger: { each: 0.025, from: "random" }, ease: "power2.out" }); return sp; } },
];

export function TextoEntrada() {
  const box = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const tit = RELEASES[n % RELEASES.length].titulo;

  useGSAP(() => {
    if (calmo()) return;
    const splits = VARIANTES.map((v) => v.entrar(box.current!.querySelector<HTMLElement>(`[data-v="${v.id}"]`)!));
    return () => splits.forEach((sp) => sp.revert());
  }, { scope: box, dependencies: [n], revertOnUpdate: true });

  return (
    <div ref={box} className={s.box}>
      <div className={s.grade}>
        {VARIANTES.map((v) => (
          <div key={v.id} className={s.col}>
            <span className="t-credit">{v.nome}</span>
            <p key={`${v.id}-${n}`} data-v={v.id} className="t-title">{tit}</p>
          </div>
        ))}
      </div>
      <button className="btn btn-2" type="button" onClick={() => setN((x) => x + 1)}>próximo título</button>
    </div>
  );
}

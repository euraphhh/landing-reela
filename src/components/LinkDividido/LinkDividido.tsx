"use client";
import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/lib/gsap";
import s from "./LinkDividido.module.css";

type Props = { texto: string; href: string; className?: string };

/** corta o texto no meio, contando só letras */
function dividir(t: string) {
  const corte = Math.ceil(t.replace(/ /g, "").length / 2);
  let i = 0, n = 0;
  while (n < corte) { if (t[i] !== " ") n++; i++; }
  return [t.slice(0, i), t.slice(i)] as const;
}

/** link de plataforma: no hover/foco o nome se abre no meio, como o laço que não fecha */
export function LinkDividido({ texto, href, className }: Props) {
  const a = useRef<HTMLAnchorElement>(null);
  const vao = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [cabeca, cauda] = dividir(texto);
  const externo = href !== "#" && /^https?:/.test(href);

  const { contextSafe } = useGSAP(
    () => { tl.current = gsap.timeline({ paused: true }).to(vao.current, { width: "0.5em", duration: 0.5, ease: EASE }); },
    { scope: a }
  );
  const abrir = contextSafe(() => tl.current?.play());
  const fechar = contextSafe(() => tl.current?.reverse());

  return (
    <a
      ref={a}
      className={[s.sl, className].filter(Boolean).join(" ")}
      href={href}
      aria-label={texto}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerEnter={abrir} onPointerLeave={fechar} onFocus={abrir} onBlur={fechar}
      onClick={href === "#" ? (e) => e.preventDefault() : undefined}
    >
      <span aria-hidden="true">{cabeca}</span>
      <span ref={vao} className={s.vao} aria-hidden="true" />
      <span aria-hidden="true">{cauda}</span>
      <span className={s.seta} aria-hidden="true">↗</span>
    </a>
  );
}

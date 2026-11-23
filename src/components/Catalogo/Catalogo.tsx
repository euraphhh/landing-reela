"use client";
/**
 * Catálogo: todos os lançamentos, agrupados por ano. Filtros (todos, destaques, eps, singles);
 * ao filtrar, a grade some rápido e as capas sobem em sequência.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import type { Release } from "@/types";
import { Arte } from "@/components/Arte/Arte";
import s from "./Catalogo.module.css";

const FILTROS: { id: string; rot: string; f: (r: Release) => boolean }[] = [
  { id: "todos", rot: "todos", f: () => true },
  { id: "destaques", rot: "destaques", f: (r) => Boolean(r.destaque) },
  { id: "ep", rot: "eps", f: (r) => r.tipo === "EP" },
  { id: "single", rot: "singles", f: (r) => r.tipo === "Single" },
];
const ANOS = [...new Set(RELEASES.map((r) => r.ano ?? ""))].filter(Boolean).sort().reverse();

export function Catalogo() {
  const grade = useRef<HTMLDivElement>(null);
  const trocou = useRef(false);
  const [filtro, setFiltro] = useState("todos");
  const f = FILTROS.find((x) => x.id === filtro)!.f;

  // troca de filtro: a grade some rápido, o filtro troca e as capas sobem em sequência
  // (Flip com anos entrando e saindo ao mesmo tempo embaralhava a grade no meio do caminho)
  const escolher = (id: string) => {
    if (id === filtro) return;
    if (calmo() || !grade.current) { setFiltro(id); return; }
    gsap.to(grade.current, { opacity: 0, duration: 0.18, ease: "power2.in", onComplete: () => { trocou.current = true; setFiltro(id); } });
  };

  useLayoutEffect(() => {
    if (!trocou.current || !grade.current) return;
    trocou.current = false;
    gsap.set(grade.current, { opacity: 1 });
    gsap.fromTo(grade.current.querySelectorAll("h2, li"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.035, ease: "power3.out" });
  }, [filtro]);

  const total = RELEASES.filter(f).length;

  return (
    <>
      <header className={s.cab}>
        <span className="t-credit">catálogo</span>
        <h1 className="t-display">todos os<br />lançamentos.</h1>
        <div className={s.filtros} role="group" aria-label="filtrar lançamentos">
          {FILTROS.map((x) => (
            <button key={x.id} type="button" className={s.filtro} aria-pressed={filtro === x.id} onClick={() => escolher(x.id)}>
              {x.rot} <span className={s.n}>{RELEASES.filter(x.f).length}</span>
            </button>
          ))}
        </div>
        <p className="sr" aria-live="polite">{total} lançamentos</p>
      </header>

      <div ref={grade} className={s.anos}>
        {ANOS.map((ano) => {
          const doAno = RELEASES.filter((r) => r.ano === ano && f(r));
          if (!doAno.length) return null;
          return (
            <section key={ano} className={s.ano} aria-labelledby={`ano-${ano}`} data-flip-id={`ano-${ano}`}>
              <h2 className={s.anoTit} id={`ano-${ano}`}>{ano}</h2>
              <ul className={s.grade}>
                {doAno.map((r) => (
                  <li key={r.id} data-flip-id={r.id}>
                    <a href={`/releases/${r.id}/`} className={s.card}>
                      <Arte r={r} className={s.capa} sizes="(max-width: 860px) 45vw, 220px" />
                      <span className="t-credit">{r.num} · {r.tipo?.toLowerCase()}{r.destaque ? " · destaque" : ""}</span>
                      <strong>{r.titulo}</strong>
                      {r.artistas && <span className="t-caption">{r.artistas}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}

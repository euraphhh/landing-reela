"use client";
import { useCallback, useEffect, useState } from "react";
import type { Tema } from "@/types";
import { CHAVE_TEMA } from "@/app/tema-script";
import { EV, emitir, ouvir } from "@/lib/eventos";
import { calmo } from "@/lib/gsap";

type Origem = { x: number; y: number };
type ComTransicao = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

const ler = (): Tema =>
  typeof document !== "undefined" && document.documentElement.dataset.tema === "papel" ? "papel" : "madrugada";

/** o tema já vem definido pelo script do <head>; aqui só lemos e trocamos */
export function useTema() {
  const [tema, setTema] = useState<Tema>("madrugada");

  useEffect(() => {
    setTema(ler());
    return ouvir<Tema>(EV.tema, setTema);
  }, []);

  /**
   * Troca o tema. Com View Transitions, a página inteira troca de uma vez: o tema novo se revela
   * num círculo que cresce a partir de `origem` (o botão). Sem suporte ou com reduced motion: instantâneo.
   * (antes, só o fundo fazia transição e o resto mudava na hora: estados misturados no meio)
   */
  const definir = useCallback((t: Tema, origem?: Origem) => {
    const d = document.documentElement;
    const aplicar = () => {
      d.dataset.tema = t;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "papel" ? "#FFFFFF" : "#000000");
      try { sessionStorage.setItem(CHAVE_TEMA, t); } catch {}
      emitir(EV.tema, t);
    };
    const doc = document as ComTransicao;
    if (!doc.startViewTransition || calmo()) { aplicar(); return; }
    const x = origem?.x ?? innerWidth / 2, y = origem?.y ?? 0;
    d.style.setProperty("--vt-x", `${x}px`);
    d.style.setProperty("--vt-y", `${y}px`);
    d.style.setProperty("--vt-r", `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
    d.classList.add("vt-tema");
    doc.startViewTransition(aplicar).finished.finally(() => d.classList.remove("vt-tema"));
  }, []);

  const alternar = useCallback((origem?: Origem) => definir(ler() === "papel" ? "madrugada" : "papel", origem), [definir]);

  return { tema, definir, alternar };
}

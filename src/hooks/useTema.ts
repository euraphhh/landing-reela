"use client";
import { useCallback, useEffect, useState } from "react";
import type { Tema } from "@/types";
import { CHAVE_TEMA } from "@/app/tema-script";
import { EV, emitir, ouvir } from "@/lib/eventos";

const ler = (): Tema =>
  typeof document !== "undefined" && document.documentElement.dataset.tema === "papel" ? "papel" : "madrugada";

/** o tema já vem definido pelo script do <head>; aqui só lemos e trocamos */
export function useTema() {
  const [tema, setTema] = useState<Tema>("madrugada");

  useEffect(() => {
    setTema(ler());
    return ouvir<Tema>(EV.tema, setTema);
  }, []);

  const definir = useCallback((t: Tema) => {
    const d = document.documentElement;
    d.dataset.tema = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "papel" ? "#FFFFFF" : "#000000");
    try { sessionStorage.setItem(CHAVE_TEMA, t); } catch {}
    emitir(EV.tema, t);
  }, []);

  const alternar = useCallback(() => definir(ler() === "papel" ? "madrugada" : "papel"), [definir]);

  return { tema, definir, alternar };
}

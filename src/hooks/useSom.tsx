"use client";
/**
 * Som só onde ele é pedido: a prévia de um release.
 * - release com `previa` (arquivo em /public/audio) → toca aqui, em loop, e o ponto pulsa no bpm
 * - sem `previa` → quem chama abre o player do Spotify no detalhe (ver Detalhe.tsx)
 * Nada toca sozinho e não existe som de fundo na página.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Release } from "@/types";

type Batida = () => void;
type Ctx = {
  /** id do release tocando agora, ou null */
  tocando: string | null;
  /** true se o release tem prévia local para tocar aqui */
  temPrevia: (r: Release) => boolean;
  alternar: (r: Release) => void;
  parar: () => void;
  onBatida: (fn: Batida) => () => void;
};

const SomCtx = createContext<Ctx | null>(null);
export function useSom() {
  const c = useContext(SomCtx);
  if (!c) throw new Error("useSom fora do SomProvider");
  return c;
}

export function SomProvider({ children }: { children: React.ReactNode }) {
  const [tocando, setTocando] = useState<string | null>(null);
  const ouvintes = useRef(new Set<Batida>());
  const audio = useRef<HTMLAudioElement | null>(null);
  const pulso = useRef<number | null>(null);

  const batida = useCallback(() => ouvintes.current.forEach((fn) => fn()), []);
  const pararPulso = () => { if (pulso.current != null) { clearInterval(pulso.current); pulso.current = null; } };

  const parar = useCallback(() => {
    audio.current?.pause();
    pararPulso();
    setTocando(null);
  }, []);

  const alternar = useCallback(async (r: Release) => {
    if (!r.previa) return;
    if (tocando === r.id) { parar(); return; }
    const a = audio.current ?? (audio.current = new Audio());
    a.loop = true;
    a.onended = parar;
    if (!a.src.endsWith(r.previa)) a.src = r.previa;
    pararPulso();
    try { await a.play(); } catch { setTocando(null); return; }
    pulso.current = window.setInterval(batida, 60000 / (r.bpm ?? 90));
    setTocando(r.id);
  }, [tocando, parar, batida]);

  const onBatida = useCallback((fn: Batida) => {
    ouvintes.current.add(fn);
    return () => { ouvintes.current.delete(fn); };
  }, []);

  // aba escondida: a prévia para
  useEffect(() => {
    const vis = () => { if (document.hidden) parar(); };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [parar]);

  useEffect(() => () => {
    pararPulso();
    if (audio.current) { audio.current.pause(); audio.current.removeAttribute("src"); audio.current.load(); audio.current = null; }
  }, []);

  const valor = useMemo<Ctx>(
    () => ({ tocando, temPrevia: (r) => Boolean(r.previa), alternar: (r) => void alternar(r), parar, onBatida }),
    [tocando, alternar, parar, onBatida]
  );
  return <SomCtx.Provider value={valor}>{children}</SomCtx.Provider>;
}

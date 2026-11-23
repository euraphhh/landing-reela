"use client";
/**
 * Detalhe do release: a capa voa do laço para cá com Flip e volta ao fechar.
 * Diálogo modal: foco no "voltar", foco preso, Esc fecha, Lenis parado.
 */
import { useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, EASE, calmo } from "@/lib/gsap";
import { LACO as RELEASES } from "@/data"; // mesmos índices do laço
import { Arte } from "@/components/Arte/Arte";
import { ReleaseInfo, grade, lugarCapa } from "@/components/Release/ReleaseInfo";
import { useScroll } from "@/components/providers/SmoothScroll";
import s from "./Detalhe.module.css";

export type DetalheHandle = { abrir: (i: number, origem: HTMLElement, card: HTMLElement) => void };

type Pendente =
  | { tipo: "abrir"; st: Flip.FlipState; origem: HTMLElement }
  | { tipo: "fechar"; st: Flip.FlipState; origem: HTMLElement }
  | null;

export function Detalhe({ ref }: { ref?: React.Ref<DetalheHandle> }) {
  const caixa = useRef<HTMLDivElement>(null);
  const arte = useRef<HTMLDivElement>(null);
  const voltar = useRef<HTMLButtonElement>(null);
  const [idx, setIdx] = useState(0);
  const [aberto, setAberto] = useState(false);
  const pendente = useRef<Pendente>(null);
  const origem = useRef<HTMLElement | null>(null);
  const devolverFoco = useRef<HTMLElement | null>(null);
  const { parar, retomar } = useScroll();
  const abertoRef = useRef(false);
  const tituloAntes = useRef("");

  useImperativeHandle(ref, () => ({
    abrir(i, o) {
      if (aberto) return;
      devolverFoco.current = document.activeElement as HTMLElement | null;
      origem.current = o;
      pendente.current = { tipo: "abrir", st: Flip.getState(o), origem: o };
      abertoRef.current = true;
      // endereço próprio: dá para copiar e compartilhar; o voltar do navegador fecha
      tituloAntes.current = document.title;
      history.pushState({ detalhe: RELEASES[i].id }, "", `/releases/${RELEASES[i].id}/`);
      document.title = `${RELEASES[i].titulo} · reela music`;
      setIdx(i);
      setAberto(true);
    },
  }), [aberto]);

  const fechar = (peloNavegador = false) => {
    if (!abertoRef.current || !arte.current || !origem.current) return;
    abertoRef.current = false;
    pendente.current = { tipo: "fechar", st: Flip.getState(arte.current), origem: origem.current };
    document.title = tituloAntes.current;
    if (!peloNavegador && history.state?.detalhe) history.back();
    setAberto(false);
  };

  useLayoutEffect(() => {
    const pop = () => { if (abertoRef.current) fechar(true); };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  });

  // roda depois do DOM mudar e antes da pintura: o lugar certo para o Flip
  useLayoutEffect(() => {
    const p = pendente.current;
    if (!p) return;
    pendente.current = null;
    const mover = !calmo();
    if (p.tipo === "abrir") {
      parar();
      gsap.set(p.origem, { visibility: "hidden" });
      if (mover) {
        Flip.from(p.st, { targets: arte.current, duration: 0.95, ease: EASE, absolute: true, scale: true });
        gsap.fromTo(caixa.current!.querySelectorAll("[data-entra-det]"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, delay: 0.35, ease: "power2.out" });
        gsap.fromTo(caixa.current, { backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--ground"), duration: 0.5, clearProps: "backgroundColor" });
      }
      voltar.current?.focus({ preventScroll: true });
    } else {
      gsap.set(p.origem, { visibility: "visible" });
      if (mover) Flip.from(p.st, { targets: p.origem, duration: 0.8, ease: EASE, absolute: true, scale: true });
      retomar();
      devolverFoco.current?.focus({ preventScroll: true });
    }
  }, [aberto, parar, retomar]);

  // Esc fecha, Tab circula dentro do diálogo
  useLayoutEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); fechar(); return; }
      if (e.key !== "Tab" || !caixa.current) return;
      const f = [...caixa.current.querySelectorAll<HTMLElement>("a, button, iframe")];
      const [pri, ult] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  });

  // limpeza: se desmontar aberto, devolve a capa e o scroll
  useLayoutEffect(() => () => {
    if (origem.current) gsap.set(origem.current, { visibility: "visible" });
    retomar();
  }, [retomar]);

  const r = RELEASES[idx];
  return (
    <div ref={caixa} className={`${s.detalhe} ${grade}`} hidden={!aberto} role="dialog" aria-modal="true" aria-labelledby="d-tit">
      <button ref={voltar} className={s.voltar} type="button" onClick={() => fechar()}>voltar ao laço</button>
      {/* a caixa segura o lugar da capa: durante o Flip a arte fica absolute e o texto não pode escorregar */}
      <div className={lugarCapa}>
        <Arte r={r} ref={arte} data-flip-id={`capa-${r.id}`} sizes="(max-width: 760px) 70vw, 36vw" />
      </div>
      {/* o player só carrega com o detalhe aberto: nada do Spotify na página antes disso */}
      <ReleaseInfo r={r} player={aberto} idTitulo="d-tit" entra />
    </div>
  );
}

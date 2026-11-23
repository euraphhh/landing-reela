"use client";
/**
 * Detalhe do release: a capa voa do laço para cá com Flip e volta ao fechar.
 * Diálogo modal: foco no "voltar", foco preso, Esc fecha, Lenis parado.
 */
import { useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, EASE, calmo } from "@/lib/gsap";
import { RELEASES } from "@/data";
import { STREAMING } from "@/data/links";
import { Arte } from "@/components/Arte/Arte";
import { LinkDividido } from "@/components/LinkDividido/LinkDividido";
import { useScroll } from "@/components/providers/SmoothScroll";
import s from "./Detalhe.module.css";

export type DetalheHandle = { abrir: (i: number, origem: HTMLElement, card: HTMLElement) => void };

type Pendente =
  | { tipo: "abrir"; st: Flip.FlipState; origem: HTMLElement }
  | { tipo: "fechar"; st: Flip.FlipState; origem: HTMLElement }
  | null;

const PLATAFORMAS = STREAMING.filter((p) => p.id !== "tiktok");

/** open.spotify.com/…/album/<id> → player embutido */
const embed = (url?: string) => {
  const m = url?.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(album|track)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : null;
};

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

  useImperativeHandle(ref, () => ({
    abrir(i, o) {
      if (aberto) return;
      devolverFoco.current = document.activeElement as HTMLElement | null;
      origem.current = o;
      pendente.current = { tipo: "abrir", st: Flip.getState(o), origem: o };
      setIdx(i);
      setAberto(true);
    },
  }), [aberto]);

  const fechar = () => {
    if (!aberto || !arte.current || !origem.current) return;
    pendente.current = { tipo: "fechar", st: Flip.getState(arte.current), origem: origem.current };
    setAberto(false);
  };

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
    <div ref={caixa} className={s.detalhe} hidden={!aberto} role="dialog" aria-modal="true" aria-labelledby="d-tit">
      <button ref={voltar} className={s.voltar} type="button" onClick={fechar}>voltar ao laço</button>
      {/* a caixa segura o lugar da capa: durante o Flip a arte fica absolute e o texto não pode escorregar */}
      <div className={s.lugar}>
        <Arte r={r} ref={arte} className={s.arte} data-flip-id={`capa-${r.id}`} />
      </div>
      <div className={s.txt}>
        <span className="t-credit" data-entra-det>{r.num} · {r.quando}</span>
        <h2 className="t-display" id="d-tit" data-entra-det>{r.titulo}</h2>
        {r.artistas && <p className={s.artistas} data-entra-det>{r.artistas}</p>}
        <dl className="creditos" data-entra-det>
          {r.creditos.map((c) => (
            <div key={c.papel + c.nome} style={{ display: "contents" }}><dt>{c.papel}</dt><dd>{c.nome}</dd></div>
          ))}
        </dl>
        {(r.tipo || r.selo) && (
          <p className="t-caption" data-entra-det style={{ margin: 0 }}>
            {[r.tipo?.toLowerCase(), r.faixas && r.faixas > 1 ? `${r.faixas} faixas` : null, r.selo ? `℗ ${r.selo}` : null].filter(Boolean).join(" · ")}
          </p>
        )}
        {/* o player só carrega com o detalhe aberto: nada do Spotify na página antes disso */}
        {aberto && embed(r.links?.spotify) && (
          <iframe
            className={s.player} data-entra-det title={`ouvir ${r.titulo} no spotify`}
            src={embed(r.links?.spotify)!} loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
        <ul className={s.links} aria-label="ouvir este release" data-entra-det>
          {PLATAFORMAS.filter((p) => r.links?.[p.id]).map((p) => (
            <li key={p.id}><LinkDividido texto={p.nome} href={r.links![p.id]!} className={s.sl} /></li>
          ))}
          {r.versoes?.filter((v) => v.spotify).map((v) => (
            <li key={v.nome}><LinkDividido texto={v.nome} href={v.spotify!} className={s.sl} /></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

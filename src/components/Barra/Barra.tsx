"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, calmo } from "@/lib/gsap";
import { Simbolo } from "@/components/marca/Simbolo";
import { useAncora, useScroll } from "@/components/providers/SmoothScroll";
import { LiquidToggle } from "@/components/LiquidToggle/LiquidToggle";
import { usePulso } from "@/hooks/usePulso";
import { EV, ouvir } from "@/lib/eventos";
import { tocaEntrada, liberarEntrada } from "@/lib/entrada";
import s from "./Barra.module.css";

const LINKS = [
  { href: "/#releases", rot: "destaques" },
  { href: "/#people", rot: "quem passou" },
  { href: "/#label", rot: "o selo" },
  { href: "/story/", rot: "história" },
  { href: "/how-it-works/", rot: "como funciona" },
];

/** o laço da barra se desenha e o ponto cai no centro */
function entrada(el: Element) {
  const tl = gsap.timeline();
  tl.fromTo(el.querySelectorAll(".laco"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, ease: "power2.inOut" }, 0);
  el.querySelectorAll<SVGCircleElement>(".ponto").forEach((p) => {
    const r = Number(p.dataset.r ?? 20);
    tl.fromTo(p, { attr: { cy: -12, r: r / 2 }, opacity: 0 }, { attr: { cy: 50, r }, opacity: 1, duration: 0.7, ease: "power2.out" }, 0.9);
  });
  return tl;
}

export function Barra() {
  const barra = useRef<HTMLElement>(null);
  const lockup = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  // a placa só existe sobre o wordmark gigante; páginas sem ele (release) nunca ligam
  const [naMarca, setNaMarca] = useState(false);
  const [pronta, setPronta] = useState(false);
  const ancora = useAncora();
  const { parar, retomar } = useScroll();
  usePulso(lockup);

  useGSAP(
    () => {
      // a placa atrás da barra só existe enquanto o wordmark gigante está embaixo dela
      const marca = document.getElementById("marca");
      if (marca && barra.current) {
        const b = barra.current;
        ScrollTrigger.create({
          trigger: marca,
          start: "top top",
          end: () => `bottom ${b.offsetHeight}px`,
          onToggle: (st) => setNaMarca(st.isActive),
          onRefresh: (st) => setNaMarca(st.isActive || window.scrollY < marca.getBoundingClientRect().bottom),
        });
        setNaMarca(marca.getBoundingClientRect().bottom > b.offsetHeight);
      }
      setPronta(true);
      if (calmo() || !lockup.current) return;
      const el = lockup.current;
      // a entrada toca uma vez por visita, não a cada página; o replay do fim toca de novo de propósito
      if (tocaEntrada()) { entrada(el); if (!document.getElementById("top")) liberarEntrada(); }
      return ouvir(EV.entrada, () => entrada(el));
    },
    { scope: barra }
  );

  // menu: Lenis para, foco preso, Esc fecha
  useEffect(() => {
    if (!menuAberto) return;
    parar();
    const m = menuRef.current!;
    m.querySelector<HTMLElement>("button, a")?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setMenuAberto(false); return; }
      if (e.key !== "Tab") return;
      const f = [...m.querySelectorAll<HTMLElement>("button, a")];
      const [pri, ult] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("keydown", tecla);
      retomar();
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [menuAberto, parar, retomar]);

  const irMenu = (e: React.MouseEvent<HTMLAnchorElement>) => { setMenuAberto(false); ancora(e); };

  return (
    <>
      <header ref={barra} className={`${s.barra} ${naMarca ? s.naMarca : ""}`} data-placa={pronta ? (naMarca ? "on" : "off") : undefined}>
        <a ref={lockup} className={s.lockup} href="/#top" aria-label="reela music, voltar ao início" onClick={ancora}>
          <Simbolo variante="animavel" />
        </a>
        <nav className={s.nav} aria-label="principal">
          {LINKS.map((l) => (
            <a key={l.href} className={s.lnk} href={l.href} onClick={ancora}>{l.rot}</a>
          ))}
          <LiquidToggle className={s.toggle} />
          <button ref={menuBtn} className={s.menuBtn} type="button" aria-expanded={menuAberto} aria-controls="menu" onClick={() => setMenuAberto(true)}>
            menu
          </button>
        </nav>
      </header>

      <div ref={menuRef} id="menu" className={s.menu} hidden={!menuAberto} role="dialog" aria-modal="true" aria-label="menu">
        <button className={s.fechar} type="button" onClick={() => setMenuAberto(false)}>fechar</button>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={irMenu}>{l.rot}</a>
        ))}
        <a href="/#label" onClick={irMenu}>contato</a>
      </div>
    </>
  );
}

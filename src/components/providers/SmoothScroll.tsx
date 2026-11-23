"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, calmo } from "@/lib/gsap";

type Alvo = string | HTMLElement | number;
type Ctx = {
  ir: (alvo: Alvo, opts?: { duration?: number; easing?: (t: number) => number; onComplete?: () => void }) => void;
  parar: () => void;
  retomar: () => void;
};

const ScrollCtx = createContext<Ctx>({ ir: () => {}, parar: () => {}, retomar: () => {} });
export const useScroll = () => useContext(ScrollCtx);

/** Lenis no ticker do GSAP, avisando o ScrollTrigger. Em reduced motion: scroll nativo. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (calmo()) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  const ir = useCallback<Ctx["ir"]>((alvo, opts = {}) => {
    const el = typeof alvo === "string" ? document.querySelector<HTMLElement>(alvo) : alvo;
    if (el == null) return;
    if (lenis.current) {
      lenis.current.scrollTo(el, { duration: opts.duration ?? 1.6, easing: opts.easing, onComplete: () => opts.onComplete?.() });
    } else {
      if (typeof el === "number") window.scrollTo(0, el);
      else el.scrollIntoView();
      opts.onComplete?.();
    }
  }, []);

  const valor = useMemo<Ctx>(
    () => ({ ir, parar: () => lenis.current?.stop(), retomar: () => lenis.current?.start() }),
    [ir]
  );

  return <ScrollCtx.Provider value={valor}>{children}</ScrollCtx.Provider>;
}

/** clique em link de âncora: rola suave e leva o foco para a seção */
export function useAncora() {
  const { ir } = useScroll();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, depois?: () => void) => {
      const href = e.currentTarget.getAttribute("href") ?? "";
      if (!href.startsWith("#") || href.length < 2) return;
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;
      e.preventDefault();
      ir(el, {
        onComplete: () => {
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
          history.replaceState(null, "", href);
          depois?.();
        },
      });
    },
    [ir]
  );
}

"use client";
/** o símbolo do topo da /links: o laço se desenha e o ponto cai, como na entrada do site */
import { useRef } from "react";
import { gsap, useGSAP, calmo } from "@/lib/gsap";
import { Simbolo } from "@/components/marca/Simbolo";

export function LacoTopo({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (calmo()) return;
    const el = ref.current!;
    const tl = gsap.timeline();
    tl.fromTo(el.querySelectorAll(".laco"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.3, ease: "power2.inOut" }, 0);
    el.querySelectorAll<SVGCircleElement>(".ponto").forEach((p) => {
      const r = Number(p.dataset.r ?? 20);
      tl.fromTo(p, { attr: { cy: -12, r: r / 2 }, opacity: 0 }, { attr: { cy: 50, r }, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.85);
    });
  }, { scope: ref });
  return <div ref={ref} className={className}><Simbolo variante="animavel" titulo="reela music" /></div>;
}

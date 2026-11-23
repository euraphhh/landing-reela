"use client";
import { useEffect, useRef } from "react";
import { ScrollTrigger, calmo } from "@/lib/gsap";
import { EV, ouvir } from "@/lib/eventos";

/**
 * Slot do vídeo P&B da faixa. Por enquanto, um filme em canvas:
 * luz de carro passando no teto às 3h. Pausa fora da tela e com a aba escondida.
 */
export function Filme({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!, fx = cv.getContext("2d")!;
    let fw = 0, fh = 0, ink = "#ffffff", ground = "#000000", raf = 0, visivel = true;
    const t0 = performance.now();

    const cores = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = hex6(cs.getPropertyValue("--ink").trim() || ink);
      ground = hex6(cs.getPropertyValue("--ground").trim() || ground);
    };
    const tamanho = () => {
      const r = cv.getBoundingClientRect();
      fw = cv.width = Math.max(1, Math.round(r.width * 0.5));
      fh = cv.height = Math.max(1, Math.round(r.height * 0.5));
    };
    // normaliza qualquer cor CSS (#fff, #ffffff, rgb()) para #rrggbb via o próprio canvas
    const hex6 = (c: string) => { fx.fillStyle = "#000000"; fx.fillStyle = c; return String(fx.fillStyle); };
    const rgba = (cor: string, a: number) => {
      const v = parseInt(cor.slice(1), 16);
      return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
    };
    const desenhar = (now: number) => {
      const t = (now - t0) / 1000;
      fx.fillStyle = ground; fx.fillRect(0, 0, fw, fh);
      for (const [bx, by, br, a, sp] of [[0.72, 0.38, 0.55, 0.1, 0.07], [0.2, 0.75, 0.45, 0.07, 0.05], [0.55, 0.85, 0.35, 0.06, 0.09]]) {
        const x = fw * (bx + Math.sin(t * sp * 2) * 0.06), y = fh * (by + Math.cos(t * sp * 1.6) * 0.05), r = Math.max(fw, fh) * br;
        const g = fx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(ink, a)); g.addColorStop(1, rgba(ink, 0));
        fx.fillStyle = g; fx.fillRect(0, 0, fw, fh);
      }
      // a faixa de farol: atravessa a cada 9s, em diagonal
      const cyc = (t % 9) / 9;
      if (cyc < 0.42) {
        const p = cyc / 0.42, e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        fx.save(); fx.translate(-fw * 0.6 + e * fw * 2.2, 0); fx.rotate(-0.32);
        const g = fx.createLinearGradient(-fw * 0.12, 0, fw * 0.12, 0);
        g.addColorStop(0, rgba(ink, 0)); g.addColorStop(0.5, rgba(ink, 0.16 * Math.sin(p * Math.PI))); g.addColorStop(1, rgba(ink, 0));
        fx.fillStyle = g; fx.fillRect(-fw * 0.12, -fh, fw * 0.24, fh * 3); fx.restore();
      }
      const v = fx.createRadialGradient(fw * 0.5, fh * 0.45, Math.min(fw, fh) * 0.2, fw * 0.5, fh * 0.5, Math.max(fw, fh) * 0.75);
      v.addColorStop(0, rgba(ground, 0)); v.addColorStop(1, rgba(ground, 0.75)); fx.fillStyle = v; fx.fillRect(0, 0, fw, fh);
    };
    const parado = calmo();
    const loop = (now: number) => {
      if (visivel && !document.hidden) desenhar(now);
      raf = requestAnimationFrame(loop);
    };

    cores(); tamanho();
    if (parado) desenhar(t0 + 2500); else raf = requestAnimationFrame(loop);

    const st = ScrollTrigger.create({ trigger: cv, start: "top bottom", end: "bottom top", onToggle: (s) => (visivel = s.isActive) });
    const ro = new ResizeObserver(() => { tamanho(); if (parado) desenhar(t0 + 2500); });
    ro.observe(cv);
    const offTema = ouvir(EV.tema, () => { cores(); if (parado) desenhar(t0 + 2500); });

    return () => { cancelAnimationFrame(raf); st.kill(); ro.disconnect(); offTema(); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

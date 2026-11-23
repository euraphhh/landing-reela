"use client";
/** Image trail: passando o mouse sobre um nome, as capas dos lançamentos da pessoa ficam no rastro do cursor. */
import { useRef } from "react";
import { gsap, useGSAP, calmo } from "@/lib/gsap";
import { ARTISTAS, RELEASES } from "@/data";
import s from "./ImageTrail.module.css";

const capasDe = (nome: string) =>
  RELEASES.filter((r) => r.capa && (r.artistas.split(", ").includes(nome) || r.creditos.some((c) => c.nome.split(", ").includes(nome)))).map((r) => r.capa!);
const GENTE = ARTISTAS.slice(0, 7).map((a) => ({ ...a, capas: capasDe(a.nome) })).filter((a) => a.capas.length);
const POOL = 12;

export function ImageTrail() {
  const area = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(() => {
    if (calmo()) return;
    const el = area.current!;
    let k = 0, z = 1, ultimo = { x: -999, y: -999 };
    const conta = new Map<string, number>();
    const mover = (e: PointerEvent) => {
      const linha = (e.target as HTMLElement).closest<HTMLElement>("[data-nome]");
      if (!linha) return;
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - ultimo.x, y - ultimo.y) < 70) return;
      ultimo = { x, y };
      const nome = linha.dataset.nome!, capas = GENTE.find((g) => g.nome === nome)!.capas;
      const n = conta.get(nome) ?? 0; conta.set(nome, n + 1);
      const img = imgs.current[k++ % POOL]!;
      img.src = capas[n % capas.length];
      gsap.killTweensOf(img);
      gsap.set(img, { x, y, xPercent: -50, yPercent: -50, zIndex: z++, opacity: 1, scale: 0.6, rotation: gsap.utils.random(-8, 8) });
      gsap.to(img, { scale: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(img, { opacity: 0, scale: 0.8, duration: 0.5, delay: 0.6, ease: "power2.in" });
    };
    el.addEventListener("pointermove", mover);
    return () => el.removeEventListener("pointermove", mover);
  }, { scope: area });

  return (
    <div ref={area} className={s.area}>
      {Array.from({ length: POOL }, (_, i) => (
        <img key={i} ref={(e) => { imgs.current[i] = e; }} className={s.img} alt="" aria-hidden="true" />
      ))}
      <ul className={s.lista}>
        {GENTE.map((g) => (
          <li key={g.nome} data-nome={g.nome}><span>{g.nome}</span><span className="t-credit">{g.capas.length} {g.capas.length > 1 ? "capas" : "capa"}</span></li>
        ))}
      </ul>
    </div>
  );
}

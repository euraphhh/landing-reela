"use client";
/**
 * Quem passou: os laços da lista vêm sem o ponto. Uma bolinha só viaja entre eles:
 * ao rolar, ela desce para a linha que está no meio da tela; no hover/foco, vai para a linha apontada.
 */
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, EASE, calmo } from "@/lib/gsap";
import { ARTISTAS, RELEASES } from "@/data";
import { Simbolo } from "@/components/marca/Simbolo";
import { useAncora } from "@/components/providers/SmoothScroll";
import { EV, emitir } from "@/lib/eventos";
import s from "./QuemPassou.module.css";

/** o lançamento mais recente com esse nome (artista ou crédito), de preferência um destaque do laço */
const primeiroDe = (nome: string) => {
  const dele = RELEASES.filter((r) => r.artistas.split(", ").includes(nome) || r.creditos.some((c) => c.nome.split(", ").includes(nome)));
  return dele.find((r) => r.destaque) ?? dele[0];
};

const rotulo = (n: number) => `${n} ${n > 1 ? "lançamentos" : "lançamento"}`;

export function QuemPassou() {
  const sec = useRef<HTMLElement>(null);
  const rol = useRef<HTMLUListElement>(null);
  const bola = useRef<HTMLSpanElement>(null);
  const ancora = useAncora();
  const api = useRef<{ mirar: (i: number, hover: boolean) => void; soltar: () => void }>({ mirar: () => {}, soltar: () => {} });

  useGSAP(
    () => {
      const ul = rol.current!, b = bola.current!;
      const linhas = [...ul.querySelectorAll<HTMLAnchorElement>(":scope > li > a")];
      let doScroll = 0, atual = -1, visivel = false;

      // centro do laço da linha i, relativo à lista. o ponto tem 40% do diâmetro do símbolo.
      const alvo = (i: number) => {
        const sym = linhas[i].querySelector<SVGElement>(".sym")!;
        const rs = sym.getBoundingClientRect(), ru = ul.getBoundingClientRect();
        return { x: rs.left - ru.left + rs.width / 2, y: rs.top - ru.top + rs.height / 2, d: rs.width * 0.4 };
      };
      const ir = (i: number, hover: boolean, instantaneo = false) => {
        const { x, y, d } = alvo(i);
        linhas.forEach((l, j) => l.toggleAttribute("data-bola", j === i));
        b.classList.toggle(s.bolaInvertida, hover);
        const dur = calmo() || instantaneo ? 0 : 0.6;
        if (!visivel) {
          // primeira vez: o ponto cai no centro do laço, como na entrada da marca
          visivel = true;
          gsap.set(b, { x, width: d, height: d, xPercent: -50, yPercent: -50 });
          gsap.fromTo(b, { y: y - d * 2, opacity: 0, scale: 0.5 }, { y, opacity: 1, scale: 1, duration: calmo() ? 0 : 0.55, ease: "power2.out" });
        } else {
          gsap.to(b, { x, y, width: d, height: d, duration: dur, ease: EASE, overwrite: "auto" });
        }
        atual = i;
      };
      api.current = {
        mirar: (i, hover) => ir(i, hover),
        soltar: () => ir(doScroll, false),
      };

      // a linha no meio da tela leva a bolinha
      linhas.forEach((l, i) => {
        ScrollTrigger.create({
          trigger: l, start: "top 55%", end: "bottom 55%",
          onToggle: (st) => { if (st.isActive) { doScroll = i; if (!ul.matches(":hover")) ir(i, false); } },
        });
      });
      // ao entrar na lista vinda de cima, mostra na primeira; reposiciona no resize
      ScrollTrigger.create({ trigger: ul, start: "top 60%", onEnter: () => { if (atual < 0) ir(0, false); } });
      const ro = new ResizeObserver(() => { if (atual >= 0) ir(atual, b.classList.contains(s.bolaInvertida), true); });
      ro.observe(ul);
      return () => ro.disconnect();
    },
    { scope: sec }
  );

  return (
    <section ref={sec} className={s.gente} id="gente" aria-labelledby="gente-h">
      <div className={s.cab}>
        <h2 className="t-display" id="gente-h">quem passou<br />por aqui.</h2>
        <p>gente que gravou, cantou ou produziu com a reela. do coletivo até agora.</p>
      </div>
      <ul ref={rol} className={s.rol} onPointerLeave={() => api.current.soltar()}>
        {ARTISTAS.map((a, idx) => {
          const r = primeiroDe(a.nome);
          // página própria > gira o laço até um destaque > página do release
          const href = a.pagina ? `/gente/${a.slug}/` : r?.destaque ? "#releases" : `/releases/${r?.id}/`;
          const noLaco = !a.pagina && r?.destaque;
          return (
            <li key={a.nome}>
              <a
                href={href}
                onPointerEnter={() => api.current.mirar(idx, true)}
                onFocus={() => api.current.mirar(idx, true)}
                onBlur={() => api.current.soltar()}
                onClick={noLaco ? (e) => ancora(e, () => emitir(EV.release, r!.id)) : undefined}
                aria-label={`${a.nome}${a.papel ? `, ${a.papel}` : ""}, ${rotulo(a.faixas)}. ${a.pagina ? "ver página" : noLaco ? "ver no laço" : "ver lançamento"}`}
              >
                <Simbolo variante="anel" className={s.mini} />
                <span className={s.nome}>{a.nome}</span>
                <span className="t-caption">{a.papel}</span>
                <span className="t-credit">{rotulo(a.faixas)}</span>
              </a>
            </li>
          );
        })}
        <span ref={bola} className={s.bola} aria-hidden="true" />
      </ul>
    </section>
  );
}

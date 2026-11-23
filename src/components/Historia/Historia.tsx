"use client";
/**
 * /story/: a história da reela contada pelos lançamentos, como narrativa de rolagem.
 * - o laço fica fixo na lateral e se desenha com a página inteira; o ponto só cai no fim ("o laço não fecha")
 * - cada ano é um capítulo que trava na tela: o ano entra, o texto acende, as capas passam na horizontal
 * - os números contam quando entram; o fim revela a frase letra por letra
 * Texto: fatos dos dados + o que estiver em docs/dados/historia.json (vazio = não aparece).
 * Reduced motion: sem trava nem scrub; tudo empilhado e visível.
 */
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText, calmo } from "@/lib/gsap";
import { ARTISTAS, RELEASES } from "@/data";
import historia from "../../../docs/dados/historia.json";
import { EMAIL_HREF } from "@/data/links";
import { Arte } from "@/components/Arte/Arte";
import { Simbolo } from "@/components/marca/Simbolo";
import s from "./Historia.module.css";

const lista = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs.at(-1)}`);
const anoDe = (id: string) => RELEASES.find((r) => r.id === id)?.ano ?? "9999";

const ANOS = [...new Set(RELEASES.map((r) => r.ano!).filter(Boolean))].sort();
const CAPITULOS = ANOS.map((ano) => {
  const rels = RELEASES.filter((r) => r.ano === ano).reverse(); // dentro do ano, do mais antigo pro mais novo
  const novos = ARTISTAS.filter((a) => a.lancamentos.map((l) => anoDe(l.id)).sort()[0] === ano).map((a) => a.nome);
  // "REELA Music / REELA Studio" e "REELA Music GRAVACAO" viram nomes limpos, sem repetir
  const selos = [...new Set(rels.flatMap((r) => (r.selo ?? "").split(" / ")).map((x) => x.replace(/\s+GRAVA[CÇ][AÃ]O$/i, "").trim()).filter(Boolean))];
  const n = rels.length;
  const fatos = [
    `${n} ${n > 1 ? "lançamentos" : "lançamento"}${selos.length ? `, com ℗ ${lista(selos)}` : ""}.`.replace(/\.\.$/, "."), // "nevermind." já termina em ponto
    // até 6 nomes; passando disso, "a, b, c, d, e, f e mais 3" (sem "e" repetido)
    novos.length ? `${novos.length > 1 ? "chegam" : "chega"} ${novos.length > 6 ? `${novos.slice(0, 6).join(", ")} e mais ${novos.length - 6}` : lista(novos)}.` : "",
  ].filter(Boolean);
  const texto = (historia.anos as Record<string, string>)[ano] ?? "";
  return { ano, rels, fatos, texto };
});
const PLAYS = RELEASES.reduce((t, r) => t + (r.plays ?? 0), 0);
const NUMEROS = [
  { v: RELEASES.length, rot: "lançamentos" },
  { v: ARTISTAS.length, rot: "pessoas que passaram" },
  { v: ANOS.length, rot: "anos de madrugada" },
  { v: Math.floor(PLAYS / 1000), suf: " mil+", rot: "plays públicos no spotify*" },
];

export function Historia() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = raiz.current!;
      if (calmo()) { el.classList.add(s.parado); return; }

      // o fio: o laço se desenha com a página inteira; o ponto cai só no fim
      gsap.fromTo(el.querySelectorAll("[data-fio] .laco"), { drawSVG: "0%" }, {
        drawSVG: "100%", ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      el.querySelectorAll<SVGCircleElement>("[data-fio] .ponto").forEach((p) => {
        const r = Number(p.dataset.r ?? 20);
        gsap.fromTo(p, { attr: { cy: -14, r: r / 2 }, opacity: 0 }, {
          attr: { cy: 50, r }, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: el.querySelector("[data-fim]"), start: "top 70%", end: "top 30%", scrub: 0.6 },
        });
      });

      // abertura: as linhas sobem
      const abre = new SplitText(el.querySelector("[data-abre]")!, { type: "lines", mask: "lines" });
      gsap.from(abre.lines, { yPercent: 105, duration: 1.1, stagger: 0.1, ease: "power3.out", delay: 0.2 });

      // capítulos: trava, ano entra, texto acende, capas passam
      el.querySelectorAll<HTMLElement>("[data-capitulo]").forEach((cap) => {
        const faixa = cap.querySelector<HTMLElement>("[data-faixa]")!;
        const dist = () => Math.max(0, faixa.scrollWidth - faixa.clientWidth);
        // entra assim que o capítulo aparece (sem vão escuro antes da trava)
        gsap.timeline({ scrollTrigger: { trigger: cap, start: "top 80%", end: "top 15%", scrub: 0.6 } })
          .from(cap.querySelector("[data-ano]"), { yPercent: 40, opacity: 0, duration: 0.5, ease: "power3.out" })
          .from(cap.querySelectorAll("[data-fato]"), { y: 24, opacity: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.3")
          .from(faixa.children, { y: 40, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }, "-=0.3");
        // trava só para as capas passarem na horizontal (quando sobram capas fora da tela)
        if (dist() > 8) {
          gsap.to(faixa, {
            x: () => -dist(), ease: "none",
            scrollTrigger: { trigger: cap, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
          });
        }
      });

      // números contam quando entram
      el.querySelectorAll<HTMLElement>("[data-conta]").forEach((dd) => {
        const alvo = Number(dd.dataset.conta), suf = dd.dataset.suf ?? "", o = { v: 0 };
        gsap.to(o, {
          v: alvo, duration: 1.6, ease: "power2.out", snap: { v: 1 },
          onUpdate: () => { dd.textContent = `${o.v}${suf}`; },
          scrollTrigger: { trigger: dd, start: "top 85%", once: true },
        });
      });

      // fim: a frase se revela letra por letra com a descida
      const fim = new SplitText(el.querySelector("[data-fim] h2")!, { type: "words,chars" });
      gsap.from(fim.chars, {
        opacity: 0.12, stagger: 0.04, ease: "none",
        scrollTrigger: { trigger: el.querySelector("[data-fim]"), start: "top 75%", end: "top 25%", scrub: true },
      });

      ScrollTrigger.refresh();
      return () => { abre.revert(); fim.revert(); };
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} className={s.historia}>
      <div className={s.fio} data-fio aria-hidden="true"><Simbolo variante="animavel" /></div>

      <header className={s.abertura}>
        <span className="t-credit">a história da reela</span>
        <h1 className="t-display" data-abre>de {ANOS[0]} até agora,<br />contada pelo que saiu.</h1>
        {historia.intro && <p className={s.intro}>{historia.intro}</p>}
        <span className={`${s.desce} t-caption`} aria-hidden="true">desce ↓</span>
      </header>

      {CAPITULOS.map((c) => (
        <section key={c.ano} className={s.capitulo} data-capitulo aria-labelledby={`h-${c.ano}`}>
          <div className={s.cabCap}>
            <h2 className={s.ano} id={`h-${c.ano}`} data-ano>{c.ano}</h2>
            <div className={s.fatos}>
              {c.texto && <p className={s.texto} data-fato>{c.texto}</p>}
              {c.fatos.map((f) => <p key={f} className="t-caption" data-fato>{f}</p>)}
            </div>
          </div>
          <ul className={s.faixa} data-faixa>
            {c.rels.map((r) => (
              <li key={r.id}>
                <a href={`/releases/${r.id}/`} className={s.card}>
                  <Arte r={r} sizes="(max-width: 760px) 60vw, 280px" />
                  <span className="t-credit">{r.num} · {r.tipo?.toLowerCase()}</span>
                  <strong>{r.titulo}</strong>
                  {r.artistas && <span className="t-caption">{r.artistas}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className={s.numeros} aria-labelledby="h-numeros">
        <h2 className="t-credit" id="h-numeros">até aqui</h2>
        <dl>
          {NUMEROS.map((n) => (
            <div key={n.rot}><dt>{n.rot}</dt><dd data-conta={n.v} data-suf={n.suf ?? ""}>{n.v}{n.suf ?? ""}</dd></div>
          ))}
        </dl>
        <p className="t-caption">* soma das faixas populares no Spotify. é um piso: o total real é maior.</p>
      </section>

      <section className={s.fim} data-fim aria-labelledby="h-fim">
        <h2 className="t-display" id="h-fim">o laço não fecha.</h2>
        {historia.fim && <p className={s.intro}>{historia.fim}</p>}
        <p className="t-caption">a próxima faixa pode ser a sua.</p>
        <div className={s.acoes}>
          <a className="btn btn-1" href={EMAIL_HREF}>mandar faixa</a>
          <a className="btn btn-2" href="/releases/">todos os lançamentos</a>
        </div>
      </section>
    </div>
  );
}

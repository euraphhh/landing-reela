"use client";
/**
 * /story/: a história da reela é uma madrugada.
 * A página começa preta às 00:00 e termina branca no amanhecer (2026, a volta). Um relógio anda com a rolagem.
 * Cenas travadas na tela (pin + scrub):
 *  - abertura: 30.11.2021, as letras de VLONE se juntam do caos
 *  - cada ano: o ano gira como hodômetro; as capas vêm da profundidade e passam por você
 *  - 2023: a formação agenciada acende nome por nome
 *  - 2025: "reela" se embaralha em "nevermind." e volta; depois o hiato (tela vazia, só o relógio)
 *  - 2026: persianas abrem a volta; amanhece
 *  - fim: números e "de novo, até amanhecer."
 * Texto: docs/dados/historia.json + fatos dos dados. Reduced motion: nada trava; tudo empilhado e legível.
 */
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, calmo } from "@/lib/gsap";
import { ARTISTAS, RELEASES } from "@/data";
import historia from "../../../docs/dados/historia.json";
import { EMAIL_HREF } from "@/data/links";
import { Arte } from "@/components/Arte/Arte";
import { Simbolo } from "@/components/marca/Simbolo";
import { Rodape } from "@/components/Casca/Casca";
import s from "./Historia.module.css";

const lista = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs.at(-1)}`);
const textos = historia.anos as Record<string, string>;
const ANOS = [...new Set([...RELEASES.map((r) => r.ano!).filter(Boolean), ...Object.keys(textos).filter((k) => textos[k])])].sort();
const AGENCIADOS = ARTISTAS.filter((a) => a.agenciado).map((a) => a.nome);

const CAPITULOS = ANOS.map((ano, i) => {
  const rels = RELEASES.filter((r) => r.ano === ano).reverse();
  const selos = [...new Set(rels.flatMap((r) => (r.selo ?? "").split(" / ")).map((x) => x.replace(/\s+GRAVA[CÇ][AÃ]O$/i, "").trim()).filter(Boolean))];
  const n = rels.length;
  const fato = n ? `${n} ${n > 1 ? "lançamentos" : "lançamento"}${selos.length ? ` · ℗ ${lista(selos)}` : ""}` : "";
  return { ano, antes: ANOS[i - 1] ?? String(Number(ano) - 1), rels, fato, texto: textos[ano] ?? "" };
});
const PLAYS = RELEASES.reduce((t, r) => t + (r.plays ?? 0), 0);
const NUMEROS = [
  { v: RELEASES.length, rot: "lançamentos" },
  { v: AGENCIADOS.length, rot: "artistas agenciados" },
  { v: ARTISTAS.length, rot: "pessoas nos créditos" },
  { v: Math.floor(PLAYS / 1000), suf: " mil+", rot: "plays públicos no spotify*" },
];
const VOLTA = RELEASES.find((r) => r.ano === ANOS.at(-1)) ?? RELEASES[0];

/** hodômetro: uma coluna de 0–9 por dígito */
function Odometro({ ano }: { ano: string }) {
  return (
    <span className={s.odo} aria-hidden="true">
      {ano.split("").map((d, i) => (
        <span key={i} className={s.odoCol}>
          <span className={s.odoFita} data-fita data-digito={d} style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {"0123456789".split("").map((x) => <span key={x}>{x}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}

/** embaralha de `de` para `para` conforme p (0–1), estável para o mesmo p */
const RUIDO = "reelanvmd.#/*_";
function embaralhar(de: string, para: string, p: number) {
  const len = Math.round(de.length + (para.length - de.length) * p);
  let out = "";
  for (let i = 0; i < len; i++) {
    const limiar = i / Math.max(len, 1);
    if (p >= 0.98 || limiar < p - 0.25) out += para[i] ?? "";
    else if (limiar < p + 0.15) out += RUIDO[(i * 7 + Math.floor(p * 40)) % RUIDO.length];
    else out += de[i] ?? RUIDO[i % RUIDO.length];
  }
  return out;
}

export function Historia() {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = raiz.current!;
      if (calmo()) { el.classList.add(s.parado); return; }
      const $ = <T extends Element = HTMLElement>(q: string, r: ParentNode = el) => r.querySelector<T>(q)!;
      const $$ = <T extends Element = HTMLElement>(q: string, r: ParentNode = el) => [...r.querySelectorAll<T>(q)];

      // ---- abertura: as letras de VLONE saem do caos e se juntam
      const letras = $$("[data-vlone] span");
      gsap.timeline({ scrollTrigger: { trigger: $("[data-abre]"), start: "top top", end: "+=140%", pin: true, scrub: 0.8 } })
        .from(letras, {
          x: () => gsap.utils.random(-45, 45) + "vw", y: () => gsap.utils.random(-40, 40) + "vh",
          rotation: () => gsap.utils.random(-70, 70), opacity: 0, scale: 0.4, stagger: 0.06, ease: "power3.out", duration: 1,
        })
        .from($$("[data-abre] [data-sobe]"), { y: 30, opacity: 0, stagger: 0.15, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .to({}, { duration: 0.6 });

      // ---- capítulos
      $$("[data-cap]").forEach((cap) => {
        const palco = $("[data-palco]", cap);
        const cards = $$("[data-card]", cap);
        const extra = cap.dataset.extra ?? "";
        // entrada: enquanto o capítulo sobe, o ano gira (hodômetro) e o texto entra; quando trava, já está pronto
        const entrada = gsap.timeline({ scrollTrigger: { trigger: cap, start: "top 85%", end: "top 5%", scrub: 0.6 } });
        const fitas = $$("[data-fita]", cap);
        const antes = (cap.dataset.antes ?? "").split("");
        fitas.forEach((f, i) => {
          f.style.transform = ""; // a posição do HTML (sem JS) sai; daqui em diante só o GSAP move a fita
          entrada.fromTo(f, { yPercent: -10 * Number(antes[i] ?? f.dataset.digito) }, { yPercent: -10 * Number(f.dataset.digito), duration: 0.7, ease: "power3.inOut" }, i * 0.05);
        });
        entrada.from($$("[data-linha]", cap), { y: 26, opacity: 0, stagger: 0.12, duration: 0.45, ease: "power2.out" }, 0.4);

        // trava só quando há o que mostrar (capas ou cena especial); capítulo só de texto não trava
        const passos = cards.length * 0.55 + (extra === "formacao" ? 1.4 : extra === "nevermind" ? 2.6 : 0);
        if (!passos) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: cap, start: "top top", end: `+=${(passos + 0.4) * 100}%`, pin: palco, scrub: 0.8, anticipatePin: 1 } });

        // as capas vêm da profundidade, param na frente e passam por você
        cards.forEach((c, i) => {
          const lado = (i % 2 ? 1 : -1) * gsap.utils.random(8, 22);
          const t0 = i * 0.55;
          tl.fromTo(c, { z: -2400, xPercent: -50, yPercent: -50, x: `${lado * 1.6}vw`, opacity: 0, rotationY: lado * 0.8 },
            { z: 0, x: `${lado}vw`, opacity: 1, rotationY: 0, duration: 0.6, ease: "power2.out" }, t0)
            .to(c, { z: 900, opacity: 0, duration: 0.5, ease: "power2.in" }, t0 + 0.75);
        });

        // 2023: a formação acende nome por nome
        if (extra === "formacao") {
          const nomes = $$("[data-nome]", cap);
          tl.fromTo($("[data-formacao]", cap), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, ">-0.2")
            .from(nomes, { yPercent: 60, opacity: 0, stagger: 0.18, duration: 0.4, ease: "power3.out" }, ">")
            .to(nomes, { opacity: 0.2, stagger: 0.1, duration: 0.3 }, ">0.3");
        }

        // 2025: reela vira nevermind. e volta; depois o hiato
        if (extra === "nevermind") {
          const palavra = $("[data-palavra]", cap), o = { p: 0 };
          const escreve = () => { palavra.textContent = embaralhar("reela", "nevermind.", o.p); };
          tl.fromTo($("[data-renome]", cap), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, ">-0.2")
            .to(o, { p: 1, duration: 0.8, ease: "none", onUpdate: escreve }, ">")
            .from($("[data-renome-nota]", cap), { opacity: 0, y: 16, duration: 0.3 }, ">-0.1")
            .to(o, { p: 0, duration: 0.8, ease: "none", onUpdate: escreve }, ">0.3")
            .to($("[data-renome]", cap), { autoAlpha: 0, duration: 0.3 }, ">0.1")
            .fromTo($("[data-hiato]", cap), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">");
        }
      });

      // ---- 2026: persianas abrem a volta
      const volta = $("[data-volta]");
      gsap.timeline({ scrollTrigger: { trigger: volta, start: "top top", end: "+=160%", pin: true, scrub: 0.8 } })
        .to($$("[data-persiana]", volta), { scaleY: 0, duration: 1, stagger: { each: 0.06, from: "center" }, ease: "power3.inOut" })
        .from($("[data-volta-capa]", volta), { scale: 1.25, duration: 1.2, ease: "power2.out" }, 0)
        .from($$("[data-linha]", volta), { y: 30, opacity: 0, stagger: 0.12, duration: 0.5, ease: "power2.out" }, 0.7);

      // ---- criados DEPOIS das cenas travadas: as posições contam o espaço das travas
      // (criados antes, o amanhecer e o relógio chegavam cedo demais)

      // a madrugada: relógio e o laço andam com a página inteira
      const hora = $("[data-hora]"), fase = $("[data-fase]");
      ScrollTrigger.create({
        trigger: el, start: "top top", end: "bottom bottom",
        onUpdate: (st) => {
          const min = Math.round(st.progress * 352); // 00:00 → 05:52
          hora.textContent = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
          fase.textContent = st.progress > 0.86 ? "amanhecer" : "madrugada";
        },
      });
      gsap.fromTo($$("[data-fio] .laco"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } });
      $$<SVGCircleElement>("[data-fio] .ponto").forEach((p) => {
        const r = Number(p.dataset.r ?? 20);
        gsap.fromTo(p, { attr: { cy: -14, r: r / 2 }, opacity: 0 }, { attr: { cy: 50, r }, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: $("[data-fim]"), start: "top 70%", end: "top 30%", scrub: 0.6 } });
      });

      // no rodapé, o relógio e o laço saem de cena (não cobrem o selo da Symphonic)
      gsap.to([$("[data-hora]").parentElement, $("[data-fio]")], {
        autoAlpha: 0, duration: 0.3,
        scrollTrigger: { trigger: $("[data-rodape]"), start: "top bottom", toggleActions: "play none none reverse" },
      });

      // amanhecer: o preto vira branco quando a reela volta
      gsap.to(el, {
        "--st-bg": "#ffffff", "--st-ink": "#000000", "--st-mut": "rgba(0,0,0,0.55)", "--st-line": "rgba(0,0,0,0.14)", ease: "none",
        scrollTrigger: { trigger: $("[data-volta]"), start: "top 60%", end: "top top", scrub: true },
      });

      // ---- números contam quando entram
      $$("[data-conta]").forEach((dd) => {
        const alvo = Number(dd.dataset.conta), suf = dd.dataset.suf ?? "", o = { v: 0 };
        gsap.to(o, { v: alvo, duration: 1.6, ease: "power2.out", snap: { v: 1 }, onUpdate: () => { dd.textContent = `${o.v}${suf}`; }, scrollTrigger: { trigger: dd, start: "top 85%", once: true } });
      });

      ScrollTrigger.refresh();
    },
    { scope: raiz }
  );

  return (
    <div ref={raiz} className={s.historia}>
      <div className={s.fio} data-fio aria-hidden="true"><Simbolo variante="animavel" /></div>
      <div className={s.relogio} aria-hidden="true"><span data-hora>00:00</span><span data-fase>madrugada</span></div>

      {/* abertura */}
      <section className={s.abre} data-abre aria-labelledby="h-abre">
        <span className="t-credit" data-sobe>30.11.2021 · a primeira</span>
        <p className={s.vlone} data-vlone aria-hidden="true">{"VLONE".split("").map((c, i) => <span key={i}>{c}</span>)}</p>
        <h1 className={s.abreTit} id="h-abre" data-sobe>a história da reela é uma madrugada.</h1>
        {historia.intro && <p className={s.intro} data-sobe>{historia.intro}</p>}
      </section>

      {/* um capítulo por ano (o último ano é a volta, com cena própria) */}
      {CAPITULOS.filter((c) => c.ano !== ANOS.at(-1)).map((c) => {
        const extra = c.ano === "2023" ? "formacao" : c.ano === "2025" ? "nevermind" : "";
        return (
          <section key={c.ano} className={s.cap} data-cap data-antes={c.antes} data-extra={extra} aria-labelledby={`h-${c.ano}`}>
            <div className={s.palco} data-palco>
              <div className={s.cab}>
                <h2 className={s.ano} id={`h-${c.ano}`}><span className="sr">{c.ano}</span><Odometro ano={c.ano} /></h2>
                <div className={s.textos}>
                  {c.texto && <p className={s.texto} data-linha>{c.texto}</p>}
                  {c.fato && <p className={s.fato} data-linha>{c.fato}</p>}
                </div>
              </div>

              {c.rels.length > 0 && (
                <ul className={s.profundidade}>
                  {c.rels.map((r) => (
                    <li key={r.id} className={s.card} data-card>
                      <a href={`/releases/${r.id}/`}>
                        <Arte r={r} sizes="(max-width: 760px) 70vw, 420px" />
                        <span className={s.cardTxt}><strong>{r.titulo}</strong><span>{r.artistas}</span></span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {extra === "formacao" && (
                <div className={s.formacao} data-formacao>
                  <span className={s.fato}>a formação agenciada</span>
                  <ul>{AGENCIADOS.filter((n) => n !== "Calebb").map((n) => <li key={n} data-nome>{n}</li>)}</ul>
                </div>
              )}

              {extra === "nevermind" && (
                <>
                  <div className={s.renome} data-renome>
                    <p className={s.palavra} data-palavra aria-hidden="true">reela</p>
                    <p className={s.renomeNota} data-renome-nota>por um tempo, a gente virou nevermind. depois, desistiu do nome.</p>
                  </div>
                  <div className={s.hiato} data-hiato><p><span className={s.cursor} aria-hidden="true" />hiato.</p></div>
                </>
              )}
            </div>
          </section>
        );
      })}

      {/* a volta: amanhece */}
      <section className={s.volta} data-volta aria-labelledby="h-volta">
        <div className={s.voltaCapa} data-volta-capa><Arte r={VOLTA} sizes="100vw" /></div>
        <div className={s.persianas} aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => <span key={i} data-persiana />)}
        </div>
        <div className={s.voltaTxt}>
          <span className={s.fato} data-linha>{ANOS.at(-1)} · {VOLTA.titulo}</span>
          <h2 className={s.voltaTit} id="h-volta" data-linha>a reela volta.</h2>
          {textos[ANOS.at(-1)!] && <p className={s.texto} data-linha>{textos[ANOS.at(-1)!]}</p>}
        </div>
      </section>

      <section className={s.numeros} aria-labelledby="h-numeros">
        <h2 className={s.fato} id="h-numeros">até aqui</h2>
        <dl>
          {NUMEROS.map((n) => (
            <div key={n.rot}><dt>{n.rot}</dt><dd data-conta={n.v} data-suf={n.suf ?? ""}>{n.v}{n.suf ?? ""}</dd></div>
          ))}
        </dl>
        <p className={s.fato}>* soma das faixas populares no Spotify. é um piso: o total real é maior.</p>
      </section>

      <section className={s.fim} data-fim aria-labelledby="h-fim">
        <h2 className={s.fimTit} id="h-fim">de novo,<br />até amanhecer.</h2>
        {historia.fim && <p className={s.intro}>{historia.fim}</p>}
        <div className={s.acoes}>
          <a className={s.botao} href={EMAIL_HREF}>mandar faixa</a>
          <a className={`${s.botao} ${s.botao2}`} href="/releases/">todos os lançamentos</a>
        </div>
      </section>
      <div className={s.rodape} data-rodape><Rodape /></div>
    </div>
  );
}

"use client";
import { SomProvider } from "@/hooks/useSom";
import { MusicIsland } from "./MusicIsland";
import { ImageTrail } from "./ImageTrail";
import { LiquidToggle } from "./LiquidToggle";
import { TextoEntrada } from "./TextoEntrada";
import s from "./Lab.module.css";

const TESTES = [
  { id: "island", nome: "music island", ref: "bencho.dev/blocks/music-island", regra: "player próprio no lugar do embed do Spotify. não quebra regra; os cantos arredondados fogem da marca reta.", C: MusicIsland },
  { id: "trail", nome: "image trail", ref: "bencho.dev/blocks/image-trail", regra: "quebra 'sem cursor customizado': as capas seguem o mouse.", C: ImageTrail },
  { id: "toggle", nome: "liquid toggle", ref: "bencho.dev/blocks/liq-toggle", regra: "quebra 'nada de back/elastic/bounce': o ponto estica e quica.", C: LiquidToggle },
  { id: "texto", nome: "text rise / blur", ref: "bencho.dev/blocks/text-rise · text-blur", regra: "o blur foge do P&B nítido da marca; o rise é parente do que já usamos.", C: TextoEntrada },
];

/** página de testes: recriações com GSAP de blocos do bencho.dev. fora do site e fora do índice de busca. */
export function Lab() {
  return (
    <SomProvider>
      <main className={s.lab} id="content">
        <header className={s.cab}>
          <a href="/" className="t-caption">← voltar ao site</a>
          <h1 className="t-display">lab.</h1>
          <p className="t-caption">recriações com o nosso GSAP de blocos do bencho.dev, para testar fora do site. nada aqui entra sem você escolher.</p>
        </header>
        {TESTES.map(({ id, nome, ref, regra, C }, i) => (
          <section key={id} className={s.teste} aria-labelledby={`t-${id}`}>
            <div className={s.legenda}>
              <span className="t-credit">{String(i + 1).padStart(2, "0")} · {ref}</span>
              <h2 className="t-title" id={`t-${id}`}>{nome}</h2>
              <p className="t-caption">{regra}</p>
            </div>
            <div className={s.palco}><C /></div>
          </section>
        ))}
      </main>
    </SomProvider>
  );
}

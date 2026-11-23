import type { Metadata } from "next";
import { Casca, Rodape } from "@/components/Casca/Casca";
import { EMAIL_HREF } from "@/data/links";
import { Parceiro } from "@/components/Parceiro/Parceiro";
import s from "./como-funciona.module.css";

export const metadata: Metadata = {
  title: "como funciona · reela music",
  description: "selo de trap e r&b. a gente entra com beat, mix e master; você entra com a voz. split 60/40 para o artista, lançado pela reela.",
  alternates: { canonical: "/how-it-works/" },
};

const SERVICOS = [
  { nome: "beat", txt: "a base da faixa, feita pra sua voz." },
  { nome: "mix", txt: "cada elemento no lugar, do grave à voz." },
  { nome: "master", txt: "pronta pra tocar alto em qualquer plataforma." },
];

const PASSOS = [
  { t: "você manda a faixa", d: "o link da demo ou do pré-mix, pelo e-mail." },
  { t: "a gente ouve tudo", d: "e responde em até uma semana se dá pra produzir aqui, dentro do que a reela faz." },
  { t: "conversa", d: "uma ou mais reuniões pra alinhar a faixa, o som e o tempo de cada um." },
  { t: "contrato", d: "o split fica no papel antes de qualquer coisa começar." },
  { t: "produção", d: "beat, mix e master até a faixa ficar pronta." },
  { t: "distribuição", d: "a reela entrega na distribuidora. a data nas plataformas é a que for melhor pra sua agenda." },
];

export default function ComoFunciona() {
  return (
    <Casca>
      <main id="content" tabIndex={-1} className={s.pagina}>
        <header className={s.abre}>
          <span className="t-credit">como funciona</span>
          <h1 className="t-display">a gente entra com beat, mix e master.<br /><span className={s.mudo}>você entra com a voz.</span></h1>
        </header>

        <section className={s.duas} aria-labelledby="c-quem">
          <h2 className="t-title" id="c-quem">pra quem é</h2>
          <div className={s.texto}>
            <p>trap e r&amp;b. só isso, e bem feito.</p>
            <p>tanto faz se você está começando agora ou se já tem estrada: a porta é a mesma pra todo mundo. o que conta é a faixa.</p>
          </div>
        </section>

        <section className={s.duas} aria-labelledby="c-chega">
          <h2 className="t-title" id="c-chega">como chega</h2>
          <div className={s.texto}>
            <p>na maioria das vezes é a reela que procura o artista, já com uma música pronta pra ele.</p>
            <p>se você quiser produzir uma faixa sua do zero com a gente, também dá: aí a gente monta um orçamento pra ela.</p>
          </div>
        </section>

        <section className={s.duas} aria-labelledby="c-faz">
          <h2 className="t-title" id="c-faz">o que a gente faz</h2>
          <ul className={s.servicos}>
            {SERVICOS.map((x) => (
              <li key={x.nome}><strong>{x.nome}</strong><span className="t-caption">{x.txt}</span></li>
            ))}
          </ul>
        </section>

        <section className={s.duas} aria-labelledby="c-acordo">
          <h2 className="t-title" id="c-acordo">o acordo</h2>
          <div className={s.texto}>
            <div className={s.split} role="img" aria-label="split de royalties: 60% para o artista, 40% para o selo">
              <div className={s.parte} style={{ flexBasis: "60%" }}><b>60</b><span>artista</span></div>
              <div className={`${s.parte} ${s.selo}`} style={{ flexBasis: "40%" }}><b>40</b><span>selo</span></div>
            </div>
            <p>na maioria das vezes é split de royalties: 60% pra você, 40% pra reela. o combinado fica no contrato antes do primeiro play.</p>
            <p>a faixa sai pela reela, com distribuição da symphonic. não tem lançamento por conta própria: a gente cuida da entrega e você cuida da música.</p>
            <Parceiro grande />
          </div>
        </section>

        <section className={s.duas} aria-labelledby="c-prazo">
          <h2 className="t-title" id="c-prazo">prazo</h2>
          <div className={s.texto}>
            <p className={s.numero}>~2 meses</p>
            <p>em média, da demo até a faixa entregue na distribuidora. cada faixa tem seu tempo, então é média, não promessa.</p>
            <p>a data em que ela aparece nas plataformas é escolhida com você, pelo que for melhor pra sua agenda.</p>
          </div>
        </section>

        <section className={s.duas} aria-labelledby="c-passos">
          <h2 className="t-title" id="c-passos">depois que você manda</h2>
          <ol className={s.passos}>
            {PASSOS.map((p, i) => (
              <li key={p.t}>
                <span className="t-credit">{String(i + 1).padStart(2, "0")}</span>
                <strong>{p.t}</strong>
                <span className="t-caption">{p.d}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={s.fim} aria-labelledby="c-fim">
          <h2 className="t-display" id="c-fim">tem uma faixa que não sai da cabeça?</h2>
          <a className="btn btn-1" href={EMAIL_HREF}>mandar faixa</a>
        </section>

        <Rodape />
      </main>
    </Casca>
  );
}

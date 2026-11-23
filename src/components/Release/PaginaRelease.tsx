/**
 * Página própria de um release (/releases/<id>/): o mesmo conteúdo do detalhe do laço,
 * com endereço para compartilhar e para o Google. Navega para o anterior/próximo e volta ao laço.
 */
import { RELEASES } from "@/data";
import { MOSTRAR_SELO_PROTOTIPO } from "@/data/links";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SomProvider } from "@/hooks/useSom";
import { Barra } from "@/components/Barra/Barra";
import { Grao } from "@/components/Grao/Grao";
import { Arte } from "@/components/Arte/Arte";
import { ReleaseInfo, grade, lugarCapa } from "./ReleaseInfo";
import s from "./PaginaRelease.module.css";

export function PaginaRelease({ i }: { i: number }) {
  const r = RELEASES[i];
  const ant = RELEASES[(i - 1 + RELEASES.length) % RELEASES.length];
  const prox = RELEASES[(i + 1) % RELEASES.length];

  return (
    <SmoothScroll>
      <SomProvider>
        <a className="skip" href="#conteudo">pular para o conteúdo</a>
        <Grao />
        <Barra />
        <main id="conteudo" tabIndex={-1} className={s.pagina}>
          <nav className={s.volta} aria-label="navegação do release">
            <a href={`/?r=${r.id}#releases`}>← voltar ao laço</a>
          </nav>
          <article className={`${grade} ${s.release}`} aria-labelledby="r-tit">
            <div className={lugarCapa}><Arte r={r} /></div>
            <ReleaseInfo r={r} player idTitulo="r-tit" nivel="h1" />
          </article>
          <nav className={s.vizinhos} aria-label="outros lançamentos">
            {[{ x: ant, rot: "anterior" }, { x: prox, rot: "próximo" }].map(({ x, rot }) => (
              <a key={rot} href={`/releases/${x.id}/`} className={s.vizinho}>
                <Arte r={x} className={s.mini} />
                <span>
                  <span className="t-credit">{rot} · {x.num}</span>
                  <strong>{x.titulo}</strong>
                </span>
                <span className={s.seta} aria-hidden="true">{rot === "anterior" ? "←" : "→"}</span>
              </a>
            ))}
          </nav>
          <footer className={s.rodape}>
            <span className="t-credit">© {new Date().getFullYear()} reela music · distribuição symphonic</span>
            <span className="t-credit">são josé dos campos, sp</span>
          </footer>
        </main>
        {MOSTRAR_SELO_PROTOTIPO && <div className="selo-prot">protótipo · dados em revisão</div>}
      </SomProvider>
    </SmoothScroll>
  );
}

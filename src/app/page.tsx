import { Simbolo } from "@/components/marca/Simbolo";

// etapa 1: placa de teste de tokens, fontes e símbolo. substituída na etapa 2.
export default function Home() {
  return (
    <main id="conteudo" style={{ padding: "var(--gutter)", display: "grid", gap: 24 }}>
      <Simbolo titulo="reela" className="teste-sym" />
      <h1 className="t-display">de novo, até amanhecer.</h1>
      <p className="t-heading">tem uma faixa que não sai da cabeça?</p>
      <p>a gente faz o beat, a mix e a arte. a faixa é sua.</p>
      <span className="t-caption">sexta, 00h. em todas as plataformas.</span>
      <span className="t-credit">prod. reela · mix reela</span>
      <div style={{ display: "flex", gap: 10 }}>
        <a className="btn btn-1" href="#">mandar faixa</a>
        <a className="btn btn-2" href="#">abrir release</a>
      </div>
      <style>{`.teste-sym{width:120px;height:120px}`}</style>
    </main>
  );
}

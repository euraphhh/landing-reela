import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SomProvider } from "@/hooks/useSom";
import { Barra } from "@/components/Barra/Barra";
import { Hero } from "@/components/Hero/Hero";
import { Grao } from "@/components/Grao/Grao";
import { MOSTRAR_SELO_PROTOTIPO } from "@/data/links";

export default function Home() {
  return (
    <SmoothScroll>
      <SomProvider>
        <a className="skip" href="#conteudo">pular para o conteúdo</a>
        <Grao />
        <Barra />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          {/* etapa 3: Laco · etapa 4: QuemPassou, Selo, Replay */}
          <section id="releases" style={{ minHeight: "100svh", borderTop: "1px solid var(--line)" }} aria-label="releases (etapa 3)" />
        </main>
        {MOSTRAR_SELO_PROTOTIPO && <div className="selo-prot">protótipo · nomes e faixas de exemplo</div>}
      </SomProvider>
    </SmoothScroll>
  );
}

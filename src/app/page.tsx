import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SomProvider } from "@/hooks/useSom";
import { Barra } from "@/components/Barra/Barra";
import { Hero } from "@/components/Hero/Hero";
import { Grao } from "@/components/Grao/Grao";
import { Laco } from "@/components/Laco/Laco";
import { QuemPassou } from "@/components/QuemPassou/QuemPassou";
import { Selo } from "@/components/Selo/Selo";
import { Replay } from "@/components/Replay/Replay";
import { MOSTRAR_SELO_PROTOTIPO } from "@/data/links";

export default function Home() {
  return (
    <SmoothScroll>
      <SomProvider>
        <a className="skip" href="#content">pular para o conteúdo</a>
        <Grao />
        <Barra />
        <main id="content" tabIndex={-1}>
          <Hero />
          <Laco />
          <QuemPassou limite={12} />
          <Selo />
          <Replay />
        </main>
        {MOSTRAR_SELO_PROTOTIPO && <div className="selo-prot">protótipo · dados em revisão</div>}
      </SomProvider>
    </SmoothScroll>
  );
}

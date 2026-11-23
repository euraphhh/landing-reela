/** a casca das páginas internas: providers, skip link, grão, barra e o selo de protótipo */
import { MOSTRAR_SELO_PROTOTIPO } from "@/data/links";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SomProvider } from "@/hooks/useSom";
import { Barra } from "@/components/Barra/Barra";
import { Grao } from "@/components/Grao/Grao";
import { Parceiro } from "@/components/Parceiro/Parceiro";

export function Casca({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <SomProvider>
        <a className="skip" href="#content">pular para o conteúdo</a>
        <Grao />
        <Barra />
        {children}
        {MOSTRAR_SELO_PROTOTIPO && <div className="selo-prot">protótipo · dados em revisão</div>}
      </SomProvider>
    </SmoothScroll>
  );
}

/** rodapé das páginas internas */
export function Rodape({ className }: { className?: string }) {
  return (
    <footer className={className} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <Parceiro />
        <span className="t-credit">© {new Date().getFullYear()} reela music</span>
      </span>
      <span className="t-credit" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <a href="/privacy/" className="lnk-rodape">privacidade</a>
        são josé dos campos, sp
      </span>
    </footer>
  );
}

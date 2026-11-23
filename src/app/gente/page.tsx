import type { Metadata } from "next";
import { Casca, Rodape } from "@/components/Casca/Casca";
import { QuemPassou } from "@/components/QuemPassou/QuemPassou";
import { ARTISTAS } from "@/data";

export const metadata: Metadata = {
  title: "quem passou · reela music",
  description: `as ${ARTISTAS.length} pessoas que gravaram, cantaram ou produziram com a reela.`,
  alternates: { canonical: "/gente/" },
};

export default function Gente() {
  return (
    <Casca>
      <main id="conteudo" tabIndex={-1} style={{ paddingTop: 40 }}>
        <QuemPassou completa />
        <div style={{ padding: "0 var(--gutter) 28px" }}><Rodape /></div>
      </main>
    </Casca>
  );
}

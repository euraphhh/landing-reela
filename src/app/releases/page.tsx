import type { Metadata } from "next";
import { Casca, Rodape } from "@/components/Casca/Casca";
import { Catalogo } from "@/components/Catalogo/Catalogo";
import { RELEASES } from "@/data";

export const metadata: Metadata = {
  title: "lançamentos · reela music",
  description: `todos os ${RELEASES.length} lançamentos da reela, de 2022 até agora.`,
  alternates: { canonical: "/releases/" },
};

export default function Lancamentos() {
  return (
    <Casca>
      <main id="content" tabIndex={-1} style={{ padding: "120px var(--gutter) 28px", display: "flex", flexDirection: "column", gap: 56 }}>
        <Catalogo />
        <Rodape />
      </main>
    </Casca>
  );
}

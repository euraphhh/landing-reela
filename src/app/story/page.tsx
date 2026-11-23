import type { Metadata } from "next";
import { Casca } from "@/components/Casca/Casca";
import { Historia } from "@/components/Historia/Historia";

export const metadata: Metadata = {
  title: "história · reela music",
  description: "a história da reela, de 2022 até agora, contada pelos lançamentos.",
  alternates: { canonical: "/story/" },
};

export default function Story() {
  return (
    <Casca>
      <main id="content" tabIndex={-1}>
        {/* o rodapé fica dentro da história, na paleta do amanhecer */}
        <Historia />

      </main>
    </Casca>
  );
}

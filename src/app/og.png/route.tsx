// /og.png: preview padrão (home, como funciona, privacidade)
import { cardOG } from "@/lib/og";

export const dynamic = "force-static";

export async function GET() {
  return cardOG({ kick: "selo de trap e r&b", titulo: "de novo, até amanhecer.", linha: "a faixa é sua." });
}

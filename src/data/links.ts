import type { Plataforma } from "@/types";

/** perfis da reela. troque "#" pelas URLs reais. */
export const STREAMING: { id: Plataforma; nome: string; href: string }[] = [
  { id: "spotify", nome: "spotify", href: "https://open.spotify.com/intl-pt/artist/4WwNvUqhjTKKU1KLVLGoa6" },
  { id: "apple", nome: "apple music", href: "#" },
  { id: "youtube", nome: "youtube", href: "#" },
  { id: "tiktok", nome: "tiktok", href: "#" },
];

/** endereço assumido: depende do domínio reelamusic.com */
export const EMAIL = "contato@reelamusic.com";
/** troque por `mailto:${EMAIL}` quando o endereço existir */
export const EMAIL_HREF = "#";

/** selo "protótipo · dados em revisão". desligue quando os dados reais entrarem. */
export const MOSTRAR_SELO_PROTOTIPO = true;

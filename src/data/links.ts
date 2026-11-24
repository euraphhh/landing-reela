import type { Plataforma } from "@/types";

/** perfis da reela. troque "#" pelas URLs reais. */
export const STREAMING: { id: Plataforma; nome: string; href: string }[] = [
  { id: "spotify", nome: "spotify", href: "https://open.spotify.com/intl-pt/artist/4WwNvUqhjTKKU1KLVLGoa6" },
  { id: "apple", nome: "apple music", href: "https://music.apple.com/br/artist/reela-music/1610961189" },
  { id: "youtube", nome: "youtube", href: "https://www.youtube.com/@reelamusic" },
  { id: "instagram", nome: "instagram", href: "https://www.instagram.com/reelamusic/" },
];

/**
 * ATENÇÃO: endereço ainda NÃO existe (sem domínio em 2026-11-23). Até o domínio e a caixa
 * existirem, quem mandar vai receber erro de entrega. Troque aqui quando o endereço for criado.
 */
export const EMAIL = "contato@reelamusic.com";

const ASSUNTO = "faixa pra reela";
const CORPO = [
  "nome artístico:",
  "link da demo ou do pré-mix:",
  "@ (instagram / tiktok):",
  "o que você precisa (beat, mix, master):",
  "",
  "conta um pouco da faixa:",
].join("\n");

/** abre o e-mail já com assunto e roteiro */
export const EMAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(ASSUNTO)}&body=${encodeURIComponent(CORPO)}`;

/** selo "protótipo · dados em revisão". desligue quando os dados reais entrarem. */
export const MOSTRAR_SELO_PROTOTIPO = false;

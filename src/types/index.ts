export type Plataforma = "spotify" | "apple" | "youtube" | "tiktok";

export type Credito = { papel: string; nome: string };

export type Release = {
  id: string;
  /** número na capa: "001" na era nova, "A01".. no arquivo */
  num: string;
  /** release da era nova: capa com o símbolo gigante */
  nova?: boolean;
  titulo: string;
  artistas: string;
  /** linha curta de data: "em breve", "arquivo · 2024" */
  quando: string;
  ano?: string;
  creditos: Credito[];
  /** gradiente de placeholder enquanto não há capa: [topo, base] */
  cor: [string, string];
  /** caminho em /public, ex.: "/capas/001.jpg" (9:16) */
  capa?: string;
  /** caminho em /public/audio, ex.: "/audio/001.mp3" */
  previa?: string;
  /** bpm da prévia, para o ponto pulsar no tempo (padrão 90) */
  bpm?: number;
  links?: Partial<Record<Plataforma, string>>;
  /** "EP", "Single" */
  tipo?: string;
  faixas?: number;
  /** ℗ do lançamento, como no Spotify */
  selo?: string;
  /** outras versões (ex.: speed) que não ganham card próprio */
  versoes?: { nome: string; spotify?: string }[];
};

export type Artista = {
  nome: string;
  slug: string;
  papel: string;
  faixas: number;
  /** o que a pessoa fez em cada lançamento (id do release) */
  lancamentos: { id: string; papel: string }[];
  /** tem página própria em /gente/<slug>/ */
  pagina?: boolean;
  foto?: string;
  bio?: string;
  links?: Partial<Record<"spotify" | "instagram" | "tiktok" | "youtube", string>>;
};

export type Tema = "madrugada" | "papel";

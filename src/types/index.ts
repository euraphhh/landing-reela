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
};

export type Artista = {
  nome: string;
  papel: string;
  faixas: number;
};

export type Tema = "madrugada" | "papel";

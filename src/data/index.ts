import type { Artista, Release } from "@/types";
import releasesJson from "./releases.json";
import artistasJson from "./artistas.json";

export const RELEASES = releasesJson as Release[];
export const ARTISTAS = artistasJson as Artista[];
/** o laço da home: só os destaques (docs/dados/destaques.json), os lançamentos que fizeram barulho */
export const LACO = RELEASES.filter((r) => r.destaque);

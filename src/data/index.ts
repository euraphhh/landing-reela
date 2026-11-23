import type { Artista, Release } from "@/types";
import releasesJson from "./releases.json";
import artistasJson from "./artistas.json";

export const RELEASES = releasesJson as Release[];
export const ARTISTAS = artistasJson as Artista[];

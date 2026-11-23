import type { Metadata } from "next";
import { NaoEncontrada } from "@/components/NaoEncontrada/NaoEncontrada";

export const metadata: Metadata = { title: "faixa não encontrada · reela music", robots: { index: false } };

export default function NotFound() {
  return <NaoEncontrada />;
}

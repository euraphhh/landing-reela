import type { Metadata } from "next";
import { Lab } from "@/components/lab/Lab";

export const metadata: Metadata = { title: "lab · reela music", robots: { index: false, follow: false } };

export default function LabPage() {
  return <Lab />;
}

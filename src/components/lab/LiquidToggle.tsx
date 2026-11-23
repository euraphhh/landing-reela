"use client";
// no lab, o mesmo toggle do site em tamanho grande
import { LiquidToggle as Toggle } from "@/components/LiquidToggle/LiquidToggle";

export function LiquidToggle() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <Toggle className="lab-toggle-grande" />
      <span className="t-caption">já está no site, na barra. aqui em tamanho grande.</span>
      <style>{`.lab-toggle-grande svg{width:180px;height:84px}`}</style>
    </div>
  );
}

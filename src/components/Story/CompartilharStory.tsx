"use client";
/**
 * Gera uma imagem de story (1080×1920) do release no próprio navegador e compartilha.
 * Celular: menu de compartilhar do sistema (Web Share com arquivo). Senão: baixa o PNG.
 */
import { useState } from "react";
import type { Release } from "@/types";
import { LACO_MADRUGADA } from "@/components/marca/Simbolo";
import s from "./CompartilharStory.module.css";

const W = 1080, H = 1920, M = 90;

const fonteDe = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "sans-serif";

function carregar(src: string) {
  return new Promise<HTMLImageElement>((ok, erro) => { const i = new Image(); i.onload = () => ok(i); i.onerror = erro; i.src = src; });
}

/** quebra o texto em linhas que cabem em `largura` */
function linhas(ctx: CanvasRenderingContext2D, texto: string, largura: number) {
  const out: string[] = []; let atual = "";
  for (const p of texto.split(" ")) {
    const t = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(t).width > largura && atual) { out.push(atual); atual = p; } else atual = t;
  }
  if (atual) out.push(atual);
  return out;
}

/** o símbolo (versão branca, traço afinado), na posição x,y com tamanho `tam` */
function simbolo(ctx: CanvasRenderingContext2D, x: number, y: number, tam: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(tam / 100, tam / 100);
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 13; ctx.lineCap = "butt";
  ctx.stroke(new Path2D(LACO_MADRUGADA));
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(50, 50, 19, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

async function gerar(r: Release) {
  const display = fonteDe("--f-display"), texto = fonteDe("--f-text");
  await Promise.all([document.fonts.load(`300 100px ${display}`), document.fonts.load(`500 36px ${texto}`)]);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  // topo: lockup
  simbolo(ctx, M, 110, 64);
  ctx.fillStyle = "#fff"; ctx.font = `300 46px ${display}`; ctx.textBaseline = "middle";
  ctx.fillText("reela", M + 86, 142);
  ctx.fillStyle = "#8A8A8A"; ctx.fillText("music", M + 86 + ctx.measureText("reela ").width, 142);

  // capa
  const lado = W - M * 2, yCapa = 260;
  if (r.capa) { const img = await carregar(r.capa); ctx.drawImage(img, M, yCapa, lado, lado); }
  else { ctx.fillStyle = r.cor[0]; ctx.fillRect(M, yCapa, lado, lado); }

  // texto
  let y = yCapa + lado + 90;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#A3A3A3"; ctx.font = `500 34px ${texto}`;
  ctx.fillText(`${r.num} · ${r.quando}`, M, y);
  y += 40;
  ctx.fillStyle = "#fff";
  const tam = r.titulo.length > 22 ? 78 : r.titulo.length > 12 ? 96 : 120;
  ctx.font = `300 ${tam}px ${display}`;
  for (const l of linhas(ctx, r.titulo, lado).slice(0, 3)) { y += tam * 1.02; ctx.fillText(l, M, y); }
  if (r.artistas) {
    y += 70; ctx.fillStyle = "#A3A3A3"; ctx.font = `500 38px ${texto}`;
    for (const l of linhas(ctx, r.artistas, lado).slice(0, 2)) { ctx.fillText(l, M, y); y += 50; }
  }

  // rodapé
  ctx.fillStyle = "#fff"; ctx.font = `500 34px ${texto}`;
  ctx.fillText("ouça em", M, H - 150);
  // o endereço diminui até caber na largura (ids longos, como reesenha-pt-2-planos)
  const endereco = `${location.host}/releases/${r.id}`;
  let tamEnd = 44;
  do { ctx.font = `300 ${tamEnd}px ${display}`; tamEnd -= 2; } while (ctx.measureText(endereco).width > lado && tamEnd > 20);
  ctx.fillText(endereco, M, H - 92);

  return new Promise<Blob>((ok) => c.toBlob((b) => ok(b!), "image/png"));
}

export function CompartilharStory({ r, className }: { r: Release; className?: string }) {
  const [estado, setEstado] = useState<"" | "gerando" | "pronto">("");

  const compartilhar = async () => {
    setEstado("gerando");
    try {
      const blob = await gerar(r);
      const arquivo = new File([blob], `reela-${r.id}-story.png`, { type: "image/png" });
      const url = `${location.origin}/releases/${r.id}/`;
      if (navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], title: `${r.titulo} · reela music`, text: url });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = arquivo.name; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }
      setEstado("pronto");
      setTimeout(() => setEstado(""), 2500);
    } catch {
      setEstado(""); // cancelou o compartilhamento ou falhou: volta ao normal
    }
  };

  return (
    <button type="button" className={["btn btn-2", s.botao, className].filter(Boolean).join(" ")} onClick={compartilhar} disabled={estado === "gerando"} aria-live="polite">
      {estado === "gerando" ? "gerando…" : estado === "pronto" ? "pronto ✓" : "compartilhar story"}
    </button>
  );
}

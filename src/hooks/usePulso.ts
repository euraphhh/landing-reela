"use client";
import { useEffect, type RefObject } from "react";
import { gsap, calmo } from "@/lib/gsap";
import { useSom } from "./useSom";

/** o ponto do símbolo dentro de `scope` pulsa a cada batida do som */
export function usePulso(scope: RefObject<Element | null>) {
  const { onBatida } = useSom();
  useEffect(() => {
    if (calmo()) return;
    const off = onBatida(() => {
      const pts = scope.current?.querySelectorAll<SVGCircleElement>(".ponto");
      pts?.forEach((p) => {
        const r = Number(p.dataset.r ?? 20);
        gsap.fromTo(p, { attr: { r } }, { attr: { r: r * 1.09 }, duration: 0.12, ease: "sine.out", yoyo: true, repeat: 1, overwrite: "auto" });
      });
    });
    return () => {
      off();
      scope.current?.querySelectorAll(".ponto").forEach((p) => gsap.killTweensOf(p));
    };
  }, [onBatida, scope]);
}

"use client";
// registro único dos plugins. importe gsap e plugins sempre daqui.
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, Draggable, InertiaPlugin, Flip, SplitText);
}

/** a curva da marca: suave, sem quique */
export const EASE = "power3.inOut";

/** prefers-reduced-motion. só chame no cliente (dentro de efeitos/handlers). */
export const calmo = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP, ScrollTrigger, DrawSVGPlugin, Draggable, InertiaPlugin, Flip, SplitText };

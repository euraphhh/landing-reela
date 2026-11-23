"use client";
import { useEffect, useRef } from "react";
import { calmo } from "@/lib/gsap";
import s from "./Grao.module.css";

/** grão de filme por cima de tudo. 4 quadros gerados uma vez; parado em reduced motion. */
export function Grao() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const div = el.current!;
    const frames: string[] = [];
    for (let f = 0; f < 4; f++) {
      const c = document.createElement("canvas"); c.width = c.height = 180;
      const x = c.getContext("2d")!, d = x.createImageData(180, 180);
      for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = Math.random() * 90; }
      x.putImageData(d, 0, 0); frames.push(`url(${c.toDataURL()})`);
    }
    div.style.backgroundImage = frames[0];
    if (calmo()) return;
    let k = 0;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      k = (k + 1) % 4;
      div.style.backgroundImage = frames[k];
      div.style.transform = `translate(${(Math.random() * 8 - 4) | 0}%,${(Math.random() * 8 - 4) | 0}%)`;
    }, 90);
    return () => clearInterval(id);
  }, []);
  return <div ref={el} className={s.grao} aria-hidden="true" />;
}

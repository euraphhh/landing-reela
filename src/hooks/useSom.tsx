"use client";
/**
 * Som do site. Duas fontes, mesma API:
 * - release com `previa` → <audio src="/audio/…"> (a prévia real)
 * - sem `previa` → o loop sintetizado do protótipo (90 bpm, stand-in)
 *
 * `onBatida(fn)` avisa no tempo do kick (synth) ou a cada tempo do bpm (audio),
 * para o ponto do logo pulsar junto.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Release } from "@/types";

type Batida = () => void;
type Ctx = {
  ligado: boolean;
  /** qual release está tocando (null = loop da casa) */
  tocando: string | null;
  alternar: (r?: Release | null) => void;
  tocar: (r?: Release | null) => Promise<void>;
  parar: () => void;
  onBatida: (fn: Batida) => () => void;
};

const SomCtx = createContext<Ctx | null>(null);
export function useSom() {
  const c = useContext(SomCtx);
  if (!c) throw new Error("useSom fora do SomProvider");
  return c;
}

/* ---------- o loop sintetizado ---------- */
function criarSynth(batida: () => void) {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
  const master = ctx.createGain(); master.gain.value = 0.5; master.connect(comp); comp.connect(ctx.destination);
  const noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const nd = noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  const BPM = 90, S16 = 60 / BPM / 4;
  const CHORDS = [[174.61, 207.65, 261.63, 311.13, 392.0], [138.59, 174.61, 207.65, 261.63], [155.56, 207.65, 233.08, 277.18], [130.81, 155.56, 196.0, 233.08]];
  let next = 0, step = 0, timer: number | null = null;
  const pendentes = new Set<number>();

  const env = (g: GainNode, t: number, a: number, peak: number, dec: number) => {
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
  };
  const kick = (t: number, root: number) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(root / 2, t + 0.12);
    env(g, t, 0.005, 0.9, 0.9); o.connect(g).connect(master); o.start(t); o.stop(t + 1);
  };
  const hit = (t: number, type: BiquadFilterType, f: number, peak: number, dec: number) => {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; fl.type = type; fl.frequency.value = f; env(g, t, 0.002, peak, dec);
    s.connect(fl).connect(g).connect(master); s.start(t); s.stop(t + dec + 0.05);
  };
  const pad = (t: number, freqs: number[], dur: number) => {
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = 0.4;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.9); g.gain.setValueAtTime(0.06, t + dur - 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    lp.connect(g).connect(master);
    freqs.forEach((f) => [-6, 6].forEach((dt) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f; o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + 0.05); }));
  };
  const agendarBatida = (t: number) => {
    const id = window.setTimeout(() => { pendentes.delete(id); batida(); }, Math.max(0, (t - ctx.currentTime) * 1000));
    pendentes.add(id);
  };
  const play = (i: number, t: number) => {
    const s = i % 16, bar = Math.floor(i / 16), chord = CHORDS[Math.floor(bar / 2) % 4];
    if (i % 32 === 0) pad(t, chord, S16 * 32);
    if (s === 0 || s === 7 || s === 10) { kick(t, chord[0]); agendarBatida(t); }
    if (s === 8) hit(t, "bandpass", 1400, 0.32, 0.18);
    if (s % 2 === 0 || (bar % 2 === 1 && s >= 13)) hit(t, "highpass", 7500, s % 4 === 0 ? 0.09 : 0.05, 0.035);
  };
  const tick = () => {
    while (next < ctx.currentTime + 0.12) { play(step, next); next += S16 * (step % 2 === 0 ? 1.08 : 0.92); step = (step + 1) % 128; }
  };
  const limparBatidas = () => { pendentes.forEach(clearTimeout); pendentes.clear(); };

  return {
    async start() {
      await ctx.resume();
      if (timer == null) { next = ctx.currentTime + 0.05; step = 0; timer = window.setInterval(tick, 25); }
    },
    stop() {
      if (timer != null) { clearInterval(timer); timer = null; }
      limparBatidas();
      void ctx.suspend();
    },
    destroy() { this.stop(); void ctx.close(); },
  };
}

export function SomProvider({ children }: { children: React.ReactNode }) {
  const [ligado, setLigado] = useState(false);
  const [tocando, setTocando] = useState<string | null>(null);
  const ouvintes = useRef(new Set<Batida>());
  const synth = useRef<ReturnType<typeof criarSynth> | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const pulsoAudio = useRef<number | null>(null);

  const batida = useCallback(() => ouvintes.current.forEach((fn) => fn()), []);

  const pararTudo = useCallback(() => {
    synth.current?.stop();
    if (audio.current) audio.current.pause();
    if (pulsoAudio.current != null) { clearInterval(pulsoAudio.current); pulsoAudio.current = null; }
  }, []);

  const tocar = useCallback(async (r?: Release | null) => {
    pararTudo();
    if (r?.previa) {
      const a = audio.current ?? (audio.current = new Audio());
      a.loop = true;
      if (!a.src.endsWith(r.previa)) a.src = r.previa;
      try { await a.play(); } catch { setLigado(false); return; }
      const bpm = r.bpm ?? 90;
      pulsoAudio.current = window.setInterval(batida, 60000 / bpm);
      setTocando(r.id);
    } else {
      if (!synth.current) synth.current = criarSynth(batida);
      await synth.current.start();
      setTocando(null);
    }
    setLigado(true);
  }, [batida, pararTudo]);

  const parar = useCallback(() => { pararTudo(); setLigado(false); }, [pararTudo]);

  const alternar = useCallback((r?: Release | null) => {
    const mesmo = (r?.previa ? r.id : null) === tocando;
    if (ligado && mesmo) parar(); else void tocar(r);
  }, [ligado, tocando, parar, tocar]);

  const onBatida = useCallback((fn: Batida) => {
    ouvintes.current.add(fn);
    return () => { ouvintes.current.delete(fn); };
  }, []);

  useEffect(() => () => {
    pararTudo();
    synth.current?.destroy(); synth.current = null;
    if (audio.current) { audio.current.removeAttribute("src"); audio.current.load(); audio.current = null; }
  }, [pararTudo]);

  const valor = useMemo(() => ({ ligado, tocando, alternar, tocar, parar, onBatida }), [ligado, tocando, alternar, tocar, parar, onBatida]);
  return <SomCtx.Provider value={valor}>{children}</SomCtx.Provider>;
}

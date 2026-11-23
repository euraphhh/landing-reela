// eventos do site entre componentes que não se conhecem
export const EV = {
  /** o tema mudou: detail = Tema */
  tema: "reela:tema",
  /** tocar a entrada de novo (depois do replay) */
  entrada: "reela:entrada",
  /** ir até um release no laço: detail = índice */
  release: "reela:release",
} as const;

export const emitir = (nome: string, detail?: unknown) =>
  window.dispatchEvent(new CustomEvent(nome, { detail }));

export function ouvir<T = unknown>(nome: string, fn: (detail: T) => void) {
  const h = (e: Event) => fn((e as CustomEvent<T>).detail);
  window.addEventListener(nome, h);
  return () => window.removeEventListener(nome, h);
}

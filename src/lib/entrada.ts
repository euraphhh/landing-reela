/** a entrada toca nesta página? (decidido no <head>, ver tema-script.ts) */
export const tocaEntrada = () => typeof document !== "undefined" && document.documentElement.dataset.entrada === "1";
/** quem já começou a animar libera o que estava escondido */
export const liberarEntrada = () => document.documentElement.classList.remove("entra");

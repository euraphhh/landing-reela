/**
 * O símbolo da reela, com a geometria de docs/marca/logos/reela-symbol*.svg
 * (sistema 0–100, sem o translate/scale de 256px dos arquivos).
 *
 * - estatico: os contornos preenchidos dos arquivos, idênticos. O tema Madrugada
 *   (branco sobre preto) usa a versão de traço afinado, como reela-symbol-white.svg.
 * - animavel: o mesmo desenho como traço (linha central + stroke butt), para o DrawSVG.
 *   Papel: anel r50/r36 → centro r43, traço 14; cauda até x75, 0–14.
 *   Madrugada: anel r50/r37 → centro r43,5, traço 13; cauda 0–13.
 *   Ponto: r20 / r19.
 * - small: reela-symbol-small.svg, para até 24px.
 *
 * Nunca feche o anel, nunca remova a cauda ou o ponto, nunca gire o estático.
 */
type Props = {
  /** "anel": só o laço e a cauda, sem o ponto. Uso único: a lista de quem passou,
   *  onde uma bolinha viaja de um laço para o outro (pedido do raphh, 2026-11-23). */
  variante?: "estatico" | "animavel" | "small" | "anel";
  className?: string;
  /** texto acessível; sem ele o símbolo é decorativo */
  titulo?: string;
};

export const LACO_PAPEL = "M75 7H50A43 43 0 1 0 93 50";
export const LACO_MADRUGADA = "M75 6.5H50A43.5 43.5 0 1 0 93.5 50";

export function Simbolo({ variante = "estatico", className, titulo }: Props) {
  const a11y = titulo ? { role: "img", "aria-label": titulo } : { "aria-hidden": true as const };
  const cls = ["sym", className].filter(Boolean).join(" ");

  if (variante === "small") {
    return (
      <svg className={cls} viewBox="0 0 100 100" {...a11y} fill="currentColor">
        <path d="M50 0A50 50 0 1 0 100 50H83A33 33 0 1 1 50 17Z" />
        <path d="M48 0H77.5V17H48Z" />
        <path d="M28 50a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z" />
      </svg>
    );
  }

  if (variante === "anel") {
    return (
      <svg className={cls} viewBox="0 0 100 100" {...a11y} fill="currentColor">
        <g className="v-papel">
          <path d="M50 0A50 50 0 1 0 100 50H86A36 36 0 1 1 50 14Z" />
          <path d="M48 0H75V14H48Z" />
        </g>
        <g className="v-madrugada">
          <path d="M50 0A50 50 0 1 0 100 50H87A37 37 0 1 1 50 13Z" />
          <path d="M48 0H75V13H48Z" />
        </g>
      </svg>
    );
  }

  if (variante === "animavel") {
    return (
      <svg className={`${cls} sym-anim`} viewBox="0 0 100 100" {...a11y}>
        <g className="v-papel">
          <path className="laco" d={LACO_PAPEL} strokeWidth={14} />
          <circle className="ponto" cx={50} cy={50} r={20} data-r={20} />
        </g>
        <g className="v-madrugada">
          <path className="laco" d={LACO_MADRUGADA} strokeWidth={13} />
          <circle className="ponto" cx={50} cy={50} r={19} data-r={19} />
        </g>
      </svg>
    );
  }

  return (
    <svg className={cls} viewBox="0 0 100 100" {...a11y} fill="currentColor">
      <g className="v-papel">
        <path d="M50 0A50 50 0 1 0 100 50H86A36 36 0 1 1 50 14Z" />
        <path d="M48 0H75V14H48Z" />
        <path d="M30 50a20 20 0 1 0 40 0a20 20 0 1 0 -40 0Z" />
      </g>
      <g className="v-madrugada">
        <path d="M50 0A50 50 0 1 0 100 50H87A37 37 0 1 1 50 13Z" />
        <path d="M48 0H75V13H48Z" />
        <path d="M31 50a19 19 0 1 0 38 0a19 19 0 1 0 -38 0Z" />
      </g>
    </svg>
  );
}

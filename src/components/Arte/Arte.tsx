import type { Release } from "@/types";
import { Simbolo } from "@/components/marca/Simbolo";
import s from "./Arte.module.css";

type Props = { r: Release; className?: string } & React.HTMLAttributes<HTMLDivElement>;

/**
 * Capa 9:16. Com `capa`, a imagem do artista. Sem ela, o placeholder do protótipo
 * (gradiente da arte). Era nova: o símbolo gigante cortado no canto superior direito
 * e o lockup pequeno no inferior esquerdo, como manda o README da marca.
 */
export function Arte({ r, className, style, ...rest }: Props) {
  const cor = { "--a": r.cor[0], "--b": r.cor[1], ...style } as React.CSSProperties;
  return (
    <div className={[s.art, "art", className].filter(Boolean).join(" ")} style={cor} {...rest}>
      {r.capa && <img className={s.img} src={r.capa} alt="" loading="lazy" decoding="async" />}
      {r.nova ? (
        <>
          <Simbolo className={s.sym} />
          <span className={s.num}>{r.num}</span>
          <span className={s.lock}>
            <Simbolo variante="small" />
            reela<i>music</i>
          </span>
        </>
      ) : (
        !r.capa && (
          <>
            <span className={s.forma} />
            <span className={s.titulo}>{r.titulo}</span>
            <span className={s.ano}>{r.ano ?? ""}</span>
          </>
        )
      )}
    </div>
  );
}

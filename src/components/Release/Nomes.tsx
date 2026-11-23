import { Fragment } from "react";
import { ARTISTAS } from "@/data";

const COM_PAGINA = new Map(ARTISTAS.filter((a) => a.pagina).map((a) => [a.nome, a.slug]));

/** "raphh, Krys" → nomes com página própria viram link para /gente/<slug>/ */
export function Nomes({ texto }: { texto: string }) {
  const nomes = texto.split(", ");
  return (
    <>
      {nomes.map((n, i) => {
        const slug = COM_PAGINA.get(n);
        return (
          <Fragment key={n + i}>
            {i > 0 && ", "}
            {slug ? <a href={`/gente/${slug}/`} style={{ textUnderlineOffset: 3 }}>{n}</a> : n}
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * "reela music · official partner · Symphonic". O logo da Symphonic (docs/marca/parceiros/) entra como
 * máscara: as letras tomam a cor do texto, então funciona no claro e no escuro sem duas versões.
 */
import s from "./Parceiro.module.css";

export function Parceiro({ className, grande = false }: { className?: string; grande?: boolean }) {
  return (
    <a
      className={[s.parceiro, grande ? s.grande : "", className].filter(Boolean).join(" ")}
      href="https://symphonic.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="reela music, official partner da Symphonic"
    >
      <span className={s.txt} aria-hidden="true">
        <span>reela music</span>
        <span className={s.mudo}>official partner</span>
      </span>
      <span className={s.logo} role="img" aria-hidden="true" />
    </a>
  );
}

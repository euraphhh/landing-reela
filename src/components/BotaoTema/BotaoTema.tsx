"use client";
/**
 * Botão de tema (claro/escuro) com ícone. Mostra o tema que está na tela: lua no escuro, sol no claro.
 * Na troca, o ícone velho gira 90° saindo, encolhe e borra; o novo entra girando do outro lado (0,3s, ease-out).
 * No carregamento o ícone fica parado: só anima depois do primeiro clique.
 */
import { useState } from "react";
import { useTema } from "@/hooks/useTema";
import s from "./BotaoTema.module.css";

const Lua = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
const Sol = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </svg>
);

export function BotaoTema({ className }: { className?: string }) {
  const { tema, alternar } = useTema();
  const [usado, setUsado] = useState(false);
  const escuro = tema === "madrugada";

  return (
    <button
      className={[s.botao, usado ? s.usado : "", className].filter(Boolean).join(" ")}
      type="button"
      aria-label={escuro ? "mudar para o tema claro" : "mudar para o tema escuro"}
      data-theme={escuro ? "dark" : "light"}
      onClick={(e) => {
        setUsado(true);
        const r = e.currentTarget.getBoundingClientRect();
        alternar({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      {/* a key reinicia as animações a cada troca */}
      <span key={tema} className={s.icones}>
        <span className={`${s.ico} ${escuro ? s.on : s.off}`}><Lua /></span>
        <span className={`${s.ico} ${escuro ? s.off : s.on}`}><Sol /></span>
      </span>
    </button>
  );
}

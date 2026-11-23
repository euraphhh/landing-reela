/**
 * Roda inline no <head>, antes da primeira pintura: define data-tema sem flash.
 * Começa sempre em Madrugada (escuro). A escolha no botão vale para a sessão (sessionStorage).
 */
export const CHAVE_TEMA = "reela-tema";
/**
 * Entrada (laço da barra + hero): toca só na primeira página da visita e sem reduced motion.
 * O script marca data-entrada="1" (os componentes leem) e a classe "entra" (o CSS esconde o que vai
 * animar, para não aparecer e sumir); quem anima tira a classe. Rede de segurança: 4s.
 */
export const CHAVE_ENTRADA = "reela-entrou";
export const temaScript = `(function(){var d0=document.documentElement;try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&sessionStorage.getItem("${CHAVE_ENTRADA}")!=="1"){d0.dataset.entrada="1";d0.classList.add("entra");sessionStorage.setItem("${CHAVE_ENTRADA}","1");setTimeout(function(){d0.classList.remove("entra")},4000)}}catch(e){}var t;try{t=sessionStorage.getItem("${CHAVE_TEMA}")}catch(e){}if(t!=="papel"&&t!=="madrugada"){t="madrugada"}var d=document.documentElement;d.dataset.tema=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="papel"?"#FFFFFF":"#000000")})()`;

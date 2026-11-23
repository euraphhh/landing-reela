/**
 * Roda inline no <head>, antes da primeira pintura: define data-tema sem flash.
 * Escolha manual vale para a sessão (sessionStorage); sem ela, o horário decide:
 * Papel das 7h às 18h, Madrugada no resto.
 */
export const CHAVE_TEMA = "reela-tema";
export const temaScript = `(function(){var t;try{t=sessionStorage.getItem("${CHAVE_TEMA}")}catch(e){}if(t!=="papel"&&t!=="madrugada"){var h=new Date().getHours();t=h>=7&&h<18?"papel":"madrugada"}var d=document.documentElement;d.dataset.tema=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="papel"?"#FFFFFF":"#000000")})()`;

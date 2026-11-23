/**
 * Endereço absoluto do site (previews, canonical, sitemap).
 * SITE_URL manda; sem ela, o domínio de produção da Vercel; sem nada, reelamusic.com.
 * Quando o domínio existir: SITE_URL=https://reelamusic.com nas variáveis da Vercel (ou só conectar o domínio).
 */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
export const SITE_URL = (process.env.SITE_URL ?? (vercel ? `https://${vercel}` : "https://reelamusic.com")).replace(/\/$/, "");

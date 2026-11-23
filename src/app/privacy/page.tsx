import type { Metadata } from "next";
import { Casca, Rodape } from "@/components/Casca/Casca";
import { EMAIL } from "@/data/links";
import s from "./privacidade.module.css";

export const metadata: Metadata = {
  title: "privacidade · reela music",
  description: "o que o site da reela guarda e o que o player do Spotify carrega.",
  alternates: { canonical: "/privacy/" },
};

const ATUALIZADO = "23 de novembro de 2026";

export default function Privacidade() {
  return (
    <Casca>
      <main id="content" tabIndex={-1} className={s.pagina}>
        <header className={s.cab}>
          <span className="t-credit">atualizado em {ATUALIZADO}</span>
          <h1 className="t-display">privacidade.</h1>
          <p className={s.lead}>curto e direto: a reela não rastreia você. o que existe está aqui.</p>
        </header>

        <section className={s.bloco} aria-labelledby="p-guarda">
          <h2 className="t-heading" id="p-guarda">o que o site guarda</h2>
          <p>só duas coisas, no seu navegador, e só enquanto a aba estiver aberta (sessionStorage):</p>
          <ul>
            <li><strong>a escolha de tema</strong> (claro ou escuro), se você trocar no botão.</li>
            <li><strong>que a animação de entrada já tocou</strong>, para ela não repetir a cada página.</li>
          </ul>
          <p>não usamos cookies próprios, analytics, pixel de anúncio nem nada que identifique você. fontes e capas são servidas pelo próprio site.</p>
        </section>

        <section className={s.bloco} aria-labelledby="p-spotify">
          <h2 className="t-heading" id="p-spotify">o player do Spotify</h2>
          <p>para você ouvir as prévias, mostramos o player oficial do Spotify. ele é um serviço de terceiro e pode usar cookies e coletar dados conforme a <a href="https://www.spotify.com/br-pt/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">política de privacidade do Spotify</a>.</p>
          <p>na página inicial, o player só carrega quando você abre um lançamento. na página própria de cada lançamento, ele carrega junto com a página.</p>
        </section>

        <section className={s.bloco} aria-labelledby="p-host">
          <h2 className="t-heading" id="p-host">hospedagem</h2>
          <p>o site fica na Vercel, que registra dados técnicos de acesso (como endereço IP e navegador) para entregar as páginas e proteger contra abuso, conforme a <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">política da Vercel</a>.</p>
        </section>

        <section className={s.bloco} aria-labelledby="p-email">
          <h2 className="t-heading" id="p-email">quando você manda uma faixa</h2>
          <p>o botão &ldquo;mandar faixa&rdquo; abre o seu próprio aplicativo de e-mail. o que você enviar chega só para a reela, é usado só para ouvir e responder, e não é repassado para ninguém.</p>
        </section>

        <section className={s.bloco} aria-labelledby="p-direitos">
          <h2 className="t-heading" id="p-direitos">seus direitos</h2>
          <p>pela LGPD, você pode pedir para saber, corrigir ou apagar qualquer dado seu que a reela tenha (na prática, os e-mails que você mandou). escreve para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
        </section>

        <Rodape />
      </main>
    </Casca>
  );
}

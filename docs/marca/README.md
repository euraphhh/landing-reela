# REELA

Selo de trap/R&B. A marca é um laço que nunca fecha segurando um ponto no centro: o loop, o replay e o play em um gesto só. Preto e branco, sempre. A cor de cada release vem da arte do artista, nunca da marca.

## A ideia
- **Laço aberto** = a faixa que volta, o replay, a madrugada que não acaba.
- **Ponto no centro** = o play, a voz, o artista.
- **Cauda reta no topo** = o que separa a REELA de um botão de gravar genérico. Nunca removê-la.

## Cores
A REELA não tem cor de destaque. Contraste é a identidade.

| Papel | Tema Madrugada (padrão) | Tema Papel | Token |
|---|---|---|---|
| Fundo | `#000000` | `#FFFFFF` | `ground` |
| Superfície elevada | `#141414` | `#F4F4F4` | `raised` |
| Texto e logo | `#FFFFFF` | `#000000` | `ink` |
| Texto secundário | `#A3A3A3` | `#5C5C5C` | `muted` |
| Linhas e divisórias | `#2E2E2E` | `#E3E3E3` | `line` |
| Destaque | — (usa `ink`) | — (usa `ink`) | `accent` |
| Botão principal: fundo / texto | `#FFFFFF` / `#000000` | `#000000` / `#FFFFFF` | `button-bg` / `button-text` |
| Botão secundário | contorno `#FFFFFF` 1px, texto `#FFFFFF` | contorno `#000000` 1px, texto `#000000` | `ink` |

Ênfase se faz com peso (Medium), tamanho ou inversão (branco ↔ preto), nunca com cor.

## Tipografia
Duas famílias, papéis separados:
- **Unbounded Light 300** (SIL OFL): a voz da marca. Logo (`reela` e `music`), títulos de capa e de campanha. Larga, geométrica, o "a" de uma curva só. No logo, as letras estão convertidas em contorno.
- **Inter Display** Regular 400 / Medium 500 (SIL OFL): o texto de apoio. Legendas, créditos, botões, corpo.

| Estilo | Família | Tamanho / entrelinha | Peso | Uso |
|---|---|---|---|---|
| display | Unbounded | 96px / 0.92 | 300 | Capas de vídeo, título de campanha |
| title | Unbounded | 40px / 44px | 300 | Título de post, nome do release |
| heading | Inter Display | 24px / 30px | 500 | Seções |
| body | Inter Display | 16px / 24px | 400 | Texto corrido |
| caption | Inter Display | 13px / 18px | 400 | Legendas, datas |
| credit | Inter Display | 11px / 14px | 500 (+0.04em) | Créditos (prod., mix, arte) |

Nome da marca sempre em caixa baixa: `reela`. Unbounded nunca em texto corrido nem abaixo de 20px. Títulos em sentence case.

## Logo
| Arquivo | Uso |
|---|---|
| `reela-horizontal-music` / `-white` | **Principal.** Uma linha: símbolo + `reela` (preto/branco) + `music` em cinza `#8A8A8A` |
| `reela-horizontal` / `-white` | Sem "music": espaço curto, ou se o nome final for só REELA |
| `reela-stacked` / `-white` | Formatos quadrados e posts: símbolo em cima, nome centralizado, `music` espaçado |
| `reela-selo` / `-white` | Selo: símbolo dentro do disco + nome ao lado. Para assinatura de vídeo, merch e herança da REELA Studio |
| `reela-symbol` / `-white` | Símbolo sozinho, a partir de 32px |
| `reela-symbol-small` | Até 24px (traço mais grosso) |
| `avatar-tiktok` | Perfil (cabe no recorte circular) |
| `cover-template` | Base de capa 3000×3000 |

- **Respiro:** espaço livre em volta igual ao diâmetro do ponto.
- **Tamanho mínimo:** lockup com "music" a partir de 120px de largura; abaixo, use a versão sem "music".
- **Proporção:** no horizontal, o símbolo vai da linha de base ao topo do "l" de `reela`; distância símbolo→nome = 0,2 × altura do símbolo; `reela`→`music` = um espaço curto. No empilhado, símbolo = 1,5 × altura do nome. As peças nunca se reposicionam.
- **Versão branca:** já vem com o traço afinado. Não inverta a cor à mão.

## Tom de voz: noturno e poético
A REELA fala como quem escreve às 3 da manhã: pouco, com imagem, mais clima que informação.
- Frases curtas e soltas. Caixa baixa nas legendas.
- Imagens de madrugada, repetição, voltar, ficar: *"de novo, até amanhecer."*, *"aperta o replay."*, *"a faixa que não sai da cabeça."*
- A informação vem depois do clima, em uma linha só: *"sexta, 00h. em todas as plataformas."*
- Com artistas: o mesmo tom, mas claro sobre acordo, split e prazos. Poesia não substitui combinado.
- Emoji: no máximo um, e preferencialmente nenhum.

## A REELA nunca
- **Soa "MC de IG":** nada de coroa, fogo, dinheiro, fontes chamativas, estética de página genérica ou caixa alta gritando.
- **Usa cor no logo:** o logo é sempre preto ou branco, sem gradiente, sombra, contorno ou brilho.
- Fecha o anel, tira a cauda ou o ponto, gira o logo estático, estica ou distorce.
- Põe o logo sobre foto sem contraste. Use uma faixa `raised` ou `ground` por trás.

## Movimento
O laço se comporta como fita: desenha, gira, pulsa. Curvas suaves, nada de quique.
| Animação | Duração | Uso |
|---|---|---|
| **Entrada** | 3s, toca uma vez | Abertura de vídeo e TikTok: o laço se desenha, o ponto cai no centro, o nome sobe |
| **Giro** | 4s, loop | Espera, fundo de live, avatar animado |
| **Pulso** | 2s, loop (~90 BPM) | Teaser e Reels; ajuste ao BPM da faixa |

Cada uma em MP4 (1080×1080), GIF (480px) e Lottie JSON. Não acelere acima de 1,25× nem combine duas ao mesmo tempo.

## Capa
O símbolo gigante, cortado na borda superior direita, é o elemento fixo de toda capa; a arte do artista ocupa o resto. O lockup pequeno fica sempre no canto inferior esquerdo.

## Pendências
- Busca no INPI e busca reversa de imagem: "anel + ponto" é uma forma comum.
- Nome final: REELA ou REELA Music (as duas versões existem).

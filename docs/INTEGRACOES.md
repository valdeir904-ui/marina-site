# Documentação de Integrações e Teste A/B

Este documento centraliza as informações sobre integrações externas, rastreamento de anúncios, fluxo de deploy, teste A/B e páginas da Psicóloga Marina Falcão.

---

## 1. Estrutura de Páginas e Teste A/B

O site agora possui duas páginas principais para estratégia de tráfego e conversão:

1. **Página Principal (`/`)**:
   - Landing page institucional completa com apresentação clássica, módulos de aprofundamento (`DeepDiveSections`), fundamentação teórica, carrossel de artigos recentes do blog, avaliações e detalhes do atendimento.
2. **Página de Conversão para Anúncios (`/psicologaonline`)**:
   - URL dedicada para campanhas de Google Ads ("psicóloga em ribeirão preto", "sala no centro de ribeirão", "presencial e on-line", "psicóloga online", "terapia online").
   - Foco em conversão rápida e tráfego mobile (primeira tela sem rolagem, H1 direto e CTA principal visível).
   - Atendimento presencial no Centro de Ribeirão Preto (sala 310, Edifício Fortes Guimarães) e on-line para todo o Brasil e exterior.
   - Avaliações de pacientes (Google + Doctoralia) posicionadas no topo logo após o hero, com renderização estática/servidor (SSR).
   - Seção dedicada "Atendimento presencial" com endereço completo, link e mapa interativo do Google Maps.
   - Seção "Atendimento on-line" ("Prefere on-line? Atendo de qualquer cidade.") e FAQ com respostas completas no HTML.
   - Botões de agendamento com menor atrito/compromisso para maximizar a taxa de cliques de visitantes mobile (campanhas de anúncio):
     - **Hero (topo)**: "Tirar dúvidas no WhatsApp", acompanhado de "Resposta pela própria Marina · Sem compromisso". Visível na 1ª tela sem rolagem no celular.
     - **Meio da página (Especialidades, Como funciona e Chamada final)**: "Ver horários disponíveis".
     - **Seção Presencial**: mantido "Agendar sessão presencial".
     - **Menu (Header)**: mantido "Agendar sessão".
     - **Botão flutuante**: mantido "Fale comigo no WhatsApp".
   - Todo e qualquer botão para WhatsApp continua utilizando `wa.me`, o número `5516994244626` e disparando automaticamente a conversão do Google Ads.

---

## 2. Integração com Google Ads (Conversão e Mensagem Personalizada de WhatsApp)

### 2.1 Dados da Conversão
- **Ação de conversão**: "WhatsApp – clique (site)"
- **ID da tag do Google**: `AW-18011596440`
- **Rótulo da conversão**: `ftQgCPa48KQdEJjNzIxD`
- **send_to completo**: `AW-18011596440/ftQgCPa48KQdEJjNzIxD`
- **Número do WhatsApp**: `5516994244626`

### 2.2 Identificação de Origem e Mensagem Pré-preenchida para Anúncios
Quando um visitante acessa o site vindo de uma campanha do Google Ads:
1. **Detecção**: Ao carregar a página, o sistema verifica se a URL possui o parâmetro `gclid` ou `utm_source=google` com `utm_medium=cpc`.
2. **Persistência**: Essa origem é salva no `sessionStorage` (`marina_traffic_source_google_ads = '1'`), garantindo que continue válida durante toda a navegação interna do visitante pelas páginas do site.
3. **Mensagens Pré-preenchidas**:
   - **Geral / Hero / Flutuante**:
     - Visitantes do Google Ads: `"Olá, Marina! Vi seu anúncio no Google e gostaria de agendar uma sessão."`
     - Acessos orgânicos/diretos: `"Olá, Marina! Gostaria de agendar uma consulta de terapia."`
   - **Botão da Seção Presencial**:
     - Visitantes do Google Ads: `"Olá, Marina! Vi seu anúncio no Google e gostaria de agendar uma sessão presencial em Ribeirão Preto."`
     - Acessos orgânicos/diretos: `"Olá, Marina! Gostaria de agendar uma sessão presencial em Ribeirão Preto."`
   - **Codificação**: Os textos são obrigatoriamente codificados via `encodeURIComponent` (com espaços codificados como `%20`, nunca `+`), garantindo compatibilidade uniforme em celulares (Android/iOS) e navegadores desktop.
4. **Ponto Central**: A lógica é controlada centralmente em `src/lib/whatsapp.ts` (`isGoogleAdsVisitor()`, `getWhatsappUrl()`) e sincronizada em tempo real com os links da página pelo `src/components/AnalyticsTracker.tsx`.

### 2.3 Onde está o código
1. **`src/lib/whatsapp.ts`**:
   - Detecta parâmetros de anúncio (`gclid`, `utm_source=google`, `utm_medium=cpc`) e grava em `sessionStorage`.
   - Gera a URL formatada do WhatsApp (`wa.me`) injetando a mensagem correspondente.
2. **`src/lib/tracking.ts`**:
   - Declara as constantes `GOOGLE_ADS_ID` e `GOOGLE_ADS_WHATSAPP_LABEL`.
   - Exporta a função `trackWhatsappConversion()`, que despacha o evento de conversão:
     ```ts
     window.gtag('event', 'conversion', {
       send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`,
     });
     ```
3. **`src/components/GoogleAdsScript.tsx`**:
   - Carrega o script oficial do Google Ads (`googletagmanager.com/gtag/js?id=...`) via `next/script` com `strategy="afterInteractive"`.
   - Ignora automaticamente rotas do painel administrativo (`/admin`).
4. **`src/components/AnalyticsTracker.tsx`**:
   - Detecta e persiste a origem de tráfego do Google Ads.
   - Atualiza links de WhatsApp no DOM.
   - Escuta cliques globais em links de WhatsApp (`wa.me` ou `whatsapp.com`), disparando `trackWhatsappConversion()` e `trackEvent('conversion')`.
5. **`src/app/layout.tsx`**:
   - Carrega o `<GoogleAdsScript />` e `<AnalyticsTracker />` no `RootLayout`.

---

## 3. Fluxo de Publicação e Infraestrutura

O ciclo de vida de atualizações do site segue o seguinte fluxo contínuo:

```
[Antigravity IDE] 
       ↓ (git commit & git push)
  [GitHub] (repositório privado na branch main)
       ↓ (webhook automático)
  [Vercel] (build & deploy automatizado)
       ↓ (apontamento DNS)
[marinafalcao.com.br] (DNS gerenciado na Hostinger)
```

1. **Antigravity IDE**: Ambiente local de desenvolvimento onde o código é mantido, testado e validado.
2. **GitHub**: Repositório privado que armazena o histórico de código na branch `main`.
3. **Vercel**: Plataforma de hospedagem serverless conectada ao GitHub. A cada novo push na branch `main`, a Vercel inicia automaticamente o build (`next build`) e publica a nova versão.
4. **Hostinger (DNS)**: O domínio `marinafalcao.com.br` está registrado na Hostinger com os registros DNS apontando para a Vercel.

---

## 4. Gestão de Parâmetros UTM

- As tags e parâmetros UTM (como `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) são configurados no Google Ads (campo "Sufixo do URL final").
- Para direcionar tráfego para a página de teste A/B, configure o URL final do anúncio como:
  `https://www.marinafalcao.com.br/psicologaonline`

---

## 5. Integração com Microsoft Clarity (Mapas de Calor e Gravações de Sessão)

- **Componente**: `src/components/MicrosoftClarity.tsx`
- **Variável de Ambiente**: `NEXT_PUBLIC_CLARITY_ID`
  - A variável é inserida nas variáveis de ambiente do projeto na Vercel (sem necessidade de arquivos `.env` locais no repositório).
  - Caso a variável não esteja configurada ou vazia, o componente não renderiza nada, evitando requisições desnecessárias.
- **Estratégia de Carregamento**: Utiliza `strategy="lazyOnload"` do Next.js Script, garantindo que o rastreamento comportamental seja inicializado somente após o carregamento interativo crítico da página, sem penalizar o LCP ou TBT móvel.
- **Localização**: Carregado globalmente em `src/app/layout.tsx`, cobrindo todas as páginas e rotas do domínio.

---

## 6. Otimizações de Velocidade e LCP (Mobile Performance)

Para assegurar LCP abaixo de 2,5 s no celular (PageSpeed / Lighthouse):
1. **Elemento de LCP Otimizado (Foto do Hero da Marina)**:
   - Servida em formato moderno WebP (`/images/marina-hero-v2.webp`) e AVIF com compressão de alta qualidade.
   - Redimensionada de 1470 px para 780 px (largura 2x para telas retina mobile de ~390 px), reduzindo o peso original de 161 KiB para ~38 KiB (~76% de redução).
   - Renderizada com `priority`, `fetchPriority="high"`, sem `loading="lazy"`, e `sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 340px"`.
   - `next.config.mjs` configurado com `formats: ['image/avif', 'image/webp']`.
2. **Fachada Interativa de Mapa (Google Maps Facade)**:
   - Substituição do `iframe` fixo e pesado do Google Maps por um componente interativo sob demanda (`src/components/GoogleMapsFacade.tsx`).
   - Evita centenas de KiB de scripts e requisições concorrentes na árvore de rede durante o carregamento inicial. O iframe só é instanciado quando o usuário clica para interagir com o mapa.
3. **Eliminação de JavaScript Legado**:
   - Inclusão de `.browserslistrc` com metas modernas (`> 0.3%, not dead, not op_mini all, not IE 11`), eliminando polyfills redundantes gerados pelo build.
4. **Fontes Otimizadas**:
   - Restrição dos pesos das fontes do Google no `RootLayout` (`Playfair_Display`, `Montserrat`, `Wix_Madefor_Text`) mantendo `display: 'swap'`.
5. **Imagens Abaixo da Dobra**:
   - `loading="lazy"` e dimensões explícitas aplicadas para prevenir Cumulative Layout Shift (CLS).

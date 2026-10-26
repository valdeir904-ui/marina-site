# Documentação de Integrações e Teste A/B

Este documento centraliza as informações sobre integrações externas, rastreamento de anúncios, fluxo de deploy, teste A/B e páginas da Psicóloga Marina Falcão.

---

## 1. Estrutura de Páginas e Teste A/B

O site agora possui duas páginas principais para estratégia de tráfego e conversão:

1. **Página Principal (`/`)**:
   - Landing page institucional completa com apresentação clássica, módulos de aprofundamento (`DeepDiveSections`), fundamentação teórica, carrossel de artigos recentes do blog, avaliações e detalhes do atendimento.
2. **Página de Conversão para Anúncios (`/psicologaonline`)**:
   - URL dedicada para campanhas de Google Ads ("psicóloga online", "terapia online").
   - Foco 100% em tráfego de celular (primeira tela sem rolagem, H1 direto e CTA principal em destaque).
   - Atendimento 100% on-line (sem menção a cidades físicas ou presencial).
   - Avaliações de pacientes (Google + Doctoralia) posicionadas no topo logo após o hero, com renderização estática/servidor (SSR).
   - Seção curta "Atendimento on-line" e FAQ com respostas completas no HTML.
   - Botões de agendamento padronizados em 4 pontos estratégicos da página.

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
3. **Mensagem Pré-preenchida**:
   - Para visitantes do Google Ads: `"Olá, Marina! Vi seu anúncio no Google e gostaria de agendar uma sessão."`
   - Para acessos orgânicos/diretos: mensagem padrão configurada no site.
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

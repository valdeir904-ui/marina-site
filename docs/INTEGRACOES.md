# Documentação de Integrações

Este documento centraliza as informações sobre integrações externas, rastreamento de anúncios, fluxo de deploy e DNS da landing page da Psicóloga Marina Falcão.

---

## 1. Atendimento 100% On-line

- A psicóloga Marina Falcão realiza atendimento **exclusivamente on-line por videochamada** para adultos em todo o Brasil e no exterior.
- Não há modalidade presencial nem endereço físico divulgado no site público.
- Os dados estruturados (Schema.org / JSON-LD) e metadados Open Graph refletem `areaServed: "BR"` e serviço de psicoterapia on-line.

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
   - Para acessos orgânicos/diretos: `"Olá, Marina! Gostaria de saber mais sobre as sessões de terapia e agendar uma consulta."`
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

### 2.4 Como testar a conversão e a mensagem
1. **Teste da Mensagem do Google Ads**:
   - Acesse o site com parâmetro de teste: `https://www.marinafalcao.com.br/?gclid=teste123` ou `?utm_source=google&utm_medium=cpc`.
   - Clique em qualquer botão de agendamento de WhatsApp.
   - Verifique se a conversa no WhatsApp abre com a mensagem: `"Olá, Marina! Vi seu anúncio no Google e gostaria de agendar uma sessão."`
2. **Google Tag Assistant**:
   - Instale a extensão [Tag Assistant Companion](https://tagassistant.google.com/) no Chrome.
   - Inicie uma sessão de depuração apontando para a URL da landing page.
   - Clique em qualquer botão de WhatsApp e confirme o evento `conversion` com o `send_to` `AW-18011596440/ftQgCPa48KQdEJjNzIxD`.

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
- A presença de `gclid` ou `utm_source=google&utm_medium=cpc` ativa a mensagem personalizada de anúncio no WhatsApp durante toda a sessão do usuário.

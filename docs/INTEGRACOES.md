# Documentação de Integrações

Este documento centraliza as informações sobre integrações externas, rastreamento de anúncios, fluxo de deploy e DNS da landing page da Psicóloga Marina Falcão.

---

## 1. Integração com Google Ads (Conversão de WhatsApp)

### 1.1 Dados da Conversão
- **Ação de conversão**: "WhatsApp – clique (site)"
- **ID da tag do Google**: `AW-18011596440`
- **Rótulo da conversão**: `ftQgCPa48KQdEJjNzIxD`
- **send_to completo**: `AW-18011596440/ftQgCPa48KQdEJjNzIxD`

### 1.2 Onde está o código
1. **`src/lib/tracking.ts`**:
   - Declara as constantes `GOOGLE_ADS_ID` e `GOOGLE_ADS_WHATSAPP_LABEL`.
   - Declara a tipagem estrita para `window.gtag` e `window.dataLayer` sem uso de `any` solto.
   - Exporta a função `trackWhatsappConversion()`, que verifica se `window.gtag` existe e despacha o evento de conversão:
     ```ts
     window.gtag('event', 'conversion', {
       send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`,
     });
     ```
2. **`src/components/GoogleAdsScript.tsx`**:
   - Client component que carrega o script oficial do Google (`https://www.googletagmanager.com/gtag/js?id=...`) via `next/script` com `strategy="afterInteractive"`.
   - Inicializa as variáveis `dataLayer` e `gtag('config', GOOGLE_ADS_ID)`.
   - Ignora automaticamente rotas do painel administrativo (`/admin`), evitando disparo de dados irrelevantes e scripts desnecessários no painel.
3. **`src/app/layout.tsx`**:
   - Carrega o `<GoogleAdsScript />` no `RootLayout` da aplicação.
4. **`src/components/AnalyticsTracker.tsx`**:
   - Escuta cliques globais no documento.
   - Ao identificar clique em link de WhatsApp (`wa.me` ou `whatsapp.com`), chama `trackWhatsappConversion()` juntamente com `trackEvent('conversion')`.
   - Execução síncrona e não-bloqueante: a abertura da janela do WhatsApp ocorre de forma instantânea sem atrasos.

### 1.3 Como testar a conversão
1. **Google Tag Assistant**:
   - Instale a extensão [Tag Assistant Companion](https://tagassistant.google.com/) no Google Chrome.
   - Inicie uma sessão de depuração apontando para a URL da landing page.
   - Clique em qualquer botão de WhatsApp da página e confirme no painel do Tag Assistant se o evento `conversion` com o `send_to` `AW-18011596440/ftQgCPa48KQdEJjNzIxD` foi disparado com sucesso.
2. **Console do Navegador**:
   - Abra o Developer Tools (F12) no Chrome/Edge e vá para a aba **Console**.
   - Digite `window.dataLayer` e pressione Enter para visualizar os eventos empilhados.
   - Clique em um botão de WhatsApp e inspecione novamente o `window.dataLayer` para verificar a entrada com `['event', 'conversion', { send_to: 'AW-18011596440/ftQgCPa48KQdEJjNzIxD' }]`.
3. **Aba Network**:
   - Filtre as requisições por `googleadservices.com` ou `google-analytics.com` e clique no link de WhatsApp para visualizar o envio da beacon/requisição HTTP.

### 1.4 Como trocar o rótulo de conversão futuramente
Caso o rótulo ou o ID da conversão mudem no Google Ads:
1. Abra o arquivo `src/lib/tracking.ts`.
2. Altere o valor de `GOOGLE_ADS_WHATSAPP_LABEL` (ou `GOOGLE_ADS_ID`, se aplicável):
   ```ts
   export const GOOGLE_ADS_WHATSAPP_LABEL = 'NOVO_ROTULO_AQUI';
   ```
3. Salve o arquivo, faça commit e push para o repositório.

---

## 2. Fluxo de Publicação e Infraestrutura

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
2. **GitHub**: Repositório privado que armazena o histórico de código. A branch padrão é a `main`.
3. **Vercel**: Plataforma de hospedagem serverless conectada ao GitHub. A cada novo push na branch `main`, a Vercel inicia automaticamente o build (`next build`) e publica a nova versão.
4. **Hostinger (DNS)**: O domínio `marinafalcao.com.br` está registrado ou gerenciado na Hostinger, com os registros DNS (tipo A / CNAME) apontando para os endereços da Vercel. Não é necessário alterar as configurações de DNS na Hostinger para deploys de rotina.

---

## 3. Gestão de Parâmetros UTM

- As tags e parâmetros UTM (como `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) **são adicionados pelo Google Ads**, e **não** inseridos no código-fonte da aplicação.
- No Google Ads, configure o campo **"Sufixo do URL final"** (Final URL suffix) no nível de conta, campanha ou grupo de anúncios (exemplo: `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}`).
- A landing page recebe essas tags na URL de forma transparente e preserva a integridade de qualquer navegação e conversão.

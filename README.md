# TERAMIM® — IA de Regulação Emocional

App vendido como assinatura de **R$ 29,99/mês** (método terAmim, de Rosi Aguiar).

## Como rodar

```bash
npm install
npm run dev:all   # sobe o backend (3001) + o frontend (5173)
```

Abra http://localhost:5173

## O que tem dentro

- **Conversa com a IA TERAMIM®** (chat real, se a IA estiver configurada; senão, modo guiado automático)
- **Biblioteca RÉSP®**: 8 práticas de respiração com player animado
- **Áudios guiados** manhã/meio-dia/noite (com a voz clonada, quando configurada)
- **SOS fisiológico** para picos de emoção
- **Página de venda** + assinatura R$ 29,99/mês (link de checkout configurável)
- **Painel da Rosi** (`/#/admin`, PIN `0707`): usuárias, acessos, assinaturas, MRR e configurações

## Configurar a IA real (conversa)

1. Copie `.env.example` para `.env`
2. Peça uma chave de API em um provedor compatível (OpenAI, DeepSeek, etc.)
3. Preencha no `.env`:
   - `USER_LLM_API_KEY=sua-chave`
   - `USER_LLM_BASE_URL=https://api.openai.com/v1` (ou o do seu provedor)
   - `USER_LLM_MODEL=gpt-4o-mini`
4. Reinicie o servidor (`npm run server`)

Sem a chave, o app funciona no **modo guiado** (o roteiro do Prompt-Mestre, sem custo).

## Configurar a SUA voz (clonagem)

1. Crie conta em `elevenlabs.io`
2. **VoiceLab → Instant Voice Cloning** → envie os áudios da Rosi
3. Copie o **Voice ID** e a chave da API
4. Preencha no `.env`:
   - `USER_ELEVENLABS_API_KEY=...`
   - `USER_ELEVENLABS_VOICE_ID=...`
   - `USER_ELEVENLABS_MODEL=eleven_multilingual_v2`
5. Reinicie o servidor

Sem isso, os áudios usam a voz padrão do navegador.

## Para onde vai o dinheiro

O app **não recebe dinheiro**. A cobrança acontece no seu provedor de pagamento:

| Provedor | Bom para | Como funciona |
|---|---|---|
| **Hotmart / Kiwify** | Assinatura de produto digital | Você cria o produto e cola o **link de checkout** aqui |
| **Mercado Pago / PagBank** | Assinatura e Pix | Você configura a cobrança recorrente e integra o link |
| **Pix direto** | Simples | Chave Pix + confirmação manual |

Para ativar: no painel da Rosi (`/#/admin` → Configurações) cole o link de checkout do seu provedor.
Ao assinar, a cliente é levada para esse link — e o pagamento cai na **sua** conta. Sem checkout configurado, o app roda em modo demonstração.

## Segurança

- As chaves ficam só no `.env` (ignorado pelo git) — nunca no navegador
- Protocolo de crise ativo: CVV 188, SAMU 192 e CAPS são indicados em emergências
- O TERAMIM é apoio à regulação emocional e **não substitui** atendimento médico/psicológico

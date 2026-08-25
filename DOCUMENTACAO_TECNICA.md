# P.A.R.E® · terAmim — Documentação Técnica Completa

> Documento de referência para qualquer desenvolvedor ou IA entender o projeto, mantê-lo e corrigir problemas **sem acesso prévio ao código**. Leia o mapa de arquivos e a seção "Problemas comuns" primeiro.

---

## 1. Visão geral

**P.A.R.E®** ("Paz não é evento, paz é treino") é um app web de **regulação emocional para mulheres (40+)**, metodologia da terapeuta **Rosi Aguiar**. A **terAmim** é a IA que avalia o estado emocional da usuária, identifica sua necessidade do momento (segurança / pertencimento / reconhecimento / ser amada) e a direciona para protocolos de **respiração guiados pela voz da própria Rosi**.

**Público-alvo:** mulheres que compram acesso (checkout Kiwify) e usam o app diariamente, instalável no celular como PWA.

**Posicionamento de produto:** IA = *extensão digital da Rosi* — fala no pensamento dela, nunca como entidade separada.

---

## 2. Arquitetura

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  Frontend (React + Vite)    │  HTTP  │  Backend (Express)           │
│  SPA com hash router        │ ─────▶ │  porta 3001                  │
│  - /#/ , /#/assinar         │  /api  │  - /api/* (JSON + upload)    │
│  - /#/app , /#/admin        │        │  - /audio/* (MP3 estáticos)  │
│  - PWA (manifest + sw)      │        │  - /logo/* (logo)            │
└─────────────────────────────┘        │  - serve dist/ (frontend     │
                                       │    buildado, se existir)     │
                                       └──────────────────────────────┘
                                                 │  env + JSON files
                                                 ▼
                                       DATA_DIR (dados persistentes)
                                       ├─ content.json, ai-config.json
                                       ├─ admin-config.json, checkout-config.json
                                       ├─ audio/*.mp3, logo/*
```

- **Desenvolvimento:** Vite na 5173 com proxy de `/api`, `/audio`, `/logo` para o Express na 3001.
- **Produção (Render):** um único serviço Express serve o frontend buildado (`dist/`) + a API na mesma origem. HTTPS via Render.
- **Persistência:** arquivos JSON + áudios em `DATA_DIR` (Render: disco montado em `/data`).

---

## 3. Tecnologias e bibliotecas

**Dependências de produção** (`package.json`):
| Pacote | Função |
|---|---|
| `react` 18, `react-dom` 18 | UI |
| `react-router-dom` 6 | Rotas (HashRouter) |
| `express` 5 | Servidor HTTP + API |
| `multer` 2 | Upload de áudios/logo |
| `dotenv` | Variáveis de ambiente (`.env`) |
| `concurrently` | Rodar front+back juntos (`dev:all`) |

**Dev:** `vite` 5, `@vitejs/plugin-react` 4.
**IA:** chamadas HTTP diretas ao estilo OpenAI (`fetch`) — DeepSeek por padrão, configurável.
**TTS (opcional):** ElevenLabs via `fetch`.
**Testes headless:** `playwright-core` (não está no package.json; instalado ad-hoc para validação).

---

## 4. Estrutura de arquivos

```
teramim-app/
├── index.html              # HTML raiz (links manifest/apple-touch-icon, fontes)
├── package.json
├── vite.config.js          # proxy /api→3001, build, allowedHosts
├── render.yaml             # Blueprint de deploy no Render
├── LAUNCH.md               # Guia de lançamento (deploy)
├── GUIA_PASSO_A_PASSO.md   # Guia não técnico (para a Rosi)
├── HANDOFF.md              # Resumo de referência rápida
├── DOCUMENTACAO_TECNICA.md # este documento
├── src/
│   ├── main.jsx            # entry; registra service worker em PROD
│   ├── App.jsx             # HashRouter: /, /assinar, /app, /admin
│   ├── api/client.js       # todas as chamadas fetch à API
│   ├── engine/
│   │   ├── store.js        # estado local (localStorage): usuário, acessos, assinatura
│   │   └── engine.js       # motor de fluxo (probabilidades, transições)
│   ├── engine/contentStore.js + ContentContext.jsx  # conteúdo do servidor c/ fallback
│   ├── data/               # bancos de conteúdo
│   │   ├── quiz.js, emotions.js, decrees.js, protocols.js
│   │   ├── universeQuestions.js, audioPractices.js, ...
│   ├── components/         # GuidedFlow, AiChat, ProtocolPlayer, RespModal,
│   │                       # UniverseAsk, InstallApp, RitualScreen, ChallengeScreen,
│   │                       # AudioPractice, AudioUpload, RespLibrary, ScriptedChat,
│   │                       # SosFlow, Onboarding, ContentEditor, UpsellModal, ...
│   ├── pages/              # Landing.jsx, AppPage.jsx, Subscribe.jsx, Admin.jsx
│   └── styles/             # global.css, components.css, app.css, admin.css
├── public/                 # manifest.webmanifest, sw.js, ícones, screenshots, logo
├── server/
│   ├── index.js            # API Express completa
│   ├── masterPrompt.js     # prompt-mãe da terAmim
│   └── *.json              # dados (ver seção 9)
├── scripts/engine.test.mjs # testes do motor
└── deploy/                 # (alternativa VPS) Dockerfile, compose, Caddyfile
```

---

## 5. Rotas da aplicação (hash router)

| URL | Tela | Descrição |
|---|---|---|
| `/#/` | Landing | Página de vendas (hero, benefícios, FAQ, CTA) |
| `/#/assinar` | Subscribe | Checkout Kiwify (nome, e-mail, método) |
| `/#/app` | AppPage | App principal com abas (ver abaixo) |
| `/#/admin` | Admin | Painel da Rosi (PIN) — conteúdo, áudios, IA, checkout |
| `*` | → `/#/` | Redireciona |

**Abas do app** (`AppPage.jsx`): **Minha avaliação emocional** (guided), **Ritual diário**, **Meu processo** (desafio), **Respiração consciente** (biblioteca), **Protocolos** (áudios), **SOS**.

---

## 6. Fluxos do app (`GuidedFlow.jsx`)

Estados: `home → feeling → quiz → result → reflect → safety → player → cura → calm_warn → universe_close`.

1. **Home:** 4 opções — "Quero só me acalmar", "Quero saber do que preciso hoje", "Sessão de alívio" (Frequência da Cura), "Pergunte ao Universo". Botão "Instalar o P.A.R.E." (PWA).
2. **Check-in emocional (`feeling`):** escalas de emoções → nível de ativação.
3. **Quiz (`quiz`):** 5 perguntas → necessidade dominante (segurança / pertencimento / reconhecimento / ser amada) via motor probabilístico (`engine.js`).
4. **Resultado (`result`):** mostra a necessidade + prática recomendada.
5. **Reflexão (`reflect`):** áudio curto + pergunta de reflexão (ScriptedChat).
6. **Segurança (`safety`):** verificação/consentimento antes de prática longa.
7. **Player (`player`):** protocolo de respiração com áudio da Rosi (ProtocolPlayer) — segue para decreto → reorientação de crença → encerramento.
8. **Frequência da Cura (`cura`):** sessão de alívio; check-in com só "Melhor"/"Muito melhor"; conclui direto (sem reorientação).
9. **Calma direta (`calm_warn`):** aviso de fones → RÉSP ZERO® direto.
10. **Universo (`universe_close`):** após "Pergunte ao Universo", encerra com a pergunta.

**Regras de negócio sensíveis (NÃO reverter):**
- Decreto do medo: *"Não aceito nenhuma aparência de medo."* (nunca a variação genérica).
- Perguntas do Universo são **diretas**, sem prefixos "Fecho os olhos e pergunto".
- Modal do Universo mostra: **"Respire calmamente, e pergunte:"**.
- Fluxos "só me acalmar" e "Frequência da Cura" concluem direto.
- Botão do decreto: **"Levar comigo"** → conclui.
- terAmim é **extensão da Rosi**, nunca entidade separada.

---

## 7. Funcionalidades implementadas

- **Check-in emocional** com gráfico de evolução e frequência diária.
- **Quiz das 4 necessidades** com motor probabilístico de transições.
- **Protocolos de respiração** guiados por áudio (RÉSP ZERO®, RÉSP®, etc.), player com fases (inspira/expira) e progresso.
- **Frequência da Cura** (sessão de alívio para dor/peso emocional).
- **Perguntas ao Universo:** temas → 3 perguntas cada; instrução de escrita à mão; "Levar comigo".
- **Ritual diário** (manhã/noite) e **Desafio/Meu processo** (sequência de dias, sequência).
- **Biblioteca RÉSP®** (práticas de respiração) e **Protocolos** (áudios).
- **SOS** (recursos de apoio).
- **terAmim (IA):** chat contextual com a persona da Rosi (`/api/ai`), incluindo interpretação de avaliações.
- **TTS (opcional):** voz gerada via ElevenLabs (`/api/tts`).
- **Checkout Kiwify** real: `/api/config` → `checkoutUrl`; abre popup + botão-âncora de fallback; passa `name`, `email`, `price` como query params.
- **Assinatura local** (ativação manual pelo painel) com plano e status.
- **Painel da Rosi (`/#/admin`):** login por PIN; editor de conteúdo (textos, preço, práticas); upload de áudios por rótulo; upload de logo; config IA; config checkout; ativação de assinaturas.
- **PWA:** manifest com ícones (64/192/512/maskable/svg) + screenshots, service worker (cache-first estáticos, network-only API/áudio), instalação com 1 toque no Android (`beforeinstallprompt`) e instruções manuais no iPhone.
- **Landing page de vendas** com preço editável.

---

## 8. API — endpoints

| Método | Rota | Descrição | PIN |
|---|---|---|---|
| GET | `/api/health` | Health check (usado pelo Render) | — |
| GET | `/api/config` | `{ aiConfigured, ttsConfigured, llmModel, checkoutUrl }` | — |
| PUT | `/api/checkout` | Salva `{ url }` do checkout | ✔ |
| PUT | `/api/ai-config` | Salva chave/base/modelo da IA | ✔ |
| POST | `/api/upload` | Upload de MP3 (multipart `file`) | ✔ |
| GET | `/api/audios` | Lista áudios + metadados | — |
| POST | `/api/logo-upload` | Upload do logo | ✔ |
| GET | `/api/logo` | Retorna o logo atual | — |
| GET/PUT | `/api/content` | Conteúdo editável (landing, preço, práticas) | PUT ✔ |
| POST | `/api/admin/login` | Valida PIN | — |
| PUT | `/api/admin-pin` | Troca o PIN | ✔ |
| POST | `/api/ai` | Chat com a terAmim | — |
| POST | `/api/tts` | Gera áudio (ElevenLabs) | — |
| GET | `/audio/*`, `/logo/*` | Arquivos estáticos | — |
| GET | `/*` | Serve `dist/` + fallback SPA (se `dist` existir) | — |

**CORS:** não configurado — em produção o frontend e a API estão na mesma origem. Se separar origens, adicionar CORS.

---

## 9. Persistência e dados

**Client-side (`localStorage`):** usuário, nome, e-mail, histórico de check-ins, estado de assinatura, acessos, fallback de checkout.

**Server-side (`DATA_DIR`, default = pasta `server/`):**
| Arquivo | Conteúdo |
|---|---|
| `content.json` | Textos, preço, práticas (editado no painel) |
| `ai-config.json` | Chave/base/modelo da IA |
| `admin-config.json` | PIN do painel |
| `checkout-config.json` | Link Kiwify/Hotmart |
| `audio/` | MP3s enviados (nome = rótulo, ex.: `manha.mp3`) |
| `logo/` | Logo enviado |

**Precedência de configuração:** env vars > arquivos JSON (a função `getLLMConfig`/`getAdminPin`/`getCheckoutUrl` lê o JSON primeiro e cai para env se ausente). No Render, `DATA_DIR=/data` (disco persistente).

**Importante:** arquivos de configuração com segredos estão no `.gitignore` — **nunca commitar**.

---

## 10. Integrações

- **IA (DeepSeek/OpenAI-compatível):** `POST /api/ai` monta o prompt-mãe (`server/masterPrompt.js`) + histórico e chama a API. Modelo padrão `deepseek-chat`, base `https://api.deepseek.com/v1`, configurável via painel/env.
- **TTS (ElevenLabs, opcional):** `POST /api/tts` com `USER_ELEVENLABS_API_KEY`, `USER_ELEVENLABS_VOICE_ID`, modelo `eleven_multilingual_v2`.
- **Voz da Rosi:** MP3s reais enviados no painel; os protocolos referenciam por rótulo (`manha`, `zero`, `cura`, etc.).
- **Pagamento:** checkout externo (Kiwify) — o app redireciona para o link configurado; não processa pagamento internamente. Ativação de acesso é manual no painel.

---

## 11. Como rodar localmente

```bash
npm install
npm run dev:all    # Express (3001) + Vite (5173) juntos
```

- App: http://localhost:5173/#/app · Painel: /#/admin · Checkout: /#/assinar
- Servidor puro: `npm run server` (na 3001, serve `dist/` se existir)
- Build: `npm run build` · Preview: `npm run preview`
- Testes do motor: `node scripts/engine.test.mjs` (deve sair `ALL TESTS PASSED`)

**PIN padrão local:** `052123` (via `server/admin-config.json`). No deploy, usar env `ADMIN_PIN`.

---

## 12. Deploy

### Render (recomendado — ver `render.yaml`)
1. Push do projeto para um repositório GitHub (arquivos na raiz, incluindo `render.yaml`).
2. Render → **New + → Blueprint** → selecionar o repositório.
3. Definir env vars: `DATA_DIR=/data`, `USER_LLM_API_KEY`, `USER_LLM_BASE_URL=https://api.deepseek.com/v1`, `USER_LLM_MODEL=deepseek-chat`, `ADMIN_PIN`, `CHECKOUT_URL`.
4. Deploy automático a cada push. Domínio: Settings → Custom Domains (HTTPS automático).

### VPS/Docker (alternativa — pasta `deploy/`)
`docker compose up -d --build` com Caddy (HTTPS) na frente; dados em volume `./data`. Ver `LAUNCH.md`.

**Antes do lançamento:** remover `public/teramim-app.zip` (artefato temporário de entrega) e reconstruir.

---

## 13. Configurações-chave (onde mexer)

| O quê | Onde |
|---|---|
| Persona/regras da IA | `server/masterPrompt.js` |
| Decretos | `src/data/decrees.js` |
| Perguntas do Universo | `src/data/universeQuestions.js` |
| Abas / nomes de tela | `src/pages/AppPage.jsx` |
| Conteúdo/landing/preço | Painel → Conteúdo (`server/content.json`) |
| Áudios | Painel → Meus áudios (`server/audio/`) |
| Chave da IA | Painel → Configurações, ou env |
| Link de pagamento | Painel → Configurações, ou env `CHECKOUT_URL` |
| Cache do PWA | `public/sw.js` → `CACHE_VERSION` (bump para forçar atualização) |
| Ícones/manifest | `public/` |

---

## 14. Problemas comuns e correção

1. **"A IA ainda não foi conectada"** → falta chave em `ai-config.json`/env; conferir `GET /api/config` → `aiConfigured:true`.
2. **Checkout não abre** → `checkoutUrl` vazio em `GET /api/config`; salvar no painel ou env `CHECKOUT_URL`. Popups bloqueados: usar o botão-âncora "Abrir página de pagamento".
3. **Áudio não toca** → conferir `server/audio/` e rótulo do protocolo; `GET /api/audios`.
4. **Conteúdo "padrão"** → servidor caiu para `{}`; app cai no fallback local.
5. **PWA não atualiza no celular** → bump `CACHE_VERSION` no `sw.js` + rebuild.
6. **Texto cortado no topo do modal (iOS)** → modais usam overlay `align-items:flex-start` + `overflow-y:auto` + `margin:0 auto` (nunca `margin:auto` vertical em conteúdo alto — corta o topo no Safari). Não regredir para `align-items:center`.
7. **Modal do Universo** → overlay único rolável; reset de `scrollTop` no `useLayoutEffect`; não usar `scrollIntoView` (causava salto no iOS).

---

## 15. Testes e validação

- `node scripts/engine.test.mjs` → transições e regras do motor (ALL TESTS PASSED).
- Headless (Playwright): fluxos principais validados — onboarding, quiz, player, universo, checkout Kiwify (popup + âncora), modal de instalação, manifest/SW.
- Build limpo: `npm run build`.

---

## 16. Segurança

- PIN do painel nunca exposto no frontend (validado no servidor).
- Segredos (chave IA, PIN, checkout) fora do repositório (`.gitignore`).
- Uploads: restritos a tipos/áudio (`multer`), salvos fora do build.
- Recomenda-se revisar limites de tamanho e validação de arquivo ao expor publicamente.

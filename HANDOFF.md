# P.A.R.E® · terAmim — Documento de referência (handoff)

Este documento reúne tudo que um desenvolvedor precisa para entender e resolver problemas do app. Se algo quebrar, comece por aqui.

---

## O que é o app

**P.A.R.E® (Paz não é evento, paz é treino)** — metodologia de regulação emocional para mulheres (40+), criada por **Rosi Aguiar**. A **terAmim** é a IA que avalia o estado emocional da mulher, identifica a necessidade (segurança / pertencimento / reconhecimento / ser amada) e direciona para protocolos de respiração com a voz da Rosi.

**Fluxo principal:** check-in emocional → quiz das 4 necessidades → protocolo de respiração → pergunta/decreto de consciência → reorientação de crença → encerramento. Também há fluxos de calma direta, Frequência da Cura, Perguntas ao Universo, ritual diário, desafio/processo, biblioteca RÉSP® e SOS.

---

## Arquitetura

- **Frontend:** React + Vite SPA, **hash router** (URLs `/#/app`, `/#/assinar`, `/#/admin`). Build sai em `dist/`.
- **Backend:** Node.js + Express na porta **3001** (`server/index.js`). Serve `/api/*`, `/audio/*`, `/logo/*` e — quando existe `dist/` — também serve o frontend pronto.
- **No desenvolvimento:** Vite (porta 5173) faz proxy de `/api`, `/audio`, `/logo` para o servidor 3001.
- **Em produção:** o próprio servidor Express serve o frontend + API na mesma origem (single origin). Caddy faz HTTPS.

### Tecnologias
- React 18, Vite, react-router-dom (HashRouter)
- Express, multer (upload de áudios), dotenv
- IA: DeepSeek/OpenAI via API (chat), ElevenLabs (TTS, opcional)
- Playwright-core só para testes headless

---

## Como rodar localmente

Pré-requisito: Node 18+ instalado.

```bash
cd teramim-app
npm install
npm run dev:all   # sobe API (3001) + Vite (5173) juntos
```

Abre em `http://localhost:5173`. O app fica em `http://localhost:5173/#/app`.

Para gerar o build de produção e testar:

```bash
npm run build
npm run preview   # Vite na 5173 com proxy para a API 3001
npm run server    # ou só a API, na 3001 (também serve o dist se existir)
```

---

## Mapa dos arquivos importantes

| Arquivo | O que é |
|---|---|
| `server/index.js` | API Express completa (config, upload, áudios, conteúdo, admin, IA, TTS, checkout) |
| `server/masterPrompt.js` | Prompt-mãe da terAmim (persona como extensão da Rosi, regras de interação) |
| `server/content.json` | Conteúdo editável pelo painel (landing, preço, práticas, áudios) |
| `server/ai-config.json` | Chave/base/modelo da IA (salvos pelo painel) |
| `server/checkout-config.json` | Link do checkout Kiwify/Hotmart (salvo pelo painel) |
| `server/admin-config.json` | PIN de acesso ao painel da Rosi |
| `server/audio/` | MP3s enviados pela Rosi (uploads) |
| `server/logo/` | Logo enviado |
| `src/main.jsx` | Entry; registra o service worker (PWA) |
| `src/App.jsx` | Rotas (hash): landing, app, assinar, admin |
| `src/pages/` | Landing, AppPage (abas), Subscribe, Admin |
| `src/components/GuidedFlow.jsx` | Fluxo guiado principal (check-in, quiz, protocolo, decreto, encerramento) |
| `src/components/UniverseAsk.jsx` | Modal "Pergunte ao Universo" |
| `src/components/InstallApp.jsx` | Botão + instruções "Instalar o P.A.R.E." |
| `src/data/` | Bancos: quiz, emoções, decretos, protocolos, perguntas do universo, áudios |
| `src/engine/store.js` | Estado local (localStorage): usuário, acessos, assinatura, checkout fallback |
| `src/engine/contentStore.js` + `ContentContext.jsx` | Conteúdo vindo do servidor, com fallback local |
| `src/api/client.js` | Chamadas fetch para a API |
| `public/manifest.webmanifest` + `public/sw.js` | PWA (instalável) |
| `deploy/` | Dockerfile, docker-compose, Caddyfile, .env.example |
| `LAUNCH.md` | Guia de lançamento passo a passo |
| `scripts/engine.test.mjs` | Testes do motor de fluxo (`node scripts/engine.test.mjs`) |

---

## Configurações (onde cada coisa se configura)

| Configuração | Onde |
|---|---|
| **Chave da IA** | Painel da Rosi → Configurações → IA (salva em `server/ai-config.json`); ou env `USER_LLM_API_KEY` |
| **Link do pagamento (Kiwify)** | Painel da Rosi → Configurações → Link de pagamento (salva em `server/checkout-config.json`); ou env `CHECKOUT_URL` |
| **PIN do painel** | env `ADMIN_PIN` ou `server/admin-config.json` (padrão local: 052123) |
| **Conteúdo (textos, preço, práticas)** | Painel da Rosi → Conteúdo (salva em `server/content.json`) |
| **Áudios da voz da Rosi** | Painel da Rosi → Meus áudios (MP3s em `server/audio/`) |
| **Persona da terAmim** | Editar `server/masterPrompt.js` |
| **Perguntas do Universo / decretos** | `src/data/universeQuestions.js`, `src/data/decrees.js` |
| **Preço exibido** | `server/content.json` → `pricing.price` (editor de conteúdo) |

---

## Onde os dados ficam

- **Local (desenvolvimento):** `server/` (arquivos .json + pasta audio/).
- **Produção (Render):** tudo em `DATA_DIR` (no Render, o disco montado em `/data`; via env `DATA_DIR=/data`). Os áudios e configurações ficam nesse disco e sobrevivem a deploys.
- **Backup:** copiar a pasta de dados inteira. Ver `LAUNCH.md → Backup` (aba Shell do Render).

### Deploy no Render (plano pago)
- Arquivo `render.yaml` na raiz do repositório (Blueprint: `npm install && npm run build`; start: `node server/index.js`; health check `/api/health`; disco `/data` 1GB).
- Variáveis de ambiente: `DATA_DIR=/data`, `USER_LLM_API_KEY`, `USER_LLM_BASE_URL=https://api.deepseek.com/v1`, `USER_LLM_MODEL=deepseek-chat`, `ADMIN_PIN`, `CHECKOUT_URL`.
- Domínio: aba Settings → Custom Domains (www.rosiaguiar.com + rosiaguiar.com). HTTPS automático.
- **IMPORTANTE antes do lançamento:** remover `public/teramim-app.zip` (arquivo temporário para a Rosi baixar o código) e reconstruir.

---

## Problemas comuns e como resolver

### 1. "A IA não responde" / `A IA ainda não foi conectada`
- Confirmar que `ai-config.json` tem chave, ou `USER_LLM_API_KEY` no `.env`.
- Testar: `curl http://localhost:3001/api/config` → `"aiConfigured": true`.
- A chave expirou/sem crédito? Trocar no painel ou no `.env`.

### 2. "O checkout não abre"
- Confirmar link no painel (Configurações → Link de pagamento) OU `CHECKOUT_URL` no `.env`.
- Testar: `curl http://localhost:3001/api/config` → campo `checkoutUrl` preenchido.
- O app abre o checkout em **nova aba**; se o navegador bloquear popup, há o botão "Abrir página de pagamento".
- Foi pago mas sem acesso? A ativação é manual/local no momento — o painel Admin permite ativar acessos (aba Assinaturas).

### 3. "Áudio não toca" / "áudio não enviado"
- Confirmar que o MP3 foi enviado em Meus áudios e aparece em `server/audio/`.
- O protocolo usa um rótulo (ex.: `manha`, `zero`, `cura`). Conferir se o áudio do rótulo certo foi enviado.
- Verificar `curl http://localhost:3001/api/audios`.

### 4. "Conteúdo não aparece" (preço, textos)
- O app carrega de `/api/content` com fallback local. Se o servidor está fora do ar, volta para os valores padrão do código.
- Salvar pelo painel grava em `server/content.json`.

### 5. "O site caiu"
- No VPS: `cd /opt/teramim-app/deploy && docker compose ps` (deve estar `Up`).
- Logs: `docker compose logs --tail=100 app`.
- Servidor reinicia sozinho com `restart: unless-stopped`. Se não subir, olhar o log acima.

### 6. "Ainda vejo versão antiga"
- Hard refresh (Ctrl/Cmd+Shift+R). PWA tem cache: em produção, limpar cache do site (ou esperar o `CACHE_VERSION` novo em `public/sw.js`).
- Garantir que o `dist/` atualizado foi enviado e `docker compose up -d --build` rodou.

### 7. "Modal do Universo corta o topo"
- Já corrigido: overlay único rolável, `overflow-anchor: none`, reset de `scrollTop` + `scrollIntoView` em `UniverseAsk.jsx`.

### 8. "Decreto errado / texto errado nas perguntas"
- Perguntas do Universo: `src/data/universeQuestions.js` (OPENINGS/STEMS).
- Decretos: `src/data/decrees.js`.
- Comportamento da IA: `server/masterPrompt.js`.

---

## PWA (instalar no celular)

- Manifest: `public/manifest.webmanifest` (ícones `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).
- Service worker: `public/sw.js` (cache do app shell, nunca cacheia `/api`).
- Botão "Instalar o P.A.R.E.": `src/components/InstallApp.jsx`.
- Ao mudar o build, aumentar `CACHE_VERSION` em `public/sw.js` para forçar atualização nos celulares.

---

## Testes

```bash
node scripts/engine.test.mjs   # valida o motor de fluxo (deve sair "ALL TESTS PASSED")
npm run build                  # confirma que compila
```

---

## Decisões de produto que NÃO devem ser revertidas sem falar com a Rosi

- Decreto do medo: **"Não aceito nenhuma aparência de medo"** (nunca "essa aparência" genérica após pedir para imaginar).
- Perguntas do Universo são **diretas**, sem prefixos "Fecho os olhos e pergunto" / "Respirando fundo, eu pergunto".
- No modal do Universo: **"Respire calmamente, e pergunte:"** antes da pergunta.
- Fluxos "Quero só me acalmar" e "Frequência da Cura" concluem direto (sem reorientação de crença).
- Na Frequência da Cura, check-in tem só "Melhor"/"Muito melhor" (sem "Estou igual").
- Botão do decreto: **"Levar comigo"** → conclui o fluxo.
- TerAmim é a **extensão digital da Rosi Aguiar**, fala com o pensamento dela.

# LANÇAMENTO DO P.A.R.E® — passo a passo (Render)

Guia para colocar o P.A.R.E® no ar em **https://www.rosiaguiar.com** com pagamento via Kiwify, app instalável no celular e dados guardados com segurança.

> Escolhemos o **Render pago** (US$ 7/mês ≈ R$ 35–40/mês): os áudios da Rosi ficam salvos, o site abre rápido e o HTTPS vem pronto — tudo sem terminal.

---

## O que o app precisa para funcionar
1. **O código do site** (já pronto neste projeto).
2. **Um servidor** que roda o site — no nosso caso, o Render.
3. **O domínio** www.rosiaguiar.com apontando para o site.
4. **As chaves**: IA (DeepSeek), PIN do painel da Rosi e link da Kiwify.

---

## PASSO 1 — Criar uma conta no GitHub (gratuita)

O GitHub é o "depósito" onde o código do site fica guardado. O Render lê de lá.

1. Acesse **github.com** e crie uma conta (e-mail + senha).
2. Entre, clique em **New** (ou **+ → New repository**).
3. Nome do repositório: `teramim`
4. Deixe **Public** (público é o mais simples; o código do site não tem segredo — as chaves ficam no Render, não no GitHub).
5. Deixe desmarcada a opção de criar README.
6. Clique em **Create repository**.

---

## PASSO 2 — Enviar o código do site para o GitHub

Você vai receber um arquivo **`teramim-app.zip`** com todo o site (sem senhas — elas vão no Render). Para enviá-lo:

1. No GitHub, dentro do repositório `teramim`, clique em **Add file → Upload files**.
2. Arraste o arquivo **`teramim-app.zip`** para dentro da janela. O GitHub **descompacta sozinho** e coloca os arquivos na raiz do repositório.
3. Role até o fim, digite uma mensagem qualquer (ex.: "site") e clique em **Commit changes**.

> Confira que os arquivos subiram: deve existir `package.json`, `render.yaml`, a pasta `src`, a pasta `server`, etc. — todos na raiz.

---

## PASSO 3 — Criar a conta no Render

1. Acesse **render.com** e crie a conta clicando em **Sign up → GitHub** (autorize o acesso à sua conta do GitHub).
2. É obrigatório cadastrar um **cartão de crédito** para poder usar o plano pago (US$ 7/mês). Você só paga o que usar.

---

## PASSO 4 — Subir o site (o Render faz quase tudo)

1. No painel do Render, clique em **New + → Blueprint**.
2. Selecione o repositório `teramim`.
3. O Render lê o arquivo `render.yaml` e prepara tudo sozinho.
4. Antes de criar, ele vai pedir os **valores das variáveis** (deixe sempre a primeira opção, "New secret" / "New value"):
   - `USER_LLM_API_KEY` → sua chave da IA (a mesma que a Rosi usa no painel hoje)
   - `ADMIN_PIN` → um código seu (4 a 8 números) para entrar no painel da Rosi
   - `CHECKOUT_URL` → o link da Kiwify (https://pay.kiwify.com.br/XXXXX)
5. Clique em **Apply** / **Create Resources** e aguarde o **deploy** (uns 3–5 minutos na primeira vez).

Quando terminar, o Render mostra o **endereço do site** (algo como `https://teramim.onrender.com`). Abra esse endereço e veja o P.A.R.E. no ar!

> Se algo der errado no deploy, olhe a aba **Logs** do serviço no Render. O site precisa terminar com "listening" na porta certa.

---

## PASSO 5 — Ligar o domínio www.rosiaguiar.com

1. No Render, abra o serviço `teramim` → aba **Settings → Custom Domains**.
2. Adicione `www.rosiaguiar.com` e também `rosiaguiar.com`.
3. O Render mostra **registros DNS** (uma linha com um valor tipo `dXXXXXXXXX` ou um CNAME). Copie.
4. Vá no painel do **seu provedor do domínio** (onde você comprou o rosiaguiar.com, ex.: Registro.br ou Hostinger) e crie os registros conforme o Render pediu:
   - Se for CNAME: apontar `www` para o endereço que o Render deu.
   - Se for A: apontar `@` e `www` para o IP que o Render deu.
5. Aguarde de 30 minutos a algumas horas (DNS demora). O **HTTPS (cadeado) vem sozinho** do Render.

---

## PASSO 6 — Conferir e configurar tudo no ar

Acesse **https://www.rosiaguiar.com**:
- Página inicial abre com o logo e o botão "Começar meu P.A.R.E. agora".
- **Assinar** → preencha nome e e-mail → abra o checkout da Kiwify.
- **Painel da Rosi** (https://www.rosiaguiar.com/#/admin) entra com o PIN que você definiu.
  - Em **Configurações**, confira a chave da IA e o link de pagamento.
  - Em **Meus áudios**, envie um áudio de teste e veja se toca no app.
- No celular, abra o site e toque em **"Instalar o P.A.R.E."** para instalá-lo como app.

---

## Backup (faça de vez em quando)

No painel do Render, o serviço tem um **disco** (pasta `/data`) onde ficam áudios e configurações. Para copiar um backup:
1. Render → seu serviço → aba **Shell**.
2. Cole: `cd /data && tar -czf backup.tar.gz .`
3. Em **Files**, baixe o arquivo `backup.tar.gz` gerado.

Se algum dia algo sumir, basta subir esse arquivo de volta (ou chamar a mim para restaurar).

---

## Atualizar o site depois de mudanças

1. No seu computador, rode `npm run build` e compacte novamente a pasta **`dist/`** junto com os arquivos alterados (ou me chame para fazer isso).
2. No GitHub, envie os arquivos novos (mesmo jeito do Passo 2 — "Upload files").
3. No Render, ele detecta a mudança e faz o deploy sozinho automaticamente.

O site atualiza em minutos **sem perder nenhum dado** (os áudios e configurações ficam no disco do Render).

---

## Custo final (resumo)
| Item | Custo |
|---|---|
| Render pago | US$ 7/mês (~R$ 35–40) |
| Domínio rosiaguiar.com | ~R$ 40–60/ano |
| Kiwify | % sobre as vendas |
| GitHub | grátis |

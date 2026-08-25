# GUIA PASSO A PASSO — para a Rosi 🌸

> Este guia foi escrito para você, sem "informatiquês". Leia com calma, faça um passo de cada vez. Se travar em qualquer lugar, me chama que eu te destravo.

> **STATUS (atualizado):** ✅ Passos 1 e 2 JÁ FEITOS (com ajuda da IA — o site já está no GitHub, conta `rosiaguia`, repositório `teramim`). O próximo é o **PASSO 3 — Render**.

---

## ANTES DE COMEÇAR — o que é cada coisa (explicado simples)

Imagine que o seu P.A.R.E® é uma **lojinha numa rua**:

| Coisa | O que é | Analogia |
|---|---|---|
| **O site (código)** | Os arquivos do P.A.R.E. que eu preparei | Os móveis, produtos e a decoração da loja |
| **O GitHub** | Um "depósito de arquivos" na internet | O galpão onde você guarda os móveis da loja |
| **O Render** | O "prédio" que abre a loja para o público 24h | O aluguel do ponto comercial (~R$ 35/mês) |
| **O domínio** (www.rosiaguiar.com) | O endereço da loja | O endereço que a cliente digita para achar você |
| **A Kiwify** | Quem recebe o dinheiro das vendas | O caixa que passa o cartão da cliente |

Você já tem: o **site pronto** (eu fiz) e a **Kiwify** (sua venda). Falta: **depósito (GitHub)** → **abrir a loja (Render)** → **colocar a placa de endereço (domínio)**.

---

## PASSO 1 — Criar o depósito no GitHub (grátis, 15 min)

O GitHub é de graça e é por onde o site sobe.

1. No computador, abra o navegador (Chrome ou Edge) e entre em: **github.com**
2. Clique em **Sign up** e crie a conta com seu e-mail e uma senha. Confirme o e-mail quando o GitHub mandar.
3. Entre na conta. No topo, à direita, clique no **+** e escolha **New repository**.
4. No campo **Repository name**, digite: `teramim`
5. Deixe marcada a opção **Public** (é o mais simples e não tem perigo: as senhas do site não ficam aqui).
6. NÃO marque a opção "Add a README file".
7. Clique no botão verde **Create repository**.

Pronto, você criou o depósito. A tela vai mostrar algumas instruções — **ignore, não precisa fazer nada ali**.

---

## PASSO 2 — Mandar o site para o depósito (5 min)

1. Clique em **Add file** → **Upload files** (no meio da tela do repositório).
2. Vai abrir uma janela para arrastar arquivos. Arraste para dentro dela o arquivo **`teramim-app.zip`** (o pacote do site que você baixou do preview — eu te ajudo a pegar se precisar).
3. O GitHub **descompacta sozinho** e mostra os arquivos. Espere a listinha de arquivos aparecer.
4. Role a tela até o fim. Em **Commit changes**, clique no botão verde.
5. Espere terminar (uns segundos). Você verá a lista de arquivos do site (pastas `src`, `server`, `public`, arquivos `package.json`, `render.yaml`...).

> Confira que apareceu o arquivo **`render.yaml`** na lista. É ele que faz o Render entender o site.

> **✅ FEITO em 24/08/2026:** a IA subiu os 73 arquivos para o GitHub da conta `rosiaguia` (repositório `teramim`). Este passo está concluído — não precisa refazer.

---

## PASSO 3 — Alugar o "ponto comercial" (Render, US$ 7/mês)

1. No navegador, entre em: **render.com**
2. Clique em **Sign up** → **Sign up with GitHub**. O Render vai pedir autorização para falar com seu GitHub — clique em **Authorize / Authorize render**.
3. Depois de entrar, o Render pede um **cartão de crédito**. Coloque o seu (US$ 7/mês, cerca de R$ 35–40). Você só paga o que usar; pode cancelar quando quiser.
4. Se pedir um **código de verificação por e-mail ou celular**, confirme.

---

## PASSO 4 — Abrir a loja (deploy automático)

1. No painel do Render, clique no botão **New +** (ou **New** no topo) → **Blueprint**.
2. Escolha o repositório **`teramim`** (clique em **Connect**).
3. O Render vai ler o arquivo `render.yaml` e preparar tudo sozinho. Ele vai pedir **3 valores** para você preencher (isso é importante):
   - `USER_LLM_API_KEY` → a **chave da IA** (a mesma que você usa hoje no painel da Rosi; se não souber onde, me chama)
   - `ADMIN_PIN` → um **código seu** (ex.: `1234`) para entrar no painel da Rosi — escolha números que você lembre
   - `CHECKOUT_URL` → o link da Kiwify: `https://pay.kiwify.com.br/br3QB4n`
4. Clique em **Apply** (ou **Create Resources**).
5. O Render começa a "construir" o site (primeira vez demora 3 a 5 minutos). Acompanhe na aba **Logs** — no fim deve aparecer algo como "listening".
6. Quando terminar, o Render mostra o **endereço provisório** do site (algo como `https://teramim.onrender.com`). **Abra esse endereço** e veja seu P.A.R.E. no ar! 🌟

---

## PASSO 5 — Colocar a placa de endereço (www.rosiaguiar.com)

Agora o site existe, mas no endereço feio do Render. Vamos ligar o seu domínio.

1. No Render, abra seu serviço (`teramim`) → aba **Settings** → **Custom Domains**.
2. Clique em **Add custom domain** e digite `www.rosiaguiar.com`. Depois faça de novo com `rosiaguiar.com`.
3. O Render vai mostrar **dois registros de DNS** (uma linha com o endereço dele). Copie.
4. Entre no painel de **onde você comprou o domínio** (Registro.br, Hostinger, GoDaddy, etc.) → área de **DNS** ou **Zona DNS**.
5. Crie os registros que o Render pediu:
   - Se for **CNAME**: Nome `www`, valor = o endereço que o Render deu.
   - Se for **A**: Nome `@` e `www`, valor = o número (IP) que o Render deu.
6. Salve. A "propagação" do DNS leva de 30 minutos a algumas horas (é normal demorar).
7. Quando terminar, abra **https://www.rosiaguiar.com** — vai aparecer o cadeado (HTTPS) sozinho. Seu endereço oficial está no ar!

---

## PASSO 6 — Conferir tudo (10 min)

Abra https://www.rosiaguiar.com e teste:

- [ ] A página inicial abre com o logo e o botão **"Começar meu P.A.R.E. agora"**
- [ ] Toque em **Assinar** → preencha nome e e-mail → **abre a Kiwify** com o pagamento
- [ ] Entre no painel em **https://www.rosiaguiar.com/#/admin** com o PIN que você escolheu
  - [ ] Em **Configurações**, confira a chave da IA
  - [ ] Em **Meus áudios**, envie um áudio de teste e veja se toca no app
- [ ] No celular, toque em **"Instalar o P.A.R.E."** e instale o app

---

## PASSO 7 — Backup (para dormir tranquila)

Uma vez por mês (ou antes de mexer no site):

1. No Render, abra seu serviço → aba **Shell** (é um terminalzinho dentro do site).
2. Cole: `cd /data && tar -czf backup.tar.gz .` e dê Enter.
3. Abra a aba **Files**, procure o arquivo **`backup.tar.gz`** e baixe para o seu computador.

Se um dia algo sumir, me chame que eu restauro com esse arquivo.

---

## RESUMO DOS CUSTOS

| Item | Custo |
|---|---|
| GitHub | Grátis |
| Render | US$ 7/mês (~R$ 35–40) |
| Domínio rosiaguiar.com | ~R$ 40–60 por ano |
| Kiwify | Porcentagem de cada venda |

---

## SE ALGO DER ERRADO

- **Deploy não termina / site não abre**: abra o serviço → aba **Logs** e me conte o que aparece (ou mande print do texto).
- **Não consigo entrar no GitHub/Render**: me chama, a gente faz juntas com você compartilhando a tela.
- **Página em branco**: geralmente é só esperar o Render terminar ou recarregar (F5).
- **Esqueceu o PIN do painel**: é o valor de `ADMIN_PIN` que você colocou no Render.

> Regra de ouro: **você não quebra nada permanente**. Tudo pode ser refeito. Se travou, me chama. 💛

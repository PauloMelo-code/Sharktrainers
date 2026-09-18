# Shark Trainers — site e painel

Site institucional e canal de empregos da **Shark Trainers**, a agência headhunters do
varejo óptico e joalheiro, com painel interno para a Vanessa publicar vagas e artigos e
receber currículos, pedidos de anúncio e mensagens.

---

## O que o site tem

**Páginas públicas**

| Endereço | O que é |
| --- | --- |
| `/` | Home: hero, clientes, vagas recentes, como funciona, missão/valores/visão, sobre a Vanessa, depoimentos, artigos e chamada final |
| `/canal` | Canal de Empregos Óptica: explicação para óticas e para candidatos |
| `/empregos` | Feed de vagas com filtro por cargo, estado e ordem (o filtro fica na URL, então dá para compartilhar) |
| `/vaga/[id]` | Página da vaga: arte, destaques, descrição, candidatura pelo WhatsApp e compartilhamento |
| `/anuncie` | Formulário "Anuncie Aqui" para óticas pedirem a publicação de uma vaga |
| `/curriculo` | Cadastro no banco de talentos, com upload do currículo em PDF ou DOC |
| `/contato` | Canais de contato e formulário de mensagem |
| `/artigos` e `/artigo/[id]` | Mural da coluna Mapeamento de Vendas |
| `/depoimentos` | Depoimentos de candidatos e empresas |
| `/marketplace` | Empresas parceiras |
| `/guia` | Guia de estilo da marca (cores, tipografia, botões, componentes) |

**Painel interno** (`/painel`, link "Área restrita" no rodapé)

- **Início** com os números do mês e as últimas entradas.
- **Vagas**: criar, editar, fixar no topo, encerrar e excluir. O editor monta a arte
  1080×1600 no padrão da marca enquanto você digita, com **download em PNG** para postar
  no WhatsApp e no Instagram. Dá para enviar uma foto de fundo ou substituir tudo por uma
  arte pronta.
- **Artigos**: cole o post do Instagram e o sistema separa título, resumo, link e
  hashtags. Ícone próprio por artigo (o site não usa emoji), capa opcional, rascunho ou
  publicado.
- **Currículos**: lista com filtros, ficha completa, download do arquivo, status
  (novo, em análise, contatado, arquivado) e observações internas.
- **Pedidos de anúncio**, **Depoimentos**, **Marketplace** e **Contatos**.
- **Minha conta**: troca de senha.

---

## Rodando na sua máquina

Precisa de Node.js 22 e de um PostgreSQL. O jeito mais rápido de ter o banco:

```bash
docker run -d --name shark-pg -e POSTGRES_PASSWORD=senha -p 5432:5432 postgres:16
```

Depois:

```bash
npm install
cp .env.example .env      # ajuste DATABASE_URL, SESSION_SECRET e a senha do painel
npm run setup             # cria as tabelas e popula com o conteúdo real
npm run dev               # http://localhost:3000
```

O `npm run setup` mostra no fim o usuário e a senha do painel, vindos do `.env`.
**Troque a senha no primeiro acesso**, em Painel → Minha conta.

Para gerar uma chave de sessão nova:

```bash
openssl rand -base64 32
```

### Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Aplica as migrações e sobe o build de produção |
| `npm run start:app` | Sobe o build sem passar pelas migrações |
| `npm run typecheck` | Confere os tipos |
| `npm run db:migrate` | Prepara o banco: migrações, acesso ao painel e conteúdo inicial, tudo só quando falta (seguro, não apaga nada) |
| `npm run db:publicar` | Publica num site já no ar o conteúdo novo de `scripts/conteudo-inicial.json` (só insere o que falta; `-- --simular` mostra antes) |
| `npm run db:seed` | Repovoa o banco com o conteúdo inicial (**apaga as tabelas antes**) |
| `npm run db:admin` | Cria ou redefine a senha do usuário do painel |
| `npm run db:generate` | Cria uma migração nova depois de mexer em `src/db/schema.ts` |
| `npm run db:studio` | Abre o Drizzle Studio para ver os dados |

O `db:migrate` e o `db:admin` rodam só com as dependências de produção, sem
`drizzle-kit` nem `tsx`.

---

## Como está montado

- **Next.js 16** (App Router) com **React 19** e TypeScript.
- **Drizzle ORM** sobre **PostgreSQL**, com migrações versionadas em `drizzle/` e
  aplicadas automaticamente a cada inicialização do servidor, que também faz a carga
  inicial de conteúdo num banco novo.
- **Server Actions** para todos os formulários, com validação em **Zod** no servidor.
- **Sessão** em cookie assinado (JWT com `jose`), senha guardada com **bcrypt**. O
  `src/middleware.ts` bloqueia `/painel` e `/api/painel` para quem não está logado.
- **CSS próprio** em `src/app/globals.css` e `src/app/painel/painel.css`, com os valores
  exatos do guia de estilo. Sem framework de CSS.

### Mapa das pastas

```
src/
├─ app/
│  ├─ (site)/        páginas públicas (cabeçalho, rodapé e botão do WhatsApp)
│  ├─ painel/        login e painel interno
│  ├─ api/painel/    download protegido dos currículos
│  └─ globals.css    identidade visual da marca
├─ actions/          Server Actions (formulários públicos e painel)
├─ components/       componentes de tela
├─ db/               schema e conexão do Drizzle
└─ lib/              regras de apoio: datas, listas, sessão, uploads, arte em canvas
scripts/
├─ seed.ts           conteúdo inicial (vagas, artigos, parceiros, demonstração)
├─ migrar.mjs        prepara o banco na inicialização (migrações, acesso e carga
│                    inicial), sem dependências de desenvolvimento
├─ conteudo-inicial.json   vagas, artigos e parceiros aprovados
├─ publicar-conteudo.mjs   publica num site no ar só o que ainda falta
└─ criar-admin.mjs   cria ou redefine a senha do usuário do painel
drizzle/             migrações em SQL, versionadas
Dockerfile           imagem de produção usada pelo Easypanel
public/assets/       logos, fotos, artes das vagas e ícones
uploads/             currículos enviados (fora do público, nunca versionado)
```

### Onde ficam os dados pessoais

Os currículos **não** ficam na pasta pública. O arquivo é gravado em `uploads/` com um
nome aleatório e só sai pela rota `/api/painel/curriculos/[id]/arquivo`, que exige sessão
do painel. A pasta está no `.gitignore`. Os formulários pedem consentimento LGPD antes do
envio, e excluir um currículo no painel apaga também o arquivo do disco.

---

## Publicando no Easypanel

São **dois serviços**: um **Postgres** (o banco) e um **App** (o site).

### 1. Banco

Projeto → **+ Service** → **Postgres**. Anote o nome do serviço, o usuário, a senha e o
banco — é o que vai montar a `DATABASE_URL`. Nada mais a configurar aqui.

### 2. App

Projeto → **+ Service** → **App**.

| Aba | O que preencher |
| --- | --- |
| **Source** | GitHub → `PauloMelo-code/Sharktrainers`, branch `main` |
| **Build** | **Dockerfile** (o repositório já tem um) ou **Nixpacks** — os dois funcionam |
| **Domains** | Seu domínio apontando para a porta **3000**, com HTTPS ligado |

### 3. Volume para os currículos

O banco fica no Postgres, mas os arquivos de currículo são gravados em disco. Aba
**Mounts** → **Add Mount** → **Volume**:

| Campo | Valor |
| --- | --- |
| Name | `dados` |
| Mount Path | `/app/data` |

Sem o volume, **os currículos enviados somem a cada publicação**, porque o contêiner é
recriado do zero. Os dados do painel (vagas, artigos, candidatos) não correm esse risco:
estão no Postgres.

### 4. Variáveis de ambiente

Aba **Environment** do serviço do site:

```
DATABASE_URL=postgres://postgres:SENHA@nome_do_servico_de_banco:5432/BANCO?sslmode=disable
UPLOADS_DIR=/app/data/uploads
SESSION_SECRET=cole-aqui-uma-chave-aleatoria
ADMIN_USER=vanessa
ADMIN_PASSWORD=uma-senha-forte-de-verdade
NODE_ENV=production
```

O host do banco é o nome do serviço Postgres na rede interna do Easypanel, e por isso
`sslmode=disable` está correto. Gere a chave de sessão com `openssl rand -base64 32`.
Trocar essa chave depois derruba quem estiver logado no painel, nada além disso.

### 5. Primeira publicação

Clique em **Deploy** e pronto. Ao subir, o contêiner deixa o banco pronto sozinho:

1. cria as tabelas;
2. cria o usuário do painel, com o `ADMIN_USER` e a `ADMIN_PASSWORD` que você definiu;
3. carrega o conteúdo aprovado (8 vagas, 4 artigos e 4 parceiros), **se o site estiver
   completamente vazio**.

Nenhum comando manual. O passo 3 só acontece num banco recém-criado: depois disso o
conteúdo é responsabilidade do painel e a carga nunca mais mexe em nada, nem se uma vaga
for apagada.

Entre em `seudominio.com.br/painel` e troque a senha em **Minha conta**.

Se quiser o painel cheio para demonstrar ao cliente, com currículos, pedidos e
depoimentos de exemplo, rode uma vez na aba **Console**:

```bash
npx --yes tsx scripts/seed.ts
```

### 6. Nos deploys seguintes

Nada a fazer. As migrações pendentes são aplicadas sozinhas a cada inicialização, e
nunca apagam dados.

O `seed` é outra coisa e continua manual de propósito: ele limpa as tabelas de conteúdo,
e por isso se recusa a rodar quando encontra currículos, pedidos ou mensagens já
gravados. A conta do painel ele nunca toca.

### Publicando conteúdo novo sem passar pelo painel

O caminho normal para uma vaga ou um artigo novo é o painel. Quando não dá (o painel
fora do ar, um lote grande de uma vez), acrescente os itens em
`scripts/conteudo-inicial.json`, publique o repositório e rode no **Console**:

```bash
npm run db:publicar -- --simular    # mostra o que seria publicado
npm run db:publicar                 # publica
```

Ele compara pelo id e **só insere o que ainda não está no banco**. Nunca altera nem
apaga o que já existe, e rodar de novo sem novidade no arquivo não faz nada. É manual
de propósito: se rodasse sozinho a cada publicação, traria de volta uma vaga que a
Vanessa tivesse apagado pelo painel.

### Backup

Duas coisas separadas:

- **Banco**: use o backup do próprio serviço Postgres no Easypanel, ou pelo Console
  `pg_dump "$DATABASE_URL" > backup.sql`.
- **Currículos**: a pasta `/app/data/uploads` do volume.

### Esqueceu a senha do painel?

No Console do site:

```bash
ADMIN_PASSWORD="nova-senha-forte" npm run db:admin
```

---

## Outras hospedagens

Qualquer servidor com Node 22 e PostgreSQL serve: VPS, Railway, Render, Fly.io. O
caminho é o mesmo — aponte `DATABASE_URL` para o banco, `UPLOADS_DIR` para uma pasta
persistente, rode `npm run build`, `npm run db:migrate` e `npm run start` atrás de um
proxy com HTTPS.

Em hospedagem serverless (Vercel), o banco funciona normalmente, mas a pasta de uploads
não sobrevive entre execuções: os currículos precisariam ir para um armazenamento de
arquivos (Vercel Blob, S3, Cloudflare R2). O único arquivo a mudar seria
`src/lib/uploads.ts`.

---

## Detalhes que valem saber

- **Fontes**: Barlow, Barlow Condensed e Playfair Display vêm do Google Fonts. Sem
  internet, o navegador usa a fonte do sistema e o layout continua de pé.
- **Depoimentos**: os quatro que vêm no seed são de demonstração. Assim que chegarem os
  reais do Instagram, troque em Painel → Depoimentos.
- **`npm audit`**: os avisos restantes são do `drizzle-kit`, ferramenta de linha de
  comando usada só no desenvolvimento. Nada disso vai para o servidor.

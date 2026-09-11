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

Precisa de Node.js 20 ou mais novo.

```bash
npm install
cp .env.example .env      # ajuste SESSION_SECRET e a senha do painel
npm run setup             # cria as tabelas e popula com o conteúdo real
npm run dev               # http://localhost:3000
```

O `npm run setup` mostra no fim o usuário e a senha do painel (por padrão `vanessa` /
`shark2026`, vindos do `.env`). **Troque a senha no primeiro acesso**, em Painel → Minha
conta.

Para gerar uma chave de sessão nova:

```bash
openssl rand -base64 32
```

### Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run typecheck` | Confere os tipos |
| `npm run db:migrate` | Aplica as migrações pendentes (seguro, não apaga nada) |
| `npm run db:seed` | Repovoa o banco com o conteúdo inicial (**apaga as tabelas antes**) |
| `npm run db:push` | Sincroniza o schema direto, sem migração (só em desenvolvimento) |
| `npm run db:generate` | Cria uma migração nova depois de mexer em `src/db/schema.ts` |
| `npm run db:studio` | Abre o Drizzle Studio para ver os dados |

O `db:migrate` e o `criar-admin.mjs` rodam só com as dependências de produção, sem
`drizzle-kit` nem `tsx`. É o que permite publicar sem ferramenta de desenvolvimento no
servidor.

---

## Como está montado

- **Next.js 16** (App Router) com **React 19** e TypeScript.
- **Drizzle ORM** sobre **SQLite/libSQL**, com migrações versionadas em `drizzle/`. Em
  desenvolvimento é um arquivo `dev.db`; em produção é o mesmo arquivo dentro de um
  volume, ou um banco **Turso** (troque a `DATABASE_URL` e informe a
  `DATABASE_AUTH_TOKEN`).
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
├─ migrar.mjs        aplica as migrações (roda sem dependências de desenvolvimento)
└─ criar-admin.mjs   cria ou redefine a senha do usuário do painel
drizzle/             migrações em SQL, versionadas
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

O app precisa de um servidor Node: não roda como site estático. No Easypanel ele é um
serviço do tipo **App** — só isso. Não crie serviço de banco: o banco é um arquivo
SQLite que mora no volume do próprio app.

### 1. Criar o serviço

Projeto → **+ Service** → **App**.

| Aba | O que preencher |
| --- | --- |
| **Source** | GitHub → `PauloMelo-code/Sharktrainers`, branch `main` |
| **Build** | **Nixpacks** (detecta o Next.js sozinho; não precisa de Dockerfile) |
| **Deploy** | Comando de start: `npm run start` |
| **Domains** | Adicione o domínio e aponte para a porta **3000**, com HTTPS ligado |

### 2. Volume (este passo é obrigatório)

Aba **Mounts** → **Add Mount** → **Volume**:

| Campo | Valor |
| --- | --- |
| Name | `dados` |
| Mount Path | `/app/data` |

Sem o volume, **todo deploy apaga o banco e os currículos**, porque o contêiner é
recriado do zero a cada publicação.

### 3. Variáveis de ambiente

Aba **Environment**:

```
DATABASE_URL=file:/app/data/dev.db
UPLOADS_DIR=/app/data/uploads
SESSION_SECRET=cole-aqui-uma-chave-aleatoria
ADMIN_USER=vanessa
ADMIN_PASSWORD=uma-senha-forte-de-verdade
NODE_ENV=production
```

Gere a chave de sessão com `openssl rand -base64 32`. Trocar essa chave depois derruba
quem estiver logado no painel, nada além disso.

### 4. Primeira publicação

Clique em **Deploy** e espere o build terminar. Depois abra a aba **Console** do serviço
e rode, uma vez só:

```bash
npm run db:migrate                 # cria as tabelas no volume
npx --yes tsx scripts/seed.ts --sem-demo   # 8 vagas, 4 artigos e 3 parceiros reais
```

Se quiser ver o painel cheio para testar, troque `--sem-demo` por nada: aí entram também
currículos, pedidos e depoimentos de exemplo.

Entre em `seudominio.com.br/painel` com o usuário e a senha que você definiu, e troque a
senha em **Minha conta**.

### 5. Nos deploys seguintes

Só isso, no Console, depois de cada publicação que mexa no banco:

```bash
npm run db:migrate
```

O comando aplica apenas as migrações que faltam e nunca apaga dados. O `seed` é outra
coisa: ele limpa as tabelas, e por isso se recusa a rodar quando encontra currículos,
pedidos ou mensagens já gravados.

### Backup

Tudo que importa está em `/app/data` (o arquivo `dev.db` e a pasta `uploads/`). Faça uma
cópia dessa pasta de tempos em tempos — no Console:

```bash
tar czf /app/data/backup-$(date +%F).tar.gz /app/data/dev.db /app/data/uploads
```

Depois baixe o arquivo pelo gerenciador de arquivos do Easypanel e apague o `.tar.gz` do
volume para não ocupar espaço à toa.

### Esqueceu a senha do painel?

No Console:

```bash
ADMIN_PASSWORD="nova-senha-forte" node scripts/criar-admin.mjs
```

---

## Outras hospedagens

**Servidor próprio, VPS ou Docker**: mesmo caminho do Easypanel. Aponte `DATABASE_URL` e
`UPLOADS_DIR` para uma pasta persistente, rode `npm run build`, `npm run db:migrate` e
`npm run start` atrás de um proxy com HTTPS.

**Vercel ou outro serverless**: funciona, mas com duas mudanças. O banco precisa ser
remoto ([Turso](https://turso.tech), com `DATABASE_URL` e `DATABASE_AUTH_TOKEN`), e a
pasta `uploads/` não sobrevive entre execuções — os currículos precisariam ir para um
armazenamento de arquivos (Vercel Blob, S3, Cloudflare R2). O único arquivo a mudar
seria `src/lib/uploads.ts`.

---

## Detalhes que valem saber

- **Fontes**: Barlow, Barlow Condensed e Playfair Display vêm do Google Fonts. Sem
  internet, o navegador usa a fonte do sistema e o layout continua de pé.
- **Depoimentos**: os quatro que vêm no seed são de demonstração. Assim que chegarem os
  reais do Instagram, troque em Painel → Depoimentos.
- **`npm audit`**: os avisos restantes são do `drizzle-kit`, ferramenta de linha de
  comando usada só no desenvolvimento. Nada disso vai para o servidor.

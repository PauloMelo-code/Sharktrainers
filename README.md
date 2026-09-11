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
| `npm run db:push` | Aplica o schema no banco |
| `npm run db:seed` | Repovoa o banco com o conteúdo inicial (apaga o que estiver lá) |
| `npm run db:studio` | Abre o Drizzle Studio para ver os dados |

---

## Como está montado

- **Next.js 16** (App Router) com **React 19** e TypeScript.
- **Drizzle ORM** sobre **SQLite/libSQL**. Em desenvolvimento é um arquivo `dev.db`; em
  produção pode ser o mesmo arquivo num servidor próprio ou um banco **Turso** (é só
  trocar a `DATABASE_URL` e informar a `DATABASE_AUTH_TOKEN`).
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
scripts/seed.ts      conteúdo inicial (vagas, artigos, depoimentos, parceiros)
public/assets/       logos, fotos, artes das vagas e ícones
uploads/             currículos enviados (fora do público, nunca versionado)
```

### Onde ficam os dados pessoais

Os currículos **não** ficam na pasta pública. O arquivo é gravado em `uploads/` com um
nome aleatório e só sai pela rota `/api/painel/curriculos/[id]/arquivo`, que exige sessão
do painel. A pasta está no `.gitignore`. Os formulários pedem consentimento LGPD antes do
envio, e excluir um currículo no painel apaga também o arquivo do disco.

---

## Publicando

O app precisa de um servidor Node (não roda como site estático).

**Vercel + Turso** (caminho mais simples e com plano gratuito)

1. Crie um banco no [Turso](https://turso.tech) e copie a URL e o token.
2. Na Vercel, importe o repositório e defina as variáveis: `DATABASE_URL`,
   `DATABASE_AUTH_TOKEN`, `SESSION_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD`.
3. Rode `npm run db:push` e `npm run db:seed` uma vez apontando para o banco novo.
4. Atenção: em servidor serverless a pasta `uploads/` não se mantém entre execuções. Para
   os currículos sobreviverem, troque `src/lib/uploads.ts` por um armazenamento de
   arquivos (Vercel Blob, S3 ou Cloudflare R2) — é o único ponto do código que grava em
   disco.

**Servidor próprio ou VPS** (HostGator com Node, Railway, Render)

1. `npm install && npm run build`
2. Variáveis de ambiente iguais às de cima, com `DATABASE_URL="file:./dev.db"`.
3. `npm run start` atrás de um proxy reverso com HTTPS.
4. Faça backup de `dev.db` e da pasta `uploads/`. Nessa opção os currículos funcionam sem
   nenhuma mudança no código.

---

## Detalhes que valem saber

- **Fontes**: Barlow, Barlow Condensed e Playfair Display vêm do Google Fonts. Sem
  internet, o navegador usa a fonte do sistema e o layout continua de pé.
- **Depoimentos**: os quatro que vêm no seed são de demonstração. Assim que chegarem os
  reais do Instagram, troque em Painel → Depoimentos.
- **`npm audit`**: os avisos restantes são do `drizzle-kit`, ferramenta de linha de
  comando usada só no desenvolvimento. Nada disso vai para o servidor.

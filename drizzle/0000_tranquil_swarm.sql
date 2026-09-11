CREATE TABLE `artigos` (
	`id` text PRIMARY KEY NOT NULL,
	`icone` text DEFAULT 'artigo' NOT NULL,
	`titulo` text NOT NULL,
	`resumo` text DEFAULT '' NOT NULL,
	`link` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`categoria` text DEFAULT 'Vendas' NOT NULL,
	`capa` text,
	`status` text DEFAULT 'publicado' NOT NULL,
	`publicado_em` integer DEFAULT (unixepoch()) NOT NULL,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL,
	`atualizado_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `artigos_status_idx` ON `artigos` (`status`,`publicado_em`);--> statement-breakpoint
CREATE TABLE `curriculos` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`telefone` text NOT NULL,
	`cidade` text NOT NULL,
	`cargo` text NOT NULL,
	`anos` text NOT NULL,
	`salario` text DEFAULT '' NOT NULL,
	`linkedin` text DEFAULT '' NOT NULL,
	`mensagem` text DEFAULT '' NOT NULL,
	`arquivo_nome` text NOT NULL,
	`arquivo_path` text NOT NULL,
	`arquivo_tipo` text DEFAULT 'application/octet-stream' NOT NULL,
	`status` text DEFAULT 'novo' NOT NULL,
	`obs` text DEFAULT '' NOT NULL,
	`vaga_id` text,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL,
	`atualizado_em` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`vaga_id`) REFERENCES `vagas`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `curriculos_status_idx` ON `curriculos` (`status`,`criado_em`);--> statement-breakpoint
CREATE TABLE `depoimentos` (
	`id` text PRIMARY KEY NOT NULL,
	`tipo` text DEFAULT 'Candidato recolocado' NOT NULL,
	`nome` text NOT NULL,
	`cargo` text DEFAULT '' NOT NULL,
	`texto` text NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `depoimentos_ordem_idx` ON `depoimentos` (`ordem`);--> statement-breakpoint
CREATE TABLE `mensagens` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`contato` text NOT NULL,
	`mensagem` text NOT NULL,
	`lida` integer DEFAULT false NOT NULL,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `mensagens_criado_idx` ON `mensagens` (`criado_em`);--> statement-breakpoint
CREATE TABLE `parceiros` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`tipo` text DEFAULT '' NOT NULL,
	`descricao` text DEFAULT '' NOT NULL,
	`link` text DEFAULT '' NOT NULL,
	`cta` text DEFAULT 'Saiba mais' NOT NULL,
	`ordem` integer DEFAULT 0 NOT NULL,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `parceiros_ordem_idx` ON `parceiros` (`ordem`);--> statement-breakpoint
CREATE TABLE `pedidos_anuncio` (
	`id` text PRIMARY KEY NOT NULL,
	`empresa` text NOT NULL,
	`responsavel` text NOT NULL,
	`whatsapp` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`cidade` text NOT NULL,
	`cargo` text NOT NULL,
	`descricao` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`obs` text DEFAULT '' NOT NULL,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL,
	`atualizado_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `pedidos_status_idx` ON `pedidos_anuncio` (`status`,`criado_em`);--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario` text NOT NULL,
	`nome` text NOT NULL,
	`senha_hash` text NOT NULL,
	`criado_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_usuario_unique` ON `usuarios` (`usuario`);--> statement-breakpoint
CREATE TABLE `vagas` (
	`id` text PRIMARY KEY NOT NULL,
	`cargo` text NOT NULL,
	`cidades` text DEFAULT '[]' NOT NULL,
	`destaques` text DEFAULT '[]' NOT NULL,
	`telefone` text DEFAULT '(011) 97839.8648' NOT NULL,
	`descricao` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'ativa' NOT NULL,
	`fixada` integer DEFAULT false NOT NULL,
	`arte` text,
	`foto` text,
	`publicada_em` integer DEFAULT (unixepoch()) NOT NULL,
	`criada_em` integer DEFAULT (unixepoch()) NOT NULL,
	`atualizada_em` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `vagas_status_idx` ON `vagas` (`status`,`publicada_em`);
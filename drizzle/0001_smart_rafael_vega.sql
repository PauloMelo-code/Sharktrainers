ALTER TABLE "curriculos" ALTER COLUMN "arquivo_nome" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "curriculos" ALTER COLUMN "arquivo_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "curriculos" ALTER COLUMN "arquivo_tipo" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "curriculos" ALTER COLUMN "arquivo_tipo" DROP NOT NULL;
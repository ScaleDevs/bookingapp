ALTER TABLE "offering" ADD COLUMN "price" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "offering" ADD COLUMN "currency" text DEFAULT 'PHP' NOT NULL;
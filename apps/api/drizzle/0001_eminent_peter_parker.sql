ALTER TABLE "booking" ADD COLUMN "price" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "booking" ADD COLUMN "currency" text DEFAULT 'PHP' NOT NULL;
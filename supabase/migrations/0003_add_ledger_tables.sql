-- Add financial fields to properties (operational text fields already exist from 0000)
ALTER TABLE "properties" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "purchase_price" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "current_value" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "ownership_percentage" real DEFAULT 100;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "monthly_rent" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "image_url" text;--> statement-breakpoint

-- Transaction AI status enum
CREATE TYPE "public"."transaction_ai_status" AS ENUM('reviewed', 'needs_review', 'flagged');--> statement-breakpoint

-- Bank accounts table
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"institution" text NOT NULL,
	"mask" text,
	"plaid_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

-- Transactions table
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"property_id" uuid,
	"bank_account_id" uuid,
	"date" timestamp NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"category" text,
	"amount" integer NOT NULL,
	"ai_status" "transaction_ai_status" DEFAULT 'needs_review',
	"ai_confidence" real,
	"duplicate_group_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

-- Foreign keys
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_account_id_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;

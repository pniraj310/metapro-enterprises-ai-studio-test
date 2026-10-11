CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"salt" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "business_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"business_name" text DEFAULT 'MetaPro Enterprises' NOT NULL,
	"whatsapp_number" text DEFAULT '917666323894' NOT NULL,
	"business_phone" text DEFAULT '7666323894' NOT NULL,
	"business_email" text DEFAULT 'pdheeraj351@gmail.com' NOT NULL,
	"business_address" text DEFAULT 'Pili Nadi, Sunday Market, Plot No. 02, Kamptee Road, Nagpur, Maharashtra 440026, India' NOT NULL,
	"hero_headline" text DEFAULT 'Materials That Shape Better Spaces.' NOT NULL,
	"hero_subheadline" text DEFAULT 'Explore interior materials, architectural wall & ceiling panels, and precision fixing hardware from MetaPro Enterprises.' NOT NULL,
	"about_text" text DEFAULT 'MetaPro Enterprises supplies interior materials, architectural wall and ceiling panels, and installation fasteners for customers working on homes, offices, commercial spaces, and interior renovation projects.' NOT NULL,
	"instagram_url" text DEFAULT '' NOT NULL,
	"facebook_url" text DEFAULT '' NOT NULL,
	"youtube_url" text DEFAULT '' NOT NULL,
	"linkedin_url" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text DEFAULT '',
	"image" text DEFAULT '',
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uid" text,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"project_type" text,
	"items" jsonb NOT NULL,
	"notes" text,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"category_id" text,
	"brand" text DEFAULT 'MetaPro',
	"price" integer NOT NULL,
	"sale_price" integer,
	"sku" text,
	"stock" integer DEFAULT 50,
	"min_order_quantity" integer DEFAULT 1,
	"unit" text DEFAULT 'Piece',
	"image" text NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb,
	"availability" text DEFAULT 'Available' NOT NULL,
	"active" boolean DEFAULT true,
	"specifications" jsonb DEFAULT '[]'::jsonb,
	"applications" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" text DEFAULT 'customer',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);

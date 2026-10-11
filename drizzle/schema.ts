import { pgTable, foreignKey, unique, bigint, boolean, varchar, timestamp, integer, numeric, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "products_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	active: boolean().notNull(),
	brand: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	description: varchar({ length: 2000 }),
	featured: boolean().notNull(),
	minOrderQuantity: integer("min_order_quantity").notNull(),
	name: varchar({ length: 200 }).notNull(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
	salePrice: numeric("sale_price", { precision: 12, scale:  2 }),
	sku: varchar({ length: 60 }).notNull(),
	slug: varchar({ length: 220 }).notNull(),
	stock: integer().notNull(),
	unit: varchar({ length: 40 }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	categoryId: bigint("category_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "fkog2rp4qthbtt2lfyhfo32lsw9"
		}),
	unique("ukfhmd06dsmj6k0n90swsh8ie9g").on(table.sku),
	unique("ukostq1ec3toafnjok09y9l7dox").on(table.slug),
]);

export const productImages = pgTable("product_images", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "product_images_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	altText: varchar("alt_text", { length: 200 }),
	displayOrder: integer("display_order").notNull(),
	isPrimary: boolean("is_primary").notNull(),
	url: varchar({ length: 500 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "fkqnq71xsohugpqwf3c9gxmsuy"
		}),
]);

export const productSpecifications = pgTable("product_specifications", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "product_specifications_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	displayOrder: integer("display_order").notNull(),
	specKey: varchar("spec_key", { length: 100 }).notNull(),
	specValue: varchar("spec_value", { length: 200 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "fkbets5sov4bn9d2wy8vqathw6d"
		}),
]);

export const categories = pgTable("categories", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "categories_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	active: boolean().notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	description: varchar({ length: 500 }),
	displayOrder: integer("display_order"),
	name: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 170 }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	unique("ukoul14ho7bctbefv8jywp5v3i2").on(table.slug),
]);

export const flywaySchemaHistory = pgTable("flyway_schema_history", {
	installedRank: integer("installed_rank").primaryKey().notNull(),
	version: varchar({ length: 50 }),
	description: varchar({ length: 200 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	script: varchar({ length: 1000 }).notNull(),
	checksum: integer(),
	installedBy: varchar("installed_by", { length: 100 }).notNull(),
	installedOn: timestamp("installed_on", { mode: 'string' }).defaultNow().notNull(),
	executionTime: integer("execution_time").notNull(),
	success: boolean().notNull(),
}, (table) => [
	index("flyway_schema_history_s_idx").using("btree", table.success.asc().nullsLast().op("bool_ops")),
]);

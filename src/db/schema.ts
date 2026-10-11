import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull(),
  description: text('description').default(''),
  image: text('image').default(''),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug'),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  categoryId: text('category_id'),
  brand: text('brand').default('MetaPro'),
  price: integer('price').notNull(),
  salePrice: integer('sale_price'),
  sku: text('sku'),
  stock: integer('stock').default(50),
  minOrderQuantity: integer('min_order_quantity').default(1),
  unit: text('unit').default('Piece'),
  image: text('image').notNull(),
  images: jsonb('images').$type<string[]>().default([]),
  availability: text('availability').notNull().default('Available'),
  active: boolean('active').default(true),
  specifications: jsonb('specifications').$type<{ label: string; value: string }[]>().default([]),
  applications: jsonb('applications').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const businessSettings = pgTable('business_settings', {
  id: integer('id').primaryKey().default(1),
  businessName: text('business_name').notNull().default('MetaPro Enterprises'),
  whatsAppNumber: text('whatsapp_number').notNull().default('917666323894'),
  businessPhone: text('business_phone').notNull().default('7666323894'),
  businessEmail: text('business_email').notNull().default('pdheeraj351@gmail.com'),
  businessAddress: text('business_address')
    .notNull()
    .default(
      'Pili Nadi, Sunday Market, Plot No. 02, Kamptee Road, Nagpur, Maharashtra 440026, India'
    ),
  heroHeadline: text('hero_headline')
    .notNull()
    .default('Materials That Shape Better Spaces.'),
  heroSubheadline: text('hero_subheadline')
    .notNull()
    .default(
      'Explore interior materials, architectural wall & ceiling panels, and precision fixing hardware from MetaPro Enterprises.'
    ),
  aboutText: text('about_text')
    .notNull()
    .default(
      'MetaPro Enterprises supplies interior materials, architectural wall and ceiling panels, and installation fasteners for customers working on homes, offices, commercial spaces, and interior renovation projects.'
    ),
  instagramUrl: text('instagram_url').notNull().default(''),
  facebookUrl: text('facebook_url').notNull().default(''),
  youtubeUrl: text('youtube_url').notNull().default(''),
  linkedinUrl: text('linkedin_url').notNull().default(''),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid'),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  projectType: text('project_type'),
  items: jsonb('items')
    .$type<{ productId: string; name: string; quantity: number; unit?: string }[]>()
    .notNull(),
  notes: text('notes'),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  enquiries: many(enquiries),
}));

export const enquiriesRelations = relations(enquiries, ({ one }) => ({
  user: one(users, {
    fields: [enquiries.userUid],
    references: [users.uid],
  }),
}));

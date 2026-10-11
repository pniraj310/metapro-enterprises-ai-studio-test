import { relations } from "drizzle-orm/relations";
import { categories, products, productImages, productSpecifications } from "./schema";

export const productsRelations = relations(products, ({one, many}) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	productImages: many(productImages),
	productSpecifications: many(productSpecifications),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	products: many(products),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	}),
}));

export const productSpecificationsRelations = relations(productSpecifications, ({one}) => ({
	product: one(products, {
		fields: [productSpecifications.productId],
		references: [products.id]
	}),
}));
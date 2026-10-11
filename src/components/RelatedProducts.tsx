import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  allProducts: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  category,
  allProducts,
}) => {
  // 1. Primary filter: Products in the exact same category
  const sameCategoryProducts = allProducts.filter(
    (p) => p.category === category && p.id !== currentProductId
  );

  // 2. Secondary fallback: If fewer than 4 products exist in this category,
  // backfill with other top-rated catalog items so the customer always has 4 recommendations
  let displayedProducts = [...sameCategoryProducts];
  if (displayedProducts.length < 4) {
    const fillerProducts = allProducts.filter(
      (p) => p.id !== currentProductId && !displayedProducts.some((d) => d.id === p.id)
    ).slice(0, 4 - displayedProducts.length);
    displayedProducts = [...displayedProducts, ...fillerProducts];
  }

  // Cap at 4 items for a clean single-row desktop grid
  const itemsToShow = displayedProducts.slice(0, 4);

  if (itemsToShow.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-slate-200" aria-labelledby="related-products-heading">
      {/* Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-[#0B1528] text-[#DF9E26] px-2.5 py-0.5 rounded">
              <Layers className="w-3 h-3" />
              <span>Matching Catalog</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {sameCategoryProducts.length > 0 
                ? `Category: ${category}` 
                : 'Recommended for You'}
            </span>
          </div>

          <h2 id="related-products-heading" className="text-xl sm:text-2xl font-bold text-[#0f1111] tracking-tight">
            Related Products & Similar Items
          </h2>
          <p className="text-xs text-slate-500">
            Contractors who ordered this item also frequently spec and purchase these compatible materials
          </p>
        </div>

        <Link
          to={`/products?category=${encodeURIComponent(category)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline shrink-0"
        >
          <span>Explore all in {category}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {itemsToShow.map((relatedProd) => (
          <ProductCard key={relatedProd.id} product={relatedProd} />
        ))}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { resolveMaterialImage } from '../assets/materialImages';
import { Plus, Check, ArrowUpRight, Layers, ShieldCheck, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { cart, addToCart, setIsCartDrawerOpen } = useCart();

  const isAvailable = product.availability === 'Available';
  const existingInList = cart.find((item) => item.product.id === product.id);
  const displayImage = resolveMaterialImage(
    product.images && product.images.length > 0 ? product.images[0] : product.image,
    product.category
  );

  // Calculate an indicative MRP / market comparison for the Flipkart/Amazon price discount display
  const indicativeMRP = Math.round(product.price * 1.22);
  const discountPercent = Math.round(((indicativeMRP - product.price) / indicativeMRP) * 100);

  const handleAddToEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden group">
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug || product.id}`}
        className="relative w-full aspect-4/3 bg-[#F8F9FA] overflow-hidden block border-b border-gray-100"
      >
        {!imageError && displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-400 bg-gray-50">
            <Layers className="w-8 h-8 text-gray-300 mb-2" />
            <span className="text-xs font-medium text-gray-500 text-center">{product.name}</span>
          </div>
        )}

        {/* Flipkart Assured style badge in top corner */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs border border-blue-200 text-[#2874F0] text-[10px] font-bold shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-[#2874F0]" />
            <span>Assured</span>
          </span>
        </div>

        {/* Stock status indicator */}
        <div className="absolute bottom-2 left-2.5">
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </Link>

      {/* Card Content (Amazon + Flipkart Hierarchy) */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Category & Brand info */}
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span className="font-medium text-[#2874F0] truncate max-w-[70%]">
              {product.category}
            </span>
            {product.sku && (
              <span className="font-mono text-gray-400 text-[10px] tabular-nums">
                {product.sku}
              </span>
            )}
          </div>

          {/* Product Title (2 lines max, hover blue) */}
          <Link to={`/product/${product.slug || product.id}`} className="block group/title">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover/title:text-[#2874F0] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="pt-2.5 border-t border-gray-100 space-y-3">
          {/* Price Block (Amazon/Flipkart style with indicative MRP strikethrough & green discount) */}
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.unit && (
                <span className="text-xs text-gray-500 font-medium">/ {product.unit}</span>
              )}
              <span className="text-xs text-gray-400 line-through tabular-nums">
                ₹{indicativeMRP.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#388E3C]">
                {discountPercent}% off
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
              <Truck className="w-3 h-3 text-gray-400 shrink-0" />
              <span>Direct factory dispatch to your site</span>
            </div>
          </div>

          {/* Quantity Selector + Amazon/Flipkart Action Button */}
          <div className="flex items-center gap-2">
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              aria-label="Select quantity"
              className="px-2 py-1.5 rounded border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#2874F0] tabular-nums cursor-pointer"
            >
              {[1, 2, 5, 8, 10, 15, 20, 50].map((n) => (
                <option key={n} value={n}>
                  × {n}
                </option>
              ))}
            </select>

            {/* Primary Action Button (Amazon/Flipkart warm amber `#FF9F00`) */}
            <button
              type="button"
              onClick={handleAddToEnquiry}
              className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 border border-[#f09600]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {existingInList
                      ? `Add More (${existingInList.quantity})`
                      : 'Add to Enquiry'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* View Details / Cart status */}
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <Link
              to={`/product/${product.slug || product.id}`}
              className="text-[#2874F0] hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>View Specifications</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {existingInList && (
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                In List ({existingInList.quantity}) →
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

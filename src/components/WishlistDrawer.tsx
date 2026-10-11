import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Check, 
  ExternalLink,
  Package
} from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const { 
    wishlistProducts = [], 
    wishlistCount = 0, 
    removeFromWishlist = () => {}, 
    clearWishlist = () => {}, 
    isWishlistDrawerOpen = false, 
    setIsWishlistDrawerOpen = () => {} 
  } = useProducts() as any;
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const navigate = useNavigate();

  if (!isWishlistDrawerOpen) return null;

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product: any) => {
      addToCart(product, 1);
    });
    setIsWishlistDrawerOpen(false);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#eaeded] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="bg-[#131921] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">Saved Wishlist</h2>
                <p className="text-xs text-slate-400">
                  {wishlistCount} {wishlistCount === 1 ? 'item saved' : 'items saved'} to buy later
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {wishlistCount > 0 && (
                <button
                  onClick={clearWishlist}
                  className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors"
                  title="Clear all wishlist items"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs my-8 space-y-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f1111]">Your Wishlist is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tap the heart icon on any screws, expansion anchors, or architectural panels to save them for your next project.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistDrawerOpen(false);
                    navigate('/products');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#ffd814] text-[#0f1111] font-bold text-xs hover:bg-[#f7ca00] transition-colors shadow-xs"
                >
                  Explore Products Catalog
                </button>
              </div>
            ) : (
              wishlistProducts.map((item: any) => (
                <div 
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex gap-3 transition-all hover:border-slate-300"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.id}`}
                    onClick={() => setIsWishlistDrawerOpen(false)}
                    className="w-20 h-20 bg-slate-50 rounded-lg p-1.5 border border-slate-100 shrink-0 flex items-center justify-center group overflow-hidden"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                    />
                  </Link>

                  {/* Details & Actions */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold text-[#007185] uppercase tracking-wide">
                        {item.category}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setIsWishlistDrawerOpen(false)}
                        className="text-xs font-bold text-[#0f1111] line-clamp-2 hover:text-[#007185] transition-colors leading-snug mt-0.5"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[#0f1111]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        item.availability === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.availability === 'Available' ? 'In Stock' : 'Out of stock'}
                      </span>
                    </div>

                    {/* Action buttons: Easy tap Add to Cart & Remove */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from wishlist"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Quick Checkout / Bulk Actions */}
          {wishlistProducts.length > 0 && (
            <div className="bg-white border-t border-slate-200 p-4 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Total Saved Value:</span>
                <span className="text-base font-black text-[#0f1111]">
                  ₹{wishlistProducts.reduce((sum: number, p: any) => sum + p.price, 0).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleAddAllToCart}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Move All to Cart & Checkout</span>
              </button>

              <button
                onClick={() => setIsWishlistDrawerOpen(false)}
                className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

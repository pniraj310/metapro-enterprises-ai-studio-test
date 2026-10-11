import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { AdminLayout } from '../../components/AdminLayout';
import { resolveMaterialImage } from '../../assets/materialImages';
import {
  Package,
  CheckCircle2,
  XCircle,
  Star,
  FolderTree,
  Plus,
  Edit3,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    featuredProduct,
    categories,
    toggleAvailability,
    setFeaturedProduct,
  } = useProducts();

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.availability === 'Available').length;
  const outOfStockProducts = products.filter((p) => p.availability === 'Out of Stock').length;
  const featuredCount = products.filter((p) => p.featured).length;
  const activeCategoriesCount = categories.filter((c) => c.active !== false).length;

  const recentProducts = products.slice(0, 8);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your PostgreSQL product catalogue, availability, and featured spotlight"
      primaryAction={
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#08142C] hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4 text-[#EAB01E]" />
          <span>+ Add Product</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* 5 Core Summary Metrics */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Total Products</span>
              <Package className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
              {totalProducts}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">In PostgreSQL database</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Available Products</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
              {availableProducts}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Ready for customer enquiry</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Out of Stock</span>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
              {outOfStockProducts}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Marked unavailable</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Featured Product</span>
              <Star className="w-4 h-4 text-[#EAB01E] fill-[#EAB01E]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
              {featuredCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 truncate">
              {featuredProduct ? featuredProduct.name : 'None selected'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Categories</span>
              <FolderTree className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
              {activeCategoriesCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              <Link to="/admin/categories" className="text-amber-700 hover:underline">
                Manage categories →
              </Link>
            </p>
          </div>
        </div>

        {/* Active Homepage Featured Product Card */}
        {featuredProduct && (
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={resolveMaterialImage(featuredProduct.image, featuredProduct.category)}
                alt={featuredProduct.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-[#EAB01E] text-[#EAB01E]" />
                  <span>Active Homepage Featured Product</span>
                </div>
                <h2 className="text-base font-semibold text-stone-950 truncate mt-0.5">
                  {featuredProduct.name}
                </h2>
                <p className="text-xs text-stone-600">
                  {featuredProduct.category} · ₹{featuredProduct.price.toLocaleString('en-IN')} /{' '}
                  {featuredProduct.unit || 'Unit'} · {featuredProduct.availability}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to={`/admin/products/edit/${featuredProduct.id}`}
                className="px-3.5 py-2 rounded-lg border border-stone-300 hover:border-stone-900 text-xs font-medium text-stone-800 transition-colors"
              >
                Edit Featured Product
              </Link>
              <Link
                to={`/product/${featuredProduct.slug || featuredProduct.id}`}
                className="px-3.5 py-2 rounded-lg bg-[#08142C] text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                View on Website
              </Link>
            </div>
          </div>
        )}

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-stone-950">Recent Products</h2>
              <p className="text-xs text-stone-500">
                Quickly toggle availability, change the homepage featured product, or edit details
              </p>
            </div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#08142C] hover:text-amber-700"
            >
              <span>View All Products ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-[11px] font-semibold uppercase tracking-wider border-b border-stone-200">
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / Unit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                {recentProducts.map((product) => {
                  const isAvailable = product.availability === 'Available';
                  const img = resolveMaterialImage(product.image, product.category);
                  return (
                    <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-medium text-stone-950 truncate">
                              {product.name}
                            </div>
                            {product.sku && (
                              <div className="text-[11px] font-mono text-stone-400">
                                {product.sku}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-stone-700">{product.category}</td>
                      <td className="py-3.5 px-4 tabular-nums">
                        <span className="font-semibold text-stone-950">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>{' '}
                        <span className="text-xs text-stone-400">/ {product.unit || 'Unit'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(product.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {isAvailable ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                          )}
                          <span>{product.availability}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setFeaturedProduct(product.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                            product.featured
                              ? 'bg-amber-50 text-amber-900 border border-amber-300 font-semibold'
                              : 'text-stone-500 hover:text-stone-900 border border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              product.featured
                                ? 'fill-[#EAB01E] text-[#EAB01E]'
                                : 'text-stone-400'
                            }`}
                          />
                          <span>{product.featured ? 'Featured' : 'Set Featured'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/product/${product.slug || product.id}`}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
                            title="View on Customer Website"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

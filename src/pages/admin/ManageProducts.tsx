import React, { useState, useMemo } from 'react';
import {
  useSearchParams,
  useParams,
  useLocation,
  useNavigate,
  Link,
} from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { Product, ProductFormData } from '../../types/product';
import { CATEGORIES } from '../../services/productService';
import { AdminLayout } from '../../components/AdminLayout';
import { ProductForm } from '../../components/ProductForm';
import { resolveMaterialImage } from '../../assets/materialImages';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Check,
  X,
  Star,
  ArrowLeft,
} from 'lucide-react';

export const ManageProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleAvailability,
    setFeaturedProduct,
  } = useProducts();

  const { id: routeProductId } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isAddRoute =
    location.pathname === '/admin/products/add' ||
    searchParams.get('action') === 'add';
  const isEditRoute =
    location.pathname.startsWith('/admin/products/edit/') ||
    Boolean(searchParams.get('edit'));

  const editingProductId = routeProductId || searchParams.get('edit') || undefined;
  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId || p.slug === editingProductId) || null
    : null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState<
    'all' | 'Available' | 'Out of Stock'
  >('all');

  const [isSaving, setIsSaving] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const categoryFilterOptions = useMemo(() => {
    if (categories.length > 0) {
      return ['All', ...categories.map((c) => c.name)];
    }
    return CATEGORIES;
  }, [categories]);

  const showNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    try {
      if (isEditRoute && editingProduct) {
        await updateProduct(editingProduct.id, data);
        showNotification(`Product "${data.name}" updated in PostgreSQL.`);
      } else {
        await addProduct(data);
        showNotification(`Product "${data.name}" created in PostgreSQL.`);
      }
      navigate('/admin/products');
    } catch (err: any) {
      showNotification(
        err?.message || 'An error occurred while saving the product.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelForm = () => {
    if (searchParams.get('edit') || searchParams.get('action')) {
      setSearchParams({});
    }
    navigate('/admin/products');
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    try {
      const success = await deleteProduct(productToDelete.id);
      if (success) {
        showNotification(`Product "${name}" deleted from PostgreSQL.`);
      } else {
        showNotification('Failed to delete product.', 'error');
      }
    } catch (err: any) {
      showNotification(err?.message || 'Failed to delete product.', 'error');
    }
    setProductToDelete(null);
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const updated = await toggleAvailability(product.id);
      if (updated) {
        showNotification(
          `"${product.name}" marked as ${updated.availability}.`
        );
      }
    } catch (err: any) {
      showNotification(
        err?.message || 'Failed to update availability.',
        'error'
      );
    }
  };

  const handleSetFeatured = async (product: Product) => {
    try {
      await setFeaturedProduct(product.id);
      showNotification(
        `"${product.name}" is now the active Homepage Featured Product.`
      );
    } catch (err: any) {
      showNotification(
        err?.message || 'Failed to update featured product.',
        'error'
      );
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku &&
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesAvailability =
        selectedAvailability === 'all' ||
        product.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, searchTerm, selectedCategory, selectedAvailability]);

  // Render Add / Edit Product Form View
  if (isAddRoute || isEditRoute) {
    return (
      <AdminLayout
        title={
          isEditRoute
            ? `Edit Product: ${editingProduct?.name || ''}`
            : 'Add New Product'
        }
        subtitle={
          isEditRoute
            ? 'Modify product pricing, images, specifications, applications, or availability in PostgreSQL'
            : 'Create a new product in the central PostgreSQL database for the customer website'
        }
        primaryAction={
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
        }
      >
        {isEditRoute && !editingProduct ? (
          <div className="bg-white rounded-xl p-8 border border-stone-200 text-center space-y-4">
            <p className="text-sm text-stone-600">
              Product not found. It may have been removed.
            </p>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#08142C] text-white text-xs font-semibold"
            >
              Return to Products
            </Link>
          </div>
        ) : (
          <ProductForm
            initialData={isEditRoute ? editingProduct : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            isLoading={isSaving}
          />
        )}
      </AdminLayout>
    );
  }

  // Render Main Products Table View (/admin/products)
  return (
    <AdminLayout
      title="Product Management"
      subtitle={`Showing ${filteredProducts.length} of ${products.length} products in PostgreSQL database`}
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
        {notification && (
          <div
            className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name, SKU, or category..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#08142C]"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-700 bg-white focus:outline-none focus:border-[#08142C]"
              >
                {categoryFilterOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedAvailability}
                onChange={(e) =>
                  setSelectedAvailability(e.target.value as any)
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-700 bg-white focus:outline-none focus:border-[#08142C]"
              >
                <option value="all">Status: All</option>
                <option value="Available">Available Only</option>
                <option value="Out of Stock">Out of Stock Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-[11px] font-semibold uppercase tracking-wider border-b border-stone-200">
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                {filteredProducts.map((product) => {
                  const isAvailable = product.availability === 'Available';
                  const img = resolveMaterialImage(
                    product.image,
                    product.category
                  );
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-stone-50/80 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={img}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-stone-950 truncate">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">
                              {product.sku || product.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-stone-700">
                        {product.category}
                      </td>

                      <td className="py-4 px-4 font-semibold text-stone-950 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-4 text-xs text-stone-600">
                        {product.unit || 'Unit'}
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-stone-700 tabular-nums">
                        {product.stock ?? 50}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(product)}
                          title="Click to toggle Available / Out of Stock"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
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

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(product)}
                          title="Set as the single active Homepage Featured Product"
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

                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${product.slug || product.id}`}
                            className="p-2 rounded-lg text-stone-500 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                            title="View on Customer Website"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-stone-900 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-medium text-red-600 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-red-50 text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-950">
                  Are you sure you want to delete this product?
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  <strong>{productToDelete.name}</strong> will be permanently
                  removed from the PostgreSQL database and customer website.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

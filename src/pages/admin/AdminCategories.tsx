import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { AdminLayout } from '../../components/AdminLayout';
import { CategoryItem } from '../../types/product';
import { MATERIAL_IMAGES } from '../../assets/materialImages';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Check,
  AlertTriangle,
  X,
  FolderTree,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(MATERIAL_IMAGES.flutedWpcPanels);
  const [active, setActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(
    null
  );
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage(MATERIAL_IMAGES.flutedWpcPanels);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || MATERIAL_IMAGES.flutedWpcPanels);
    setActive(cat.active !== false);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Category name is required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          image: image.trim(),
          active,
        });
        showNotification(`Category "${name.trim()}" updated.`);
      } else {
        await addCategory({
          name: name.trim(),
          description: description.trim(),
          image: image.trim(),
          active,
        });
        showNotification(`Category "${name.trim()}" added.`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showNotification(
        err?.message || 'Failed to save category.',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    try {
      const updated = await updateCategory(cat.id, {
        active: !cat.active,
      });
      showNotification(
        `Category "${cat.name}" ${
          updated.active ? 'activated' : 'deactivated'
        }.`
      );
    } catch (err: any) {
      showNotification(
        err?.message || 'Failed to update category status.',
        'error'
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const result = await deleteCategory(categoryToDelete.id);
      showNotification(result.message || 'Category updated.');
    } catch (err: any) {
      showNotification(
        err?.message || 'Failed to delete category.',
        'error'
      );
    }
    setCategoryToDelete(null);
  };

  return (
    <AdminLayout
      title="Category Management"
      subtitle="Create, edit, or deactivate product categories in PostgreSQL"
      primaryAction={
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#08142C] hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#EAB01E]" />
          <span>+ Add Category</span>
        </button>
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

        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-[11px] font-semibold uppercase tracking-wider border-b border-stone-200">
                  <th className="py-3.5 px-6">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Associated Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs sm:text-sm">
                {categories.map((cat) => {
                  const productCount = products.filter(
                    (p) => p.category === cat.name
                  ).length;
                  const isActive = cat.active !== false;

                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-stone-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                            <FolderTree className="w-4 h-4 text-stone-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-950">
                              {cat.name}
                            </div>
                            {cat.description && (
                              <div className="text-xs text-stone-500 line-clamp-1 max-w-md">
                                {cat.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs text-stone-500">
                        {cat.slug}
                      </td>

                      <td className="py-4 px-4 tabular-nums">
                        <span className="font-semibold text-stone-900">
                          {productCount}
                        </span>{' '}
                        <span className="text-xs text-stone-500">
                          {productCount === 1 ? 'product' : 'products'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600 border border-stone-300'
                          }`}
                        >
                          {isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-stone-500" />
                          )}
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-stone-900 text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-medium text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>
                              {productCount > 0 ? 'Deactivate' : 'Delete'}
                            </span>
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-stone-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-semibold text-stone-950">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. WPC Panels"
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown on the customer homepage category card..."
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#08142C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category Cover Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/assets/images/..."
                  className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#08142C]"
                />
              </div>

              <label className="flex items-center gap-2.5 text-xs font-medium text-stone-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-stone-300 text-[#08142C]"
                />
                <span>Show this category as Active on the Customer Website</span>
              </label>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-[#08142C] hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Delete / Deactivate Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-950">
                  {products.some((p) => p.category === categoryToDelete.name)
                    ? 'Category Linked to Existing Products'
                    : 'Delete Category?'}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {products.some((p) => p.category === categoryToDelete.name) ? (
                    <>
                      <strong>{categoryToDelete.name}</strong> is currently
                      associated with products in your catalogue. To protect
                      product relationships, confirming will safely{' '}
                      <strong>deactivate</strong> this category instead of
                      breaking product records.
                    </>
                  ) : (
                    <>
                      Are you sure you want to delete{' '}
                      <strong>{categoryToDelete.name}</strong>?
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                {products.some((p) => p.category === categoryToDelete.name)
                  ? 'Deactivate Safely'
                  : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

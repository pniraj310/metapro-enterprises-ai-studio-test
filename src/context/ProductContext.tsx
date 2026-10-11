import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductFormData,
  CategoryItem,
  BusinessSettingsData,
} from '../types/product';
import {
  productService,
  DEFAULT_BUSINESS_SETTINGS,
  INITIAL_PRODUCTS,
} from '../services/productService';

interface ProductContextType {
  products: Product[];
  featuredProduct: Product | undefined;
  categories: CategoryItem[];
  settings: BusinessSettingsData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  getProduct: (idOrSlug: string) => Product | undefined;
  addProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleAvailability: (id: string) => Promise<Product | null>;
  setFeaturedProduct: (id: string) => Promise<Product | null>;
  resetSampleData: () => Promise<void>;
  addCategory: (data: {
    name: string;
    description?: string;
    image?: string;
    active?: boolean;
  }) => Promise<CategoryItem>;
  updateCategory: (id: string, data: Partial<CategoryItem>) => Promise<CategoryItem>;
  deleteCategory: (id: string) => Promise<{
    deleted: boolean;
    deactivated?: boolean;
    message: string;
  }>;
  updateSettings: (data: Partial<BusinessSettingsData>) => Promise<BusinessSettingsData>;
  whatsAppNumber: string;
  updateWhatsAppNumber: (num: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettingsData>(DEFAULT_BUSINESS_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    try {
      const [prodList, catList, settingsData] = await Promise.all([
        productService.fetchAllFromApi(),
        productService.fetchCategoriesFromApi().catch(() => []),
        productService.fetchSettingsFromApi().catch(() => DEFAULT_BUSINESS_SETTINGS),
      ]);
      if (prodList.length > 0) {
        setProducts(prodList);
      }
      if (catList.length > 0) {
        setCategories(catList);
      }
      setSettings(settingsData);
    } catch (err) {
      console.warn('Error refreshing catalogue data from PostgreSQL API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Single primary Featured Product from database
  const featuredProduct =
    products.find((p) => p.featured) || products[0];

  const getProduct = (idOrSlug: string): Product | undefined => {
    return products.find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );
  };

  const addProduct = async (data: ProductFormData): Promise<Product> => {
    const created = await productService.createInApi(data);
    await refreshData();
    return created;
  };

  const updateProduct = async (
    id: string,
    data: Partial<ProductFormData>
  ): Promise<Product | null> => {
    const updated = await productService.updateInApi(id, data);
    await refreshData();
    return updated;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const ok = await productService.deleteFromApi(id);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    return ok;
  };

  const toggleAvailability = async (id: string): Promise<Product | null> => {
    const updated = await productService.toggleAvailabilityInApi(id);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const setFeaturedProduct = async (id: string): Promise<Product | null> => {
    const updated = await productService.setFeaturedInApi(id);
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        featured: p.id === id,
      }))
    );
    return updated;
  };

  const resetSampleData = async () => {
    const list = await productService.resetDefaultsInApi();
    setProducts(list);
  };

  const addCategory = async (data: {
    name: string;
    description?: string;
    image?: string;
    active?: boolean;
  }): Promise<CategoryItem> => {
    const created = await productService.createCategoryInApi(data);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (
    id: string,
    data: Partial<CategoryItem>
  ): Promise<CategoryItem> => {
    const updated = await productService.updateCategoryInApi(id, data);
    await refreshData();
    return updated;
  };

  const deleteCategory = async (id: string) => {
    const result = await productService.deleteCategoryFromApi(id);
    await refreshData();
    return result;
  };

  const updateSettings = async (
    data: Partial<BusinessSettingsData>
  ): Promise<BusinessSettingsData> => {
    const updated = await productService.updateSettingsInApi(data);
    setSettings(updated);
    return updated;
  };

  const updateWhatsAppNumber = async (num: string) => {
    const clean = num.replace(/[^0-9]/g, '');
    await updateSettings({ whatsAppNumber: clean });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProduct,
        categories,
        settings,
        isLoading,
        refreshData,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleAvailability,
        setFeaturedProduct,
        resetSampleData,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        whatsAppNumber: settings.whatsAppNumber || '917666323894',
        updateWhatsAppNumber,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

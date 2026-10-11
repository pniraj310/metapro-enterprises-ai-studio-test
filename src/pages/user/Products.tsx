import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from '../../components/SEOHelmet';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES } from '../../services/productService';
import {
  Search,
  RotateCcw,
  ClipboardList,
  PackageX,
  ChevronRight,
  Filter,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';

export const Products: React.FC = () => {
  const { products, categories } = useProducts();
  const { cart, totalItems, setIsCartDrawerOpen } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: routeCategoryParam } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available_only'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'name'>('featured');

  const categoryTabs = useMemo(() => {
    const activeCats = categories.filter((c) => c.active !== false);
    if (activeCats.length > 0) {
      return ['All', ...activeCats.map((c) => c.name)];
    }
    return CATEGORIES;
  }, [categories]);

  useEffect(() => {
    const decodedRouteCat = routeCategoryParam
      ? decodeURIComponent(routeCategoryParam)
      : null;
    const queryCat = searchParams.get('category');

    const requestedCat = decodedRouteCat || queryCat;
    if (requestedCat) {
      const matched = categories.find(
        (c) =>
          c.name.toLowerCase() === requestedCat.toLowerCase() ||
          c.slug.toLowerCase() === requestedCat.toLowerCase()
      );
      setSelectedCategory(matched ? matched.name : requestedCat);
    } else {
      setSelectedCategory('All');
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [routeCategoryParam, searchParams, categories]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (routeCategoryParam) {
      if (cat === 'All') {
        navigate('/materials');
      } else {
        navigate(`/materials/${encodeURIComponent(cat)}`);
      }
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setAvailabilityFilter('all');
    setSortBy('featured');
    if (routeCategoryParam) {
      navigate('/materials');
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.sku && product.sku.toLowerCase().includes(query)) ||
        product.specifications?.some(
          (s) =>
            s.label.toLowerCase().includes(query) ||
            s.value.toLowerCase().includes(query)
        );

      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesAvailability =
        availabilityFilter === 'all' || product.availability === 'Available';

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Sorting (Amazon/Flipkart style)
    if (sortBy === 'price_low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchTerm, selectedCategory, availabilityFilter, sortBy]);

  const activeCategoryObj = categories.find(
    (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
  );
  const catalogueSeoTitle =
    selectedCategory === 'All'
      ? 'Interior Materials, Wall Panels & Fasteners Catalogue'
      : `${selectedCategory} — Architectural Materials & Hardware`;
  const catalogueSeoDescription =
    activeCategoryObj?.description ||
    `Explore ${
      selectedCategory === 'All'
        ? 'fluted wall panels, WPC louvers, PVC marble sheets, acoustic ceiling tiles, metal trims, and fasteners'
        : selectedCategory
    } from MetaPro Enterprises. Add items to your Enquiry List for a fast WhatsApp quotation.`;

  return (
    <div className="w-full bg-[#F1F3F6] min-h-screen font-sans pb-16">
      <Helmet
        title={catalogueSeoTitle}
        description={catalogueSeoDescription}
        canonicalPath={
          selectedCategory === 'All'
            ? '/materials'
            : `/materials/${encodeURIComponent(selectedCategory)}`
        }
      />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-gray-200 bg-white py-2.5 px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 text-xs text-gray-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-[#2874F0] text-gray-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-semibold">
              {selectedCategory === 'All' ? 'All Materials' : selectedCategory}
            </span>
          </nav>

          <span className="text-gray-500 font-medium hidden sm:inline">
            Showing {filteredProducts.length} of {products.length} materials
          </span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT SIDEBAR: FILTERS (Flipkart / Amazon Style) */}
          <aside className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <Filter className="w-4 h-4 text-[#2874F0]" />
                <span>Filters</span>
              </div>
              {(selectedCategory !== 'All' || searchTerm || availabilityFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#2874F0] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search in catalogue */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Search Materials</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter name, finish, SKU..."
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>

            {/* Categories filter */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Categories
              </span>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {categoryTabs.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  const count =
                    cat === 'All'
                      ? products.length
                      : products.filter(
                          (p) => p.category.toLowerCase() === cat.toLowerCase()
                        ).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-[#2874F0] font-bold border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span className="text-[10px] text-gray-400 tabular-nums">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Availability
              </span>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availabilityFilter === 'available_only'}
                  onChange={(e) =>
                    setAvailabilityFilter(e.target.checked ? 'available_only' : 'all')
                  }
                  className="rounded border-gray-300 text-[#2874F0] focus:ring-[#2874F0]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Quick Enquiry Drawer Link */}
            <div className="pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="w-full py-2 px-3 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-[#FF9F00]" />
                  <span>Enquiry List</span>
                </div>
                <span className="font-bold text-gray-900">{cart.length} items</span>
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: MAIN CATALOGUE & PRODUCT GRID */}
          <main className="lg:col-span-9 space-y-4">
            {/* Top Sort & Header Bar (Flipkart Style) */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {selectedCategory === 'All' ? 'All Interior Materials & Hardware' : selectedCategory}
                </h1>
                <p className="text-xs text-gray-500">
                  Showing {filteredProducts.length} materials · Indicative trade rates
                </p>
              </div>

              {/* Flipkart-Style Sort Tabs */}
              <div className="flex items-center gap-1.5 text-xs self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-gray-500 font-semibold pr-1 shrink-0 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Sort by:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSortBy('featured')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer shrink-0 ${
                    sortBy === 'featured'
                      ? 'bg-[#2874F0] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Popularity
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('price_low')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer shrink-0 ${
                    sortBy === 'price_low'
                      ? 'bg-[#2874F0] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('price_high')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer shrink-0 ${
                    sortBy === 'price_high'
                      ? 'bg-[#2874F0] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Price: High to Low
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200 max-w-lg mx-auto my-8 space-y-4 shadow-xs">
                <PackageX className="w-12 h-12 text-gray-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">
                    No matching materials found
                  </h3>
                  <p className="text-xs text-gray-500">
                    Try adjusting your search keywords or switching category filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-md bg-[#FF9F00] text-gray-950 font-bold text-xs shadow-xs hover:bg-[#F39000] cursor-pointer"
                >
                  Show All Materials
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  Package,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { CATEGORIES } from '../../services/productService';
import { Product } from '../../types/product';
import { AISpecifierModal } from './AISpecifierModal';

interface NavbarSearchProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
  onOpenAiModal?: (query?: string) => void;
}

const RECENT_SEARCHES_KEY = 'metapro_recent_searches_v1';

const TRENDING_SEARCHES = [
  'Drywall Screws Bugle Head 25mm',
  'M10 Heavy Duty Expansion Anchors',
  'Italian Calacatta UV PVC Marble Sheet',
  'Charcoal Grey Fluted Wall Panel',
  'Acoustic Ceiling Panels'
];

const AI_QUICK_PRESETS = [
  { label: 'Ceiling Screw Estimator', query: 'How many drywall screws for 1,000 sq ft ceiling?' },
  { label: 'Waterproof Wall Cladding', query: 'Waterproof and termite proof wall panels for bathroom' },
  { label: 'Heavy Masonry Anchors', query: 'Anchor bolts sizing for 150kg AC outdoor frame on brick' }
];

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
  onOpenAiModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalQuery, setAiModalQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { products } = useProducts();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch (e) {
      console.warn('Failed to load recent searches', e);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save recent search', e);
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Close dropdown on click or touch outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filter matching products in real-time
  const matchedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCategory) return false;

      const inName = p.name.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inCat = p.category.toLowerCase().includes(q);
      const inSpecs = p.specifications.some(
        (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
      );

      return inName || inDesc || inCat || inSpecs;
    }).slice(0, 6); // Top 6 matching items
  }, [searchQuery, selectedCategory, products]);

  // Matching categories
  const matchingCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return CATEGORIES.filter(c => c !== 'All' && c.toLowerCase().includes(q));
  }, [searchQuery]);

  // Combined suggestion list for keyboard navigation
  const allNavigableItems = useMemo(() => {
    const items: Array<{ type: 'product' | 'category' | 'ai' | 'submit'; data: any }> = [];
    
    if (searchQuery.trim()) {
      // AI prompt banner
      items.push({ type: 'ai', data: searchQuery.trim() });
      
      // Matching categories
      matchingCategories.forEach(cat => items.push({ type: 'category', data: cat }));

      // Matching products
      matchedProducts.forEach(prod => items.push({ type: 'product', data: prod }));
      
      // General submit
      items.push({ type: 'submit', data: searchQuery.trim() });
    }
    return items;
  }, [searchQuery, matchingCategories, matchedProducts]);

  const executeSearch = (queryToSearch: string, categoryOverride?: string) => {
    const cat = categoryOverride !== undefined ? categoryOverride : selectedCategory;
    saveRecentSearch(queryToSearch);
    setIsDropdownOpen(false);
    setActiveIndex(-1);

    const params = new URLSearchParams();
    if (queryToSearch.trim()) {
      params.set('search', queryToSearch.trim());
    }
    if (cat && cat !== 'All') {
      params.set('category', cat);
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < allNavigableItems.length) {
      const item = allNavigableItems[activeIndex];
      if (item.type === 'ai') {
        openAiSpecifier(item.data);
        return;
      } else if (item.type === 'category') {
        onSelectCategory(item.data);
        executeSearch(searchQuery, item.data);
        return;
      } else if (item.type === 'product') {
        saveRecentSearch(searchQuery || item.data.name);
        setIsDropdownOpen(false);
        navigate(`/products/${item.data.id}`);
        return;
      }
    }
    executeSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < allNavigableItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : allNavigableItems.length - 1));
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  const openAiSpecifier = (customQuery?: string) => {
    const target = customQuery || searchQuery || 'Construction fastener & panel specification';
    if (onOpenAiModal) {
      onOpenAiModal(target);
    } else {
      setAiModalQuery(target);
      setIsAiModalOpen(true);
    }
    setIsDropdownOpen(false);
  };

  // Helper to highlight matching text in title with high contrast
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="text-amber-950 bg-amber-200/90 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative flex-1 min-w-0 ${className}`}>
      {/* Central Search Bar: Category Dropdown + Input with Clear Button + Brand Gold Submit Button */}
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center h-10 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#DF9E26] shadow-sm transition-shadow border border-slate-300/80"
      >
        {/* Category Dropdown (Left side on tablet and desktop) */}
        <div className="hidden sm:flex relative bg-slate-100 hover:bg-slate-200 border-r border-slate-300 text-slate-800 text-xs font-semibold h-full items-center px-3 cursor-pointer transition-colors shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => {
              onSelectCategory(e.target.value);
              inputRef.current?.focus();
            }}
            aria-label="Select product category filter"
            className="bg-transparent text-slate-900 text-xs font-bold focus:outline-hidden cursor-pointer pr-4 appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 pointer-events-none absolute right-1.5 text-slate-600" />
        </div>

        {/* Input Field with spacious typing area */}
        <div className="relative flex-1 flex items-center h-full min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search drywall screws, anchor bolts, PVC sheets, fluted panels..."
            className="w-full px-3.5 pr-9 text-xs sm:text-sm text-slate-950 placeholder:text-slate-500 focus:outline-hidden h-full font-semibold"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Quick Clear Button (X) - positioned without covering typing text */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-2 p-1 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Brand Gold Search Button (#DF9E26) */}
        <button
          type="submit"
          aria-label="Submit search"
          className="w-11 sm:w-12 h-full bg-[#DF9E26] hover:bg-[#cf8e18] active:bg-[#b87d14] text-[#0B1528] flex items-center justify-center cursor-pointer transition-colors shrink-0"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
        </button>
      </form>

      {/* REAL-TIME AUTO-COMPLETE DROPDOWN */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-[80vh] overflow-y-auto ring-1 ring-black/10">
          
          {/* CASE A: USER HAS TYPED TEXT */}
          {searchQuery.trim().length > 0 ? (
            <div className="divide-y divide-slate-100">

              {/* 1. AI Specifier Banner: "Ask MetaPro AI" */}
              <div 
                onClick={() => openAiSpecifier(searchQuery)}
                className="bg-gradient-to-r from-[#0B1528] via-[#152238] to-[#0B1528] text-white p-3 cursor-pointer hover:opacity-95 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DF9E26] flex items-center justify-center text-[#0B1528] shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Sparkles className="w-4 h-4 fill-[#0B1528]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span>Ask MetaPro AI for:</span>
                      <span className="text-[#DF9E26] underline font-black">"{searchQuery}"</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">
                      Substrate load ratings, screw sizing & contractor material calculator
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#DF9E26] group-hover:translate-x-1 transition-transform shrink-0">
                  <span className="hidden sm:inline">Analyze Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* 2. Category Search Filter Recommendations */}
              {selectedCategory !== 'All' && (
                <div
                  onClick={() => executeSearch(searchQuery, selectedCategory)}
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs text-slate-800 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span>Search "{searchQuery}" in <strong className="text-amber-800 font-black">{selectedCategory}</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">Active Filter</span>
                </div>
              )}

              {/* Matching Categories from Store */}
              {matchingCategories.length > 0 && (
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>Matching Product Categories</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat);
                          executeSearch(searchQuery, cat);
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-500 text-slate-900 hover:text-amber-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>{cat}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Real-Time Product Matches with Thumbnails and Clear High-Contrast Text */}
              <div className="py-2">
                <div className="px-4 py-1.5 flex items-center justify-between border-b border-slate-50">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-700" />
                    <span>Products ({matchedProducts.length})</span>
                  </span>
                  {matchedProducts.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Click to inspect specifications
                    </span>
                  )}
                </div>

                {matchedProducts.length === 0 ? (
                  <div className="px-4 py-6 text-center space-y-2">
                    <Package className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-600 font-semibold">
                      No exact product titles matching "<strong className="text-slate-900">{searchQuery}</strong>".
                    </p>
                    <button
                      type="button"
                      onClick={() => openAiSpecifier(searchQuery)}
                      className="px-3.5 py-2 bg-[#DF9E26] hover:bg-[#cf8e18] text-[#0B1528] rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask MetaPro AI for Equivalent Specs</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {matchedProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          saveRecentSearch(searchQuery || product.name);
                          setIsDropdownOpen(false);
                          navigate(`/products/${product.id}`);
                        }}
                        className="px-4 py-2.5 hover:bg-amber-50/70 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {/* Product Thumbnail */}
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-[#DF9E26] transition-colors">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 leading-none">
                                {product.category}
                              </span>
                              {product.availability === 'Available' && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 leading-none">
                                  In Stock
                                </span>
                              )}
                            </div>

                            <div className="text-sm font-bold text-slate-900 truncate group-hover:text-[#007185] transition-colors">
                              {highlightMatch(product.name, searchQuery)}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-black text-slate-950">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs text-slate-400 line-through font-medium">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              {product.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-slate-400 group-hover:text-amber-800 transition-colors">
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Bottom View All Results Action */}
              <div 
                onClick={() => executeSearch(searchQuery)}
                className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border-t border-slate-100 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#007185]">
                    See all catalog products for "<strong className="text-slate-950 font-black">{searchQuery}</strong>"
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#007185] group-hover:translate-x-1 transition-transform">
                  <span>View All Results</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          ) : (
            /* CASE B: EMPTY INPUT (RECENT SEARCHES & TRENDING TOPICS) */
            <div className="p-4 space-y-4">
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          executeSearch(term);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Contractor Searches */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#DF9E26]" />
                  <span>Trending Construction Materials</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRENDING_SEARCHES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        executeSearch(item);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-100 hover:border-amber-200 text-left text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Specifier Presets */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-xl p-3.5 border border-[#DF9E26]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-[#0B1528]">
                    <Sparkles className="w-4 h-4 text-[#DF9E26]" />
                    <span>MetaPro AI Construction Specifier</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAiSpecifier()}
                    className="text-[11px] font-bold text-[#007185] hover:underline cursor-pointer"
                  >
                    Open AI Studio →
                  </button>
                </div>

                <div className="space-y-1.5">
                  {AI_QUICK_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => openAiSpecifier(preset.query)}
                      className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-amber-50 text-xs text-slate-900 transition-colors flex items-center justify-between gap-2 shadow-2xs border border-amber-200/60 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#DF9E26]/25 text-[#0B1528] shrink-0">
                          {preset.label}
                        </span>
                        <span className="truncate text-slate-700 font-semibold">{preset.query}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#DF9E26] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* AI Specifier Full Dialog Modal */}
      <AISpecifierModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiModalQuery}
        initialCategory={selectedCategory}
      />
    </div>
  );
};

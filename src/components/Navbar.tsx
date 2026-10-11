import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { usePincode } from '../context/PincodeContext';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { MetaProLogo } from './MetaProLogo';
import {
  ClipboardList,
  Menu,
  X,
  MessageSquare,
  Check,
  Search,
  MapPin,
  Truck,
  ChevronDown,
  Clock,
  TrendingUp,
} from 'lucide-react';

export interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

const POPULAR_SEARCH_TERMS = [
  'WPC Fluted Panels',
  'PVC Marble Wall Panel',
  'Acoustic Ceiling Tiles',
  'Self-Drilling Screws',
  'Anchor Bolts',
  '3D Relief Wall Tiles',
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const { cart, totalItems, setIsCartDrawerOpen, toastMessage } = useCart();
  const { settings, categories, whatsAppNumber } = useProducts();
  const { currentPincode } = usePincode();
  const { history, addQuery, removeQuery, clearHistory } = useSearchHistory();
  const location = useLocation();
  const navigate = useNavigate();

  // Close search dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target)
      ) {
        setIsDesktopSearchOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync search input if URL has search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) {
      setSearchInput(q);
    }
  }, [location.search]);

  const directWhatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    `Hello ${settings.businessName || 'MetaPro Enterprises'}, I would like to enquire about your interior materials and hardware solutions.`
  )}`;

  const executeSearch = (term: string) => {
    const clean = term.trim();
    if (clean) {
      addQuery(clean);
      setSearchInput(clean);
      setIsDesktopSearchOpen(false);
      setIsMobileSearchOpen(false);
      navigate(`/materials?search=${encodeURIComponent(clean)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const activeCategories = categories.filter((c) => c.active !== false);

  const quickNavCategories = [
    { name: 'All Materials', path: '/materials' },
    { name: 'Fasteners & Screws', path: '/materials/Fasteners%20%26%20Screws' },
    { name: 'Anchor Bolts', path: '/materials/Anchor%20Bolts%20%26%20Hardware' },
    { name: 'PVC Wall Panels', path: '/materials/PVC%20Wall%20Panels' },
    { name: 'Fluted Panels', path: '/materials/Fluted%20Panels' },
    { name: 'WPC Panels', path: '/materials/WPC%20Panels' },
    { name: 'Ceiling Panels', path: '/materials/Interior%20Ceiling%20Panels' },
    { name: 'Decorative Panels', path: '/materials/Decorative%20Wall%20Panels' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 font-sans shadow-xs">
      {/* Subtle Enquiry List Toast Bar */}
      {toastMessage && (
        <div className="bg-[#172337] text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2 border-b border-gray-800">
          <Check className="w-3.5 h-3.5 text-[#FF9F00] shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="ml-2 font-semibold text-[#FF9F00] hover:underline cursor-pointer whitespace-nowrap"
          >
            Open Enquiry List ({cart.length})
          </button>
        </div>
      )}

      {/* Main Shopping-Style Header (Amazon + Flipkart Hybrid) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/"
            className="inline-flex items-center hover:opacity-90 transition-opacity"
            aria-label="MetaPro Enterprises Home"
          >
            <MetaProLogo variant="full" theme="light" size="sm" />
          </Link>

          {/* Amazon-style Delivery Location Pin */}
          <Link
            to="/track-order"
            className="hidden lg:flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#2874F0] p-1.5 rounded transition-colors group cursor-pointer"
            title="Check delivery destination"
          >
            <MapPin className="w-4 h-4 text-[#2874F0] group-hover:scale-110 transition-transform shrink-0" />
            <div className="leading-tight text-left">
              <span className="text-[10px] text-gray-500 block">Deliver to</span>
              <span className="font-semibold text-gray-900 group-hover:text-[#2874F0]">
                {currentPincode || '440026 Nagpur'}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar with localStorage Recent Queries Dropdown */}
        <div
          ref={desktopSearchRef}
          className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl relative items-center"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center rounded-lg border border-gray-300 hover:border-gray-400 focus-within:border-[#2874F0] focus-within:ring-2 focus-within:ring-[#2874F0]/20 bg-gray-50 focus-within:bg-white overflow-hidden transition-all shadow-2xs"
          >
            <div className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 border-r border-gray-300 shrink-0 select-none">
              <span>All Materials</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            <input
              type="search"
              value={searchInput}
              onFocus={() => setIsDesktopSearchOpen(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (!isDesktopSearchOpen) setIsDesktopSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsDesktopSearchOpen(false);
              }}
              placeholder="Search interior wall panels, fluted louvers, screws, ceiling tiles..."
              className="w-full pl-3 pr-4 py-2 sm:py-2.5 bg-transparent text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />

            {/* Amazon/Flipkart signature warm amber search button */}
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 font-semibold flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Search History & Suggestions Dropdown */}
          {isDesktopSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100 z-50 overflow-hidden text-xs">
              {/* 1. Recent Search History (from localStorage) */}
              {history.length > 0 && (
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        clearHistory();
                      }}
                      className="text-[#2874F0] hover:underline cursor-pointer lowercase first-letter:uppercase font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {history.map((query) => (
                      <div
                        key={query}
                        className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            executeSearch(query);
                          }}
                          className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover:text-[#2874F0]" />
                          <span className="font-semibold text-gray-800 group-hover:text-[#2874F0] truncate">
                            {query}
                          </span>
                        </button>

                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeQuery(query);
                          }}
                          title="Delete from search history"
                          className="text-gray-300 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Popular / Trending Material Suggestions */}
              <div className="p-2.5 space-y-1 bg-gray-50/50">
                <span className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3 text-[#FF9F00]" />
                  <span>Popular Material Searches</span>
                </span>
                <div className="flex flex-wrap gap-1.5 px-1 py-1">
                  {POPULAR_SEARCH_TERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        executeSearch(term);
                      }}
                      className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-[#2874F0] text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Track Order, Enquiry List (Cart), WhatsApp */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/track-order"
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-[#2874F0] transition-colors"
          >
            <Truck className="w-4 h-4 text-gray-500" />
            <span>Track Order</span>
          </Link>

          {/* Flipkart / Amazon style Enquiry List (Cart) Button with badge */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 bg-white text-gray-900 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
            aria-label="Open Material Enquiry List"
          >
            <ClipboardList className="w-4 h-4 text-gray-800 shrink-0" />
            <span className="hidden sm:inline">Enquiry List</span>
            {cart.length > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-[#FF9F00] text-gray-950 font-bold text-[11px] tabular-nums leading-none">
                {cart.length}
              </span>
            ) : (
              <span className="text-gray-400 font-normal text-xs">(0)</span>
            )}
          </button>

          {/* Talk to Us on WhatsApp */}
          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Talk to Us</span>
          </a>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={onOpenMobileMenu ? onOpenMobileMenu : () => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search Row (0–767px) with Search History Dropdown */}
      <div ref={mobileSearchRef} className="md:hidden px-4 pb-2.5 relative">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center rounded-lg border border-gray-300 bg-gray-50 overflow-hidden shadow-2xs focus-within:border-[#2874F0] focus-within:bg-white"
        >
          <input
            type="search"
            value={searchInput}
            onFocus={() => setIsMobileSearchOpen(true)}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (!isMobileSearchOpen) setIsMobileSearchOpen(true);
            }}
            placeholder="Search panels, louvers, screws..."
            className="w-full pl-3 pr-2 py-2 bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#FF9F00] hover:bg-[#F39000] text-gray-950 font-semibold"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mobile Search History Dropdown */}
        {isMobileSearchOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100 z-50 overflow-hidden text-xs">
            {history.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      clearHistory();
                    }}
                    className="text-[#2874F0] hover:underline cursor-pointer lowercase first-letter:uppercase font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-0.5">
                  {history.map((query) => (
                    <div
                      key={query}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-50"
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          executeSearch(query);
                        }}
                        className="flex items-center gap-2 flex-1 text-left"
                      >
                        <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">
                          {query}
                        </span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeQuery(query);
                        }}
                        className="text-gray-300 hover:text-red-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Popular Suggestions */}
            <div className="p-2 space-y-1 bg-gray-50/50">
              <span className="flex items-center gap-1 px-1 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <TrendingUp className="w-3 h-3 text-[#FF9F00]" />
                <span>Trending Searches</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_SEARCH_TERMS.slice(0, 4).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeSearch(term);
                    }}
                    className="px-2 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px] font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flipkart-Style Horizontal Category Ribbon (Sub-navbar) */}
      <div className="w-full bg-[#FAF9F6] border-t border-gray-200/90 overflow-x-auto scrollbar-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-8 h-10 sm:h-11 text-xs font-medium text-gray-700 whitespace-nowrap">
          {quickNavCategories.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/materials' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`py-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'border-[#2874F0] text-[#2874F0] font-semibold'
                    : 'border-transparent hover:text-gray-950 hover:border-gray-400'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="h-4 w-px bg-gray-300 shrink-0 hidden sm:block" />

          <Link
            to="/about"
            className="py-2 border-b-2 border-transparent hover:text-gray-950 hover:border-gray-400 transition-colors hidden sm:inline-block"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="py-2 border-b-2 border-transparent hover:text-gray-950 hover:border-gray-400 transition-colors hidden sm:inline-block"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

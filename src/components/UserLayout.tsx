import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { usePincode } from '../context/PincodeContext';
import { MetaProLogo } from './MetaProLogo';
import {
  ClipboardList,
  MessageSquare,
  X,
  Layers,
  Info,
  Home,
  Truck,
  Phone,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const UserLayout: React.FC = () => {
  const {
    cart,
    totalItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    getWhatsAppEnquiryUrl,
    recordEnquirySubmission,
  } = useCart();
  const { categories, settings, whatsAppNumber } = useProducts();
  const { currentPincode } = usePincode();
  const location = useLocation();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll and handle ESC key when mobile drawer is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };

    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileDrawerOpen]);

  const activeCategories = categories.filter((c) => c.active !== false);

  const directWhatsAppUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    `Hello ${settings.businessName || 'MetaPro Enterprises'}, I would like to enquire about your interior materials catalogue.`
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F3F6] text-gray-900 antialiased font-sans">
      <Navbar onOpenMobileMenu={() => setIsMobileDrawerOpen(true)} />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />

      {/* Material Enquiry List Slide-Over Drawer */}
      <CartDrawer />

      {/* ========================================================================= */}
      {/* SLIDE-IN SIDE DRAWER FOR MOBILE NAVIGATION (Amazon / Flipkart Style)      */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 overflow-hidden font-sans"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Slide-in Drawer Container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <aside className="w-screen max-w-[320px] sm:max-w-xs bg-white text-gray-900 flex flex-col shadow-2xl border-r border-gray-200 animate-in slide-in-from-left duration-300">
              {/* Drawer Top Header (Flipkart / Amazon Navy Header) */}
              <div className="bg-[#172337] text-white p-5 flex items-center justify-between border-b border-gray-800">
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="inline-block"
                  >
                    <MetaProLogo variant="full" theme="dark" size="sm" />
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-[#FF9F00] shrink-0" />
                    <span className="truncate">
                      Deliver to {currentPincode || '440026 Nagpur'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Navigation List */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {/* 1. Core Primary Links (Materials, Enquiry List, About Us) */}
                <div className="p-3 space-y-1">
                  <span className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                    Main Navigation
                  </span>

                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      location.pathname === '/'
                        ? 'bg-blue-50 text-[#2874F0]'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span>Home Showroom</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>

                  {/* Materials (Primary Link requested) */}
                  <Link
                    to="/materials"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      location.pathname.startsWith('/materials') ||
                      location.pathname === '/products'
                        ? 'bg-blue-50 text-[#2874F0]'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-[#2874F0]" />
                      <span>Materials Catalogue</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#2874F0]/10 text-[#2874F0] text-[10px] font-bold">
                      26+ Materials
                    </span>
                  </Link>

                  {/* Enquiry List (Primary Link requested) */}
                  <Link
                    to="/enquiry-list"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      location.pathname === '/enquiry-list' ||
                      location.pathname === '/enquiry' ||
                      location.pathname === '/cart'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ClipboardList className="w-4 h-4 text-[#FF9F00]" />
                      <span>Enquiry List</span>
                    </div>
                    {cart.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#FF9F00] text-gray-950 font-bold text-[11px] tabular-nums">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-normal">
                        Empty
                      </span>
                    )}
                  </Link>

                  {/* About Us (Primary Link requested) */}
                  <Link
                    to="/about"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      location.pathname === '/about'
                        ? 'bg-blue-50 text-[#2874F0]'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-gray-500" />
                      <span>About Us</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>

                {/* 2. Material Categories Sub-Menu */}
                <div className="p-3 space-y-1">
                  <span className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                    Shop by Material
                  </span>
                  {activeCategories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/materials/${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    </Link>
                  ))}
                </div>

                {/* 3. Customer Services & Logistics */}
                <div className="p-3 space-y-1">
                  <span className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                    Customer Services
                  </span>

                  <Link
                    to="/track-order"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span>Track Order & Dispatch</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </Link>

                  <Link
                    to="/contact"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Contact & Showroom Location</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </Link>
                </div>

                {/* 4. Trust Pillars & Benefits */}
                <div className="p-4 bg-gray-50/60 space-y-2 text-[11px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2874F0] shrink-0" />
                    <span>Direct Factory Trade Rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#2874F0] shrink-0" />
                    <span>Safe Site Delivery Across India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#2874F0] shrink-0" />
                    <span>GST Invoices with 18% ITC</span>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Action (WhatsApp Direct) */}
              <div className="p-4 border-t border-gray-200 bg-white space-y-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Talk to Us on WhatsApp</span>
                </a>

                <div className="text-center">
                  <span className="text-[10px] text-gray-400">
                    Showroom: Kamptee Road, Nagpur · Mon–Sat
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Floating Enquiry List Bar when items are collected (Amazon/Flipkart Style) */}
      {cart.length > 0 && !isCartDrawerOpen && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-30 max-w-md w-auto bg-[#172337] text-white rounded-xl p-3.5 shadow-2xl border border-gray-700 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FF9F00]/20 border border-[#FF9F00]/40 flex items-center justify-center text-[#FF9F00] shrink-0">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Enquiry List</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#FF9F00] text-gray-950 font-bold text-[10px]">
                  {cart.length}
                </span>
              </div>
              <div className="text-[11px] text-gray-300 tabular-nums">
                {totalItems} total units · Click to review
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="px-3 py-1.5 rounded-md bg-[#FF9F00] hover:bg-[#F39000] text-xs font-bold text-gray-950 transition-colors cursor-pointer shadow-2xs"
            >
              Review
            </button>
            <a
              href={getWhatsAppEnquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordEnquirySubmission()}
              className="p-2 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-medium transition-colors"
              title="Send to WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

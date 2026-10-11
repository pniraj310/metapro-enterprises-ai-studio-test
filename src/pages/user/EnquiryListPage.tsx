import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { resolveMaterialImage } from '../../assets/materialImages';
import {
  ClipboardList,
  Trash2,
  Plus,
  Minus,
  MessageSquare,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

const PROJECT_SPACES = [
  'Living Spaces',
  'Office Interiors',
  'Commercial Spaces',
  'Ceiling & Wall Applications',
  'Full Interior Project',
];

export const EnquiryListPage: React.FC = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    enquiryDetails,
    setEnquiryDetails,
    getFormattedWhatsAppMessage,
    getWhatsAppEnquiryUrl,
    recordEnquirySubmission,
  } = useCart();

  const { products } = useProducts();

  const [copied, setCopied] = useState(false);
  const [submittedBanner, setSubmittedBanner] = useState(false);
  const [selectedQuickProductId, setSelectedQuickProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [quickQty, setQuickQty] = useState<number>(5);

  const formattedMessage = getFormattedWhatsAppMessage();
  const whatsappUrl = getWhatsAppEnquiryUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSendWhatsApp = () => {
    recordEnquirySubmission();
    setSubmittedBanner(true);
    setTimeout(() => setSubmittedBanner(false), 6000);
  };

  const handleLoadSampleBundle = () => {
    const pvc = products.find((p) => p.category === 'PVC Wall Panels') || products[1];
    const fluted = products.find((p) => p.category === 'Fluted Panels') || products[0];
    const wpc = products.find((p) => p.category === 'WPC Panels') || products[2];
    if (pvc) addToCart(pvc, 10);
    if (fluted) addToCart(fluted, 5);
    if (wpc) addToCart(wpc, 8);
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const found = products.find((p) => p.id === selectedQuickProductId) || products[0];
    if (found) {
      addToCart(found, Math.max(1, quickQty));
    }
  };

  return (
    <div className="w-full bg-[#F1F3F6] min-h-screen py-8 sm:py-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
              Showroom Material Schedule · Direct WhatsApp Dispatch
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-stone-950 tracking-tight">
              Material Enquiry List
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              Collect wall panels, ceiling systems, and architectural hardware with your required quantities. Generate a structured WhatsApp enquiry message directly for the MetaPro Enterprises showroom team—no online checkout required.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLoadSampleBundle}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-xs font-medium text-stone-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#DF9E26]" />
              <span>Load Sample Schedule (PVC × 10, Fluted × 5, WPC × 8)</span>
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141413] hover:bg-stone-800 text-white text-xs font-medium transition-colors"
            >
              <span>Browse All Materials</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DF9E26]" />
            </Link>
          </div>
        </div>

        {/* Main 12-Col Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Collected Materials + Quick Add */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Add Material Bar */}
            <form
              onSubmit={handleQuickAdd}
              className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
            >
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Add Material from Catalogue
                </label>
                <select
                  value={selectedQuickProductId || products[0]?.id || ''}
                  onChange={(e) => setSelectedQuickProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-[#FAF9F6] text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price.toLocaleString('en-IN')} / {p.unit || 'Unit'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-28">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quickQty}
                  onChange={(e) => setQuickQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-[#FAF9F6] text-xs sm:text-sm text-stone-900 text-center font-semibold tabular-nums focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#141413] hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#DF9E26]" />
                <span>Add to List</span>
              </button>
            </form>

            {/* Selected Items Table / List */}
            {cart.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-10 text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-500">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-lg font-semibold text-stone-950">
                    Your Enquiry List is Currently Empty
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Add wall panels, ceiling materials, or hardware from our catalogue—or load a sample material schedule below to test the pre-formatted WhatsApp enquiry generator.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleLoadSampleBundle}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#DF9E26] hover:bg-amber-500 text-stone-950 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Load Example: PVC × 10, Fluted × 5, WPC × 8</span>
                  </button>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-medium text-xs transition-colors"
                  >
                    <span>Explore Materials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-stone-700" />
                    <h2 className="text-sm font-semibold text-stone-900">
                      Selected Materials ({cart.length} {cart.length === 1 ? 'item' : 'items'} · {totalItems} total units)
                    </h2>
                  </div>
                  <button
                    onClick={clearCart}
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-200">
                  {cart.map(({ product, quantity }) => {
                    const imgSrc = resolveMaterialImage(product.image, product.category);
                    return (
                      <div
                        key={product.id}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-stone-50/60 transition-colors"
                      >
                        <Link
                          to={`/products/${product.id}`}
                          className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200"
                        >
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                            <span>{product.category}</span>
                            {product.sku && (
                              <>
                                <span>·</span>
                                <span className="font-mono">{product.sku}</span>
                              </>
                            )}
                          </div>
                          <Link
                            to={`/products/${product.id}`}
                            className="text-sm sm:text-base font-semibold text-stone-950 hover:text-amber-800 transition-colors block truncate"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-stone-600 tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}{' '}
                            <span className="text-stone-400">per {product.unit || 'Unit'}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <div className="inline-flex items-center rounded-lg border border-stone-300 bg-[#FAF9F6]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3.5 text-xs font-semibold text-stone-950 tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right min-w-[90px]">
                            <div className="text-sm font-semibold text-stone-950 tabular-nums">
                              ₹{(product.price * quantity).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[11px] text-stone-400">Est. value</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Bar */}
                <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs text-stone-600">
                    Indicative Reference Value (final project quote shared on WhatsApp)
                  </span>
                  <span className="text-base font-semibold text-stone-950 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* Project Context Details */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-950">
                  Project & Contact Context (Included in WhatsApp Message)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Optional details to help our team confirm stock availability and delivery timelines faster.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Name / Studio Name
                  </label>
                  <input
                    type="text"
                    value={enquiryDetails.customerName}
                    onChange={(e) =>
                      setEnquiryDetails((prev) => ({ ...prev, customerName: e.target.value }))
                    }
                    placeholder="e.g. Ar.ohan Verma / Skyline Interiors"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={enquiryDetails.customerPhone}
                    onChange={(e) =>
                      setEnquiryDetails((prev) => ({ ...prev, customerPhone: e.target.value }))
                    }
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Application / Space Type
                  </label>
                  <select
                    value={enquiryDetails.projectType}
                    onChange={(e) =>
                      setEnquiryDetails((prev) => ({ ...prev, projectType: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-stone-900"
                  >
                    {PROJECT_SPACES.map((space) => (
                      <option key={space} value={space}>
                        {space}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Delivery City / Notes
                  </label>
                  <input
                    type="text"
                    value={enquiryDetails.notes}
                    onChange={(e) =>
                      setEnquiryDetails((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="e.g. Site delivery in Nagpur / Kamptee Road, sample swatches needed"
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Pre-Formatted WhatsApp Message Preview & Action */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="bg-[#141413] text-stone-100 rounded-xl border border-stone-800 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#DF9E26]" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Pre-Formatted WhatsApp Enquiry
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Automatically generated from your selected materials & quantities
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live WhatsApp Message Bubble Preview */}
              <div className="bg-[#1E2420] border border-emerald-900/50 rounded-xl p-4 font-mono text-xs text-stone-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {formattedMessage}
              </div>

              {submittedBanner && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Enquiry logged and opened in WhatsApp. Our showroom team will respond with availability and pricing.
                  </span>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-stone-950" />
                  <span>Send Enquiry on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2.5 px-4 rounded-lg border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Formatted Message to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Message for Email / WhatsApp Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

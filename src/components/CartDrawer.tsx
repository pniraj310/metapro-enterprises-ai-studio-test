import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { resolveMaterialImage } from '../assets/materialImages';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ClipboardList,
  MessageSquare,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const PROJECT_SPACES = [
  'Living Spaces',
  'Office Interiors',
  'Commercial Spaces',
  'Ceiling & Wall Applications',
  'Full Interior Project',
];

export const CartDrawer: React.FC = () => {
  const {
    cart,
    addToCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    enquiryDetails,
    setEnquiryDetails,
    getFormattedWhatsAppMessage,
    getWhatsAppEnquiryUrl,
    recordEnquirySubmission,
  } = useCart();

  const { products } = useProducts();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showMessagePreview, setShowMessagePreview] = useState(true);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [enquirySentBanner, setEnquirySentBanner] = useState(false);

  if (!isCartDrawerOpen) return null;

  const formattedMessage = getFormattedWhatsAppMessage();
  const whatsappUrl = getWhatsAppEnquiryUrl();

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Fallback copy
    }
  };

  const handleSendWhatsApp = () => {
    recordEnquirySubmission();
    setEnquirySentBanner(true);
    setTimeout(() => setEnquirySentBanner(false), 5000);
  };

  const handleLoadSampleEnquiryBundle = () => {
    const pvc = products.find((p) => p.category === 'PVC Wall Panels') || products[1];
    const fluted = products.find((p) => p.category === 'Fluted Panels') || products[0];
    const wpc = products.find((p) => p.category === 'WPC Panels') || products[2];
    if (pvc) addToCart(pvc, 10);
    if (fluted) addToCart(fluted, 5);
    if (wpc) addToCart(wpc, 8);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-12">
        <div className="w-screen max-w-lg bg-[#FAF9F6] text-stone-900 flex flex-col shadow-2xl border-l border-stone-200">
          {/* Header */}
          <div className="bg-[#172337] text-white px-6 py-5 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF9F00]/20 border border-[#FF9F00]/40 flex items-center justify-center text-[#FF9F00]">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Material Enquiry List</span>
                  {cart.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF9F00] text-gray-950 font-bold text-xs">
                      {cart.length}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-400 tabular-nums">
                  {cart.length} {cart.length === 1 ? 'material' : 'materials'} · {totalItems} total units
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close Enquiry List"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-banner explaining Enquiry Flow */}
          <div className="bg-stone-100 border-b border-stone-200/80 px-6 py-2.5 flex items-center justify-between text-xs text-stone-600">
            <span>Select materials & quantities to generate your WhatsApp enquiry</span>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-stone-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
              >
                Clear List
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {enquirySentBanner && (
              <div className="p-3.5 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-800 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Enquiry logged and formatted for MetaPro WhatsApp desk.</span>
                </div>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="bg-white rounded-xl p-7 text-center border border-stone-200/90 my-4 space-y-5">
                <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-stone-900">
                    Your Enquiry List is Empty
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                    Add wall panels, ceiling tiles, or architectural hardware with your required quantities to send a consolidated enquiry on WhatsApp.
                  </p>
                </div>

                {/* Quick Sample Bundle matching specification */}
                <div className="pt-2 border-t border-stone-100 text-left bg-stone-50/80 rounded-lg p-4 space-y-2.5">
                  <div className="text-[11px] font-semibold text-stone-700 flex items-center justify-between">
                    <span>Sample Project Enquiry Bundle</span>
                    <span className="text-stone-400 font-normal">23 Panels</span>
                  </div>
                  <div className="text-xs text-stone-600 space-y-1 font-mono tabular-nums">
                    <div>• PVC Wall Panel × 10</div>
                    <div>• Fluted Panel × 5</div>
                    <div>• WPC Panel × 8</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSampleEnquiryBundle}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#DF9E26]" />
                    <span>Load Sample Project List</span>
                  </button>
                </div>

                <Link
                  to="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 hover:border-stone-900 text-stone-900 font-medium text-xs transition-colors"
                >
                  <span>Explore Materials Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                {/* Selected Material Items */}
                <div className="space-y-3">
                  {cart.map((item) => {
                    const imgSrc = resolveMaterialImage(item.product.image, item.product.category);
                    return (
                      <div
                        key={item.product.id}
                        className="bg-white rounded-xl p-4 border border-stone-200/90 flex gap-4 transition-colors hover:border-stone-300"
                      >
                        <img
                          src={imgSrc}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/products/${item.product.id}`}
                              onClick={() => setIsCartDrawerOpen(false)}
                              className="text-sm font-semibold text-stone-900 hover:text-amber-700 line-clamp-2 leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 text-stone-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                              title="Remove from Enquiry List"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                            <span>{item.product.category}</span>
                            {item.product.unit && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.product.unit}</span>
                              </>
                            )}
                          </div>

                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-xs text-stone-600 tabular-nums">
                              Indicative: <strong className="text-stone-900 font-semibold">₹{item.product.price.toLocaleString('en-IN')}</strong> / unit
                            </span>
                            <span className="text-xs font-semibold text-stone-900 tabular-nums">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Quantity Controls + Quick Multipliers */}
                          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                            <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-2.5 py-1 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="9999"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0) {
                                    updateQuantity(item.product.id, val);
                                  }
                                }}
                                className="w-12 text-center py-0.5 text-xs font-semibold text-stone-900 bg-white border-x border-stone-200 focus:outline-none tabular-nums"
                                aria-label="Material quantity"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-2.5 py-1 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Quick Preset Quantities */}
                            <div className="flex items-center gap-1">
                              {[5, 10, 25].map((presetQty) => (
                                <button
                                  key={presetQty}
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, presetQty)}
                                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer tabular-nums ${
                                    item.quantity === presetQty
                                      ? 'bg-stone-900 text-white'
                                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                                  }`}
                                >
                                  ×{presetQty}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Project & Customer Details Accordion */}
                <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(!showProjectForm)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <span>Add Project & Contact Context (Optional)</span>
                    {showProjectForm ? (
                      <ChevronUp className="w-4 h-4 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-500" />
                    )}
                  </button>

                  {showProjectForm && (
                    <div className="p-4 pt-2 border-t border-stone-100 space-y-3 bg-stone-50/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-stone-600 mb-1">
                            Your Name / Studio
                          </label>
                          <input
                            type="text"
                            value={enquiryDetails.customerName}
                            onChange={(e) =>
                              setEnquiryDetails((prev) => ({ ...prev, customerName: e.target.value }))
                            }
                            placeholder="e.g. Ar. Rahul Verma"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-stone-600 mb-1">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={enquiryDetails.customerPhone}
                            onChange={(e) =>
                              setEnquiryDetails((prev) => ({ ...prev, customerPhone: e.target.value }))
                            }
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 mb-1">
                          Application Space
                        </label>
                        <select
                          value={enquiryDetails.projectType}
                          onChange={(e) =>
                            setEnquiryDetails((prev) => ({ ...prev, projectType: e.target.value }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        >
                          {PROJECT_SPACES.map((space) => (
                            <option key={space} value={space}>
                              {space}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 mb-1">
                          Specific Dimensions, Finish or Site Notes
                        </label>
                        <textarea
                          rows={2}
                          value={enquiryDetails.notes}
                          onChange={(e) =>
                            setEnquiryDetails((prev) => ({ ...prev, notes: e.target.value }))
                          }
                          placeholder="e.g. Delivery required in Gurugram; need matching corner trims."
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pre-formatted WhatsApp Message Preview */}
                <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden">
                  <div className="px-4 py-2.5 bg-stone-100/80 border-b border-stone-200/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowMessagePreview(!showMessagePreview)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-600" />
                      <span>Pre-Formatted WhatsApp Message</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-stone-300 hover:border-stone-900 text-[11px] font-medium text-stone-800 transition-colors cursor-pointer"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                  {showMessagePreview && (
                    <pre className="p-4 text-[11px] leading-relaxed text-stone-700 font-mono whitespace-pre-wrap bg-stone-50/60 max-h-44 overflow-y-auto">
                      {formattedMessage}
                    </pre>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Primary WhatsApp Action */}
          {cart.length > 0 && (
            <div className="bg-white border-t border-stone-200 p-6 space-y-4">
              <div className="flex items-baseline justify-between text-sm">
                <div>
                  <span className="text-stone-500 text-xs block">Indicative Catalogue Estimate</span>
                  <span className="text-[11px] text-stone-400">
                    Final bulk / project pricing shared upon enquiry
                  </span>
                </div>
                <span className="text-lg font-semibold text-stone-900 tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Enquiry on WhatsApp ({totalItems} Units)</span>
                </a>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    to="/enquiry-list"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2874F0] hover:underline"
                  >
                    <span>Open Full Enquiry Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-600 font-medium cursor-pointer"
                  >
                    Clear List
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

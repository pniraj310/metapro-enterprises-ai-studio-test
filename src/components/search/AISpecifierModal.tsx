import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Calculator, 
  Wrench, 
  ShoppingCart, 
  MessageSquare, 
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  fetchAISpecifier, 
  AISpecifierResponse, 
  AISpecifierRecommendation 
} from '../../services/aiSearchService';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/product';

interface AISpecifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
}

const PRESET_CONTRACTOR_PROMPTS = [
  'Which screws to use for 12mm ceiling gypsum board to metal frame?',
  'Heavy anchor bolts for fixing 150kg AC outdoor compressor on brick wall',
  'Waterproof & termite-proof wall panels for modern bathroom redesign',
  'Charcoal fluted wall panel spacing and adhesive requirements for TV wall',
  'How many drywall screws needed for a 1,000 sq ft ceiling project?'
];

export const AISpecifierModal: React.FC<AISpecifierModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialCategory = 'All'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [specResult, setSpecResult] = useState<AISpecifierResponse | null>(null);
  const { products, whatsAppNumber } = useProducts();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  useEffect(() => {
    if (isOpen) {
      if (initialQuery.trim()) {
        setQuery(initialQuery);
        handleRunSpecifier(initialQuery, initialCategory);
      } else if (!specResult) {
        // Run default query
        handleRunSpecifier('Fastener & panel specification for interior drywall partitions', initialCategory);
      }
    }
  }, [isOpen, initialQuery]);

  const handleRunSpecifier = async (searchPrompt: string, categoryContext?: string) => {
    if (!searchPrompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetchAISpecifier(searchPrompt, categoryContext);
      setSpecResult(res);
    } catch (err) {
      console.error('Error in specifier:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRunSpecifier(query, initialCategory);
  };

  // Match AI recommended product names with actual catalog products
  const findMatchingProduct = (rec: AISpecifierRecommendation): Product | undefined => {
    const recLower = rec.productName.toLowerCase();
    return (
      products.find(p => p.name.toLowerCase().includes(recLower) || recLower.includes(p.name.toLowerCase())) ||
      products.find(p => p.category.toLowerCase() === rec.category.toLowerCase()) ||
      products[0]
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setIsCartDrawerOpen(true);
  };

  if (!isOpen) return null;

  const whatsappMessage = specResult
    ? `Hello MetaPro Technical Support, I used the AI Material Specifier for "${query}". Please review the recommended materials: ${specResult.recommendations.map(r => r.productName).join(', ')}. Can you confirm current batch pricing and freight delivery?`
    : `Hello MetaPro, I need contractor advice for: "${query}".`;

  const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#0B1528] via-[#152238] to-[#0B1528] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#DF9E26]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#DF9E26] to-[#F3B544] flex items-center justify-center text-[#0B1528] shadow-md shadow-[#DF9E26]/20">
              <Sparkles className="w-5 h-5 fill-[#0B1528]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  MetaPro AI Material Specifier & Estimator
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DF9E26]/20 text-[#DF9E26] border border-[#DF9E26]/40">
                  <Zap className="w-3 h-3" />
                  Gemini Flash 3.8
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Architectural specification, load analysis, and quantity estimation powered by AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH INPUT BAR */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any material question (e.g. 'Fasteners for 500 sq ft ceiling' or 'Waterproof wall panels')..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26] shadow-2xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#DF9E26] hover:bg-[#cf8e18] text-[#0B1528] font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Analyze</span>
            </button>
          </form>

          {/* Preset Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1 scrollbar-thin">
            <span className="text-slate-400 font-bold shrink-0">Popular Contractor Questions:</span>
            {PRESET_CONTRACTOR_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  handleRunSpecifier(prompt);
                }}
                className="px-2.5 py-1 bg-white hover:bg-[#DF9E26]/10 text-slate-700 hover:text-[#0B1528] border border-slate-200 hover:border-[#DF9E26] rounded-lg shrink-0 font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#DF9E26]/20 border-t-[#DF9E26] rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  MetaPro AI is analyzing specifications & load requirements...
                </p>
                <p className="text-xs text-slate-500">
                  Cross-referencing tensile parameters, substrate compatibility, and MetaPro catalog items
                </p>
              </div>
            </div>
          )}

          {!loading && specResult && (
            <div className="space-y-6">

              {/* AI Understanding Callout */}
              <div className="bg-amber-50/70 border border-[#DF9E26]/40 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DF9E26]/20 flex items-center justify-center text-[#DF9E26] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0B1528]">
                    AI Engineering Summary
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {specResult.understanding}
                  </p>
                </div>
              </div>

              {/* Recommended Products from Catalog */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#DF9E26]" />
                    <h4 className="text-xs sm:text-sm font-black text-[#0B1528] uppercase tracking-wider">
                      Recommended Materials for this Specification
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified MetaPro Catalog Items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specResult.recommendations.map((rec, idx) => {
                    const matchedProduct = findMatchingProduct(rec);
                    return (
                      <div 
                        key={idx}
                        className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#DF9E26] transition-all shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {rec.category}
                            </span>
                            <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Best Fit
                            </span>
                          </div>

                          <div className="flex gap-3 items-center">
                            {matchedProduct && (
                              <img
                                src={matchedProduct.image}
                                alt={matchedProduct.name}
                                className="w-16 h-16 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0"
                              />
                            )}
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                                {matchedProduct ? matchedProduct.name : rec.productName}
                              </h5>
                              {matchedProduct && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm font-black text-slate-900">
                                    ₹{matchedProduct.price.toLocaleString('en-IN')}
                                  </span>
                                  {matchedProduct.originalPrice && (
                                    <span className="text-[11px] text-slate-400 line-through">
                                      ₹{matchedProduct.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong>Why Recommended:</strong> {rec.whyRecommended}
                          </p>

                          {rec.keySpec && (
                            <div className="text-[11px] text-slate-700 bg-amber-50/50 p-2 rounded border border-amber-100 font-mono">
                              <strong>Key Dimension/Spec:</strong> {rec.keySpec}
                            </div>
                          )}

                          {rec.estimatedQuantityRule && (
                            <div className="text-[11px] text-blue-900 bg-blue-50/70 p-2 rounded border border-blue-100 flex items-start gap-1.5">
                              <Calculator className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">Estimation Formula:</span>
                                <span>{rec.estimatedQuantityRule}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          {matchedProduct ? (
                            <>
                              <button
                                onClick={() => handleAddToCart(matchedProduct)}
                                className="flex-1 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </button>
                              <Link
                                to={`/products/${matchedProduct.id}`}
                                onClick={onClose}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                              >
                                <span>Specs</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </>
                          ) : (
                            <Link
                              to={`/products?search=${encodeURIComponent(rec.productName)}`}
                              onClick={onClose}
                              className="w-full py-2 bg-[#0B1528] text-white font-bold text-xs rounded-lg text-center"
                            >
                              Search in Store
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technical Advice & Field Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B1528]">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Structural & Substrate Engineering Consideration</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {specResult.technicalAdvice}
                  </p>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Wrench className="w-4 h-4 text-emerald-700" />
                    <span>Contractor Field Installation Tip</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {specResult.proInstallationTip}
                  </p>
                </div>
              </div>

              {/* Follow-up Questions */}
              {specResult.followUpSuggestions && specResult.followUpSuggestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    Contractor Follow-Up Inquiries
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {specResult.followUpSuggestions.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(sq);
                          handleRunSpecifier(sq);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#DF9E26]/10 text-slate-700 hover:text-[#0B1528] border border-slate-200 hover:border-[#DF9E26] text-xs font-medium transition-colors text-left flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-[#DF9E26]" />
                        <span>{sq}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Need customized batch manufacturing or jobsite load test reports?
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Spec to WhatsApp Dispatch</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

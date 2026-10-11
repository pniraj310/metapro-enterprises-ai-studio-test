import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { aiChatService, ChatMessage } from '../../services/aiChatService';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  RefreshCw, 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

const INITIAL_QUICK_QUESTIONS = [
  'Which screws for 12mm gypsum drywall?',
  'Heavy anchor bolts for AC outdoor frames',
  'What wall panels are 100% waterproof?',
  'How many drywall screws per 8x4 board?',
  'Delivery timeframe & Cash on Delivery'
];

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { products } = useProducts();
  const { addToCart } = useCart();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect if user is currently on a product detail page
  const currentProductId = location.pathname.startsWith('/products/')
    ? location.pathname.split('/products/')[1]
    : location.pathname.startsWith('/product/')
    ? location.pathname.split('/product/')[1]
    : undefined;

  const currentProduct = currentProductId 
    ? products.find(p => p.id === currentProductId) 
    : undefined;

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I am **MetaPro AI Support Specialist**.\n\nI can help you specify the right screw gauges, concrete expansion anchors, wall panel quantities, and site delivery details based on our real-time inventory.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: INITIAL_QUICK_QUESTIONS.slice(0, 3),
      isLive: true
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Build history
      const history = messages.slice(-5).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text
      }));

      // Pass compact catalog context
      const catalogContext = products.slice(0, 20).map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        specifications: p.specifications,
        availability: p.availability
      }));

      const response = await aiChatService.sendMessage({
        message: query,
        history,
        catalogContext,
        currentProductId: currentProduct?.id
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: response.suggestedProductIds,
        quickReplies: response.quickReplies,
        isLive: response.isAiLive ?? true
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Support chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble connecting right now, but you can also reach our engineering sales desk on WhatsApp at +91 98765 43210 for immediate product specifications.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: INITIAL_QUICK_QUESTIONS.slice(0, 2)
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestionTap = (question: string) => {
    handleSendMessage(question);
  };

  const handleAddToCartFromChat = (product: any) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "Conversation refreshed. How can MetaPro AI assist your construction or interior project today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: INITIAL_QUICK_QUESTIONS.slice(0, 3),
        isLive: true
      }
    ]);
  };

  // Helper to render formatted markdown
  const renderFormattedText = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const bulletContent = line.replace(/^[•\-]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed my-0.5">
            {formatBold(bulletContent)}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-1">
          {formatBold(line)}
        </p>
      );
    });
  };

  const formatBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-[#0B1528] via-[#152238] to-[#0B1528] text-white py-3 px-4 sm:px-5 rounded-full shadow-2xl border border-[#DF9E26]/50 hover:border-[#DF9E26] hover:shadow-[#DF9E26]/20 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Open MetaPro AI Customer Support"
          >
            {/* Live pulsing indicator */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#DF9E26] text-[#0B1528] flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4 fill-[#0B1528]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0B1528] rounded-full animate-pulse"></span>
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-[#DF9E26] transition-colors">
                  MetaPro AI Support
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#DF9E26]/20 text-[#DF9E26]">
                  Live
                </span>
              </div>
              <span className="text-[10px] text-slate-300 block">
                Ask product specs & load guides
              </span>
            </div>

            <span className="sm:hidden text-xs font-bold text-white">
              AI Support
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-2rem)] bg-[#eaeded] rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#0B1528] text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DF9E26] to-[#f7b731] text-[#0B1528] flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 fill-[#0B1528]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0B1528] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white leading-none">MetaPro AI Specialist</h3>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#DF9E26]/20 text-[#DF9E26] border border-[#DF9E26]/40">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>Online • Connected to Live Catalog</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Close AI support chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Product Context Bar (If user is viewing a product page) */}
          {currentProduct && (
            <div className="bg-[#152238] border-b border-slate-800 px-3.5 py-2 flex items-center justify-between text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#DF9E26] font-bold shrink-0">Viewing:</span>
                <span className="truncate text-white font-medium">{currentProduct.name}</span>
              </div>
              <button
                onClick={() => handleQuickQuestionTap(`Tell me technical specs, installation tips, and substrate compatibility for "${currentProduct.name}"`)}
                className="text-[11px] font-bold text-[#DF9E26] hover:text-white bg-[#DF9E26]/20 px-2 py-0.5 rounded border border-[#DF9E26]/30 shrink-0 cursor-pointer ml-2 hover:bg-[#DF9E26]/30 transition-colors"
              >
                Ask Specs
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f6f8fa]">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  {/* Bubble */}
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-xs transition-all ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                        : 'bg-[#0B1528] text-white rounded-tr-xs shadow-md'
                    }`}
                  >
                    {isAssistant ? (
                      <div>
                        {renderFormattedText(msg.text)}

                        {/* Inline Product Cards Recommendation (From ProductContext) */}
                        {msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Recommended MetaPro Materials:
                            </span>
                            {msg.suggestedProductIds.map((pid) => {
                              const p = products.find(prod => prod.id === pid);
                              if (!p) return null;
                              return (
                                <div 
                                  key={p.id}
                                  className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2.5 hover:border-slate-300 transition-all"
                                >
                                  <Link
                                    to={`/products/${p.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden"
                                  >
                                    <img 
                                      src={p.image} 
                                      alt={p.name} 
                                      className="max-h-full max-w-full object-contain" 
                                    />
                                  </Link>

                                  <div className="flex-1 min-w-0">
                                    <Link
                                      to={`/products/${p.id}`}
                                      onClick={() => setIsOpen(false)}
                                      className="font-bold text-slate-900 truncate block hover:text-[#007185] transition-colors leading-tight"
                                      title={p.name}
                                    >
                                      {p.name}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="font-black text-slate-900">
                                        ₹{p.price.toLocaleString('en-IN')}
                                      </span>
                                      {p.originalPrice && (
                                        <span className="text-[10px] text-slate-400 line-through">
                                          ₹{p.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleAddToCartFromChat(p)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                                      addedProductId === p.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111]'
                                    }`}
                                  >
                                    {addedProductId === p.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Added</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* One-Tap Quick Replies for this assistant answer */}
                  {isAssistant && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                      {msg.quickReplies.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleQuickQuestionTap(qr)}
                          disabled={loading}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-[11px] font-medium transition-colors shadow-2xs cursor-pointer text-left active:scale-98 disabled:opacity-50"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading typing bubble */}
            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-28 text-slate-500 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#DF9E26] animate-spin" />
                <span className="text-xs font-semibold">Analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Action Topic Bar (Easy Tap Pills at bottom) */}
          <div className="bg-white px-3 py-1.5 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
              Quick:
            </span>
            {INITIAL_QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestionTap(q)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#DF9E26]/15 hover:text-[#0B1528] text-slate-700 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about screws, anchor loads, panel specs..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DF9E26] focus:border-transparent bg-slate-50/50"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="w-10 h-10 rounded-xl bg-[#0B1528] hover:bg-[#152238] disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

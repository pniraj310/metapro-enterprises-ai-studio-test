import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ExternalLink, 
  MessageSquare, 
  Copy, 
  Check, 
  RefreshCw, 
  Receipt, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  X,
  FileText
} from 'lucide-react';
import { Order } from '../../types/product';
import { CustomerUser } from '../../types/customer';
import { useCart } from '../../context/CartContext';
import { springBootApi, USE_SPRING_BOOT_API } from '../../services/api';

interface OrderHistoryProps {
  customerUser?: CustomerUser | null;
  whatsAppNumber: string;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ 
  customerUser, 
  whatsAppNumber 
}) => {
  const { recentOrders, addToCart, setIsCartDrawerOpen, showToast } = useCart();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered' | 'cod'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high'>('newest');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Invoice modal state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Fetch orders from API or LocalStorage/CartContext
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      if (USE_SPRING_BOOT_API) {
        try {
          const apiOrders = await springBootApi.orders.getCustomerOrders();
          if (Array.isArray(apiOrders) && apiOrders.length > 0) {
            setOrders(apiOrders);
            setIsLoading(false);
            return;
          }
        } catch (apiErr) {
          console.warn('API getCustomerOrders fallback to local storage', apiErr);
        }
      }

      // Check local storage / CartContext
      const stored = localStorage.getItem('metapro_orders_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to recentOrders from CartContext
      setOrders(recentOrders);
    } catch (err) {
      console.error('Error fetching order history', err);
      setOrders(recentOrders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [recentOrders]);

  // Copy Order ID
  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    showToast(`Order ID #${orderId} copied to clipboard`);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  // Reorder single product
  const handleBuyAgain = (product: any, quantity: number) => {
    addToCart(product, quantity);
    setIsCartDrawerOpen(true);
  };

  // Reorder all items in order
  const handleReorderAll = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    showToast(`Added all ${order.items.length} items from Order #${order.id} to cart!`);
    setIsCartDrawerOpen(true);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by customer if email or phone matches, otherwise keep demo/active orders
    if (customerUser) {
      const userEmail = customerUser.email?.toLowerCase().trim();
      const userPhone = customerUser.phone?.replace(/\D/g, '');

      // If user has orders specific to them, prefer them, or show all saved demo orders
      const userSpecific = result.filter(order => {
        const orderEmail = order.customer.email?.toLowerCase().trim();
        const orderPhone = order.customer.phone?.replace(/\D/g, '');
        return (userEmail && orderEmail === userEmail) || (userPhone && orderPhone?.includes(userPhone));
      });

      if (userSpecific.length > 0) {
        result = userSpecific;
      }
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter(o => ['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery'].includes(o.status));
    } else if (statusFilter === 'delivered') {
      result = result.filter(o => o.status === 'Delivered');
    } else if (statusFilter === 'cod') {
      result = result.filter(o => o.customer.paymentMethod === 'cod');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.trackingDocket?.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.pincode.includes(q) ||
        o.items.some(item => item.product.name.toLowerCase().includes(q) || item.product.category.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'amount_high') {
        return b.totalAmount - a.totalAmount;
      }
      return 0;
    });

    return result;
  }, [orders, customerUser, statusFilter, searchQuery, sortBy]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Dispatched</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Processing at Hub</span>
          </span>
        );
      case 'Confirmed':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Package className="w-3.5 h-3.5 text-sky-600" />
            <span>Order Confirmed</span>
          </span>
        );
    }
  };

  const getStepProgress = (status: Order['status']) => {
    const steps = ['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(status);
    return Math.max(0, currentStepIndex);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Fast Track Header */}
      <div className="bg-gradient-to-r from-[#0B1528] via-[#101e38] to-[#1c2c4d] rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#DF9E26]/20 border border-[#DF9E26]/40 flex items-center justify-center text-[#DF9E26] shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight">Order History & Jobsite Consignments</h3>
              <span className="bg-white/10 text-slate-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/15">
                {orders.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Review past shipments, download B2B GST tax invoices, and track live carrier milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl transition-colors cursor-pointer border border-white/15 text-xs flex items-center gap-1.5"
            title="Refresh order history"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#DF9E26]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/track-order"
            className="px-4 py-2.5 bg-[#DF9E26] hover:bg-[#cf8e18] text-[#0B1528] font-black text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Any Order ID</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, product title, category, or tracking docket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DF9E26] bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#DF9E26]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Amount</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Filter:</span>
          </span>

          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { 
              id: 'active', 
              label: `Active / In-Transit (${orders.filter(o => ['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery'].includes(o.status)).length})` 
            },
            { 
              id: 'delivered', 
              label: `Delivered (${orders.filter(o => o.status === 'Delivered').length})` 
            },
            { 
              id: 'cod', 
              label: `Cash on Delivery (${orders.filter(o => o.customer.paymentMethod === 'cod').length})` 
            },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#0B1528] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Empty State */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <RefreshCw className="w-8 h-8 text-[#DF9E26] animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading your past orders...</p>
          <p className="text-xs text-slate-500">Fetching order history, dispatch statuses, and line items</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {searchQuery || statusFilter !== 'all' ? 'No orders match your search criteria' : 'No orders found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try clearing the search query or changing the filter to see other orders.' 
                : 'Browse our catalog of drywall screws, mechanical anchor bolts, and PVC wall panels to place your first wholesale order.'}
            </p>
          </div>
          {searchQuery || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Browse Catalog & Start Ordering
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const stepIndex = getStepProgress(order.status);
            const isExpanded = expandedOrderId === order.id;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const whatsappTrackerUrl = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
              `Hello MetaPro, inquiring about status of Order #${order.id} for ${order.customer.fullName}.`
            )}`;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
              >
                {/* Order Top Bar (Amazon Style) */}
                <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block font-bold">Order Placed</span>
                      <span className="font-bold text-slate-900">{formattedDate}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block font-bold">Total Amount</span>
                      <span className="font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase text-[10px] block font-bold">Ship To</span>
                      <span className="font-bold text-slate-800" title={order.customer.streetAddress}>
                        {order.customer.fullName} ({order.customer.pincode})
                      </span>
                    </div>
                  </div>

                  {/* Order ID with Copy Badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <span className="text-slate-500 uppercase text-[10px] font-bold">Order:</span>
                      <span className="font-mono font-black text-slate-800">{order.id}</span>
                      <button
                        onClick={() => handleCopyOrderId(order.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedOrderId === order.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Invoice Button */}
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="View Tax Invoice"
                    >
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <div className="text-xs text-slate-600">
                        {order.estimatedDelivery ? (
                          <span>Estimated Arrival: <strong className="text-slate-900">{order.estimatedDelivery}</strong></span>
                        ) : (
                          <span>Standard 24-48hr Site Transit</span>
                        )}
                        {order.trackingDocket && (
                          <span className="hidden sm:inline text-slate-400 font-mono ml-2">
                            • Docket: {order.trackingDocket}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Badge */}
                    <div className="flex items-center gap-2">
                      {order.customer.paymentMethod === 'razorpay' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0B67C2] border border-blue-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0B67C2]" />
                          <span>Prepaid Online (Razorpay)</span>
                        </span>
                      ) : order.customer.paymentMethod === 'cod' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span>Cash on Site Delivery (COD)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span>Direct Purchase Order</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delivery Timeline Graphic */}
                  <div className="hidden sm:block py-2">
                    <div className="relative flex items-center justify-between">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0" />
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#DF9E26] z-0 transition-all duration-500" 
                        style={{ width: `${(stepIndex / 4) * 100}%` }}
                      />

                      {['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                        const isCompleted = idx <= stepIndex;
                        const isCurrent = idx === stepIndex;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                isCompleted 
                                  ? 'bg-[#DF9E26] text-[#0B1528] ring-4 ring-amber-100' 
                                  : 'bg-slate-200 text-slate-500'
                              } ${isCurrent ? 'animate-pulse' : ''}`}
                            >
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] font-bold mt-1 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-3 pt-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#DF9E26]" />
                      <span>Purchased Items ({order.items.length})</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0"
                            />
                            <div className="space-y-1 min-w-0">
                              <Link
                                to={`/products/${item.product.id}`}
                                className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#007185] transition-colors block line-clamp-2"
                              >
                                {item.product.name}
                              </Link>
                              
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                                  {item.product.category}
                                </span>
                                <span>•</span>
                                <span>Qty: <strong className="text-slate-800 font-bold">{item.quantity}</strong></span>
                                <span>•</span>
                                <span>Unit: ₹{item.product.price.toLocaleString('en-IN')}</span>
                              </div>

                              {item.product.specifications && item.product.specifications.length > 0 && (
                                <p className="text-[11px] text-slate-400">
                                  {item.product.specifications[0].label}: {item.product.specifications[0].value}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Line Item Total & Buy Again Button */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                            <span className="font-black text-sm text-slate-900">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => handleBuyAgain(item.product, item.quantity)}
                              className="px-3 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Buy Again</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination & Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-600 space-y-0.5">
                      <div>
                        Jobsite Destination: <strong className="text-slate-900">{order.customer.streetAddress}, {order.customer.city}, {order.customer.state} ({order.customer.pincode})</strong>
                      </div>
                      {order.courierPartner && (
                        <div className="text-slate-500 text-[11px]">
                          Carrier: {order.courierPartner}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/track-order?id=${order.id}`}
                        className="px-4 py-2 rounded-xl bg-[#0B1528] hover:bg-[#152238] text-[#DF9E26] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Consignment</span>
                      </Link>

                      <a
                        href={whatsappTrackerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Updates</span>
                      </a>

                      <button
                        onClick={() => handleReorderAll(order)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Reorder all items in this order"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
                        <span>Reorder All</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: B2B GST TAX INVOICE PREVIEW */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0B1528] px-6 py-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#DF9E26]" />
                <div>
                  <h3 className="font-bold text-sm">Tax Invoice / Delivery Challan</h3>
                  <p className="text-[11px] text-slate-300 font-mono">Invoice #{selectedInvoiceOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Printable Invoice Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
              
              {/* Company & Bill To */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h4 className="font-black text-sm text-[#0B1528]">METAPRO ENTERPRISES</h4>
                  <p className="text-slate-500 mt-0.5">Central Industrial Logistics Hub</p>
                  <p className="text-slate-500">Fasteners, Mechanical Anchors & Wall Cladding</p>
                  <p className="font-mono text-slate-700 font-bold mt-1">GSTIN: 07AABCM8921P1Z4</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To Customer</span>
                  <p className="font-bold text-slate-900">{selectedInvoiceOrder.customer.fullName}</p>
                  {selectedInvoiceOrder.customer.companyName && (
                    <p className="font-medium text-slate-700">{selectedInvoiceOrder.customer.companyName}</p>
                  )}
                  <p className="text-slate-500">{selectedInvoiceOrder.customer.streetAddress}</p>
                  <p className="text-slate-500">{selectedInvoiceOrder.customer.city}, {selectedInvoiceOrder.customer.state} - {selectedInvoiceOrder.customer.pincode}</p>
                  {selectedInvoiceOrder.customer.gstin && (
                    <p className="font-mono text-[#0B1528] font-bold mt-1">
                      Customer GSTIN: {selectedInvoiceOrder.customer.gstin}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-500 font-bold">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoiceOrder.items.map((item, idx) => (
                      <tr key={idx} className="py-2">
                        <td className="py-2 pr-2">
                          <p className="font-bold text-slate-900">{item.product.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">Category: {item.product.category}</span>
                        </td>
                        <td className="py-2 text-center font-bold">{item.quantity}</td>
                        <td className="py-2 text-right font-mono">₹{item.product.price.toLocaleString('en-IN')}</td>
                        <td className="py-2 text-right font-bold font-mono">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations */}
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <div className="w-64 space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono font-medium">
                      ₹{Math.round(selectedInvoiceOrder.totalAmount / 1.18).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>IGST / CGST+SGST (18% ITC):</span>
                    <span className="font-mono font-medium">
                      ₹{Math.round(selectedInvoiceOrder.totalAmount - (selectedInvoiceOrder.totalAmount / 1.18)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Transit & Jobsite Delivery:</span>
                    <span className="font-mono text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{selectedInvoiceOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  This is a computer-generated tax invoice valid under Section 31 of CGST Act. Eligible for 100% Input Tax Credit (ITC) for registered businesses.
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
              
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

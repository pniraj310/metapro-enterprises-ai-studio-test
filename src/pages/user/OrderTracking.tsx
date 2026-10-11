import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { MetaProLogo } from '../../components/MetaProLogo';
import { Order } from '../../types/product';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Printer, 
  RotateCcw, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  ChevronRight,
  Building2,
  Calendar,
  Layers,
  ShoppingBag
} from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const { orderId: paramOrderId } = useParams<{ orderId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryOrderId = searchParams.get('id');

  const { customerUser, isCustomerLoggedIn, openAuthModal } = useCustomerAuth();
  const { recentOrders, getOrderById, addToCart, setIsCartDrawerOpen } = useCart();
  const { whatsAppNumber } = useProducts();
  const navigate = useNavigate();

  // Active searched order ID
  const initialId = paramOrderId || queryOrderId || (recentOrders.length > 0 ? recentOrders[0].id : '');
  const [searchOrderId, setSearchOrderId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Load order whenever searchOrderId or recentOrders change
  useEffect(() => {
    const targetId = paramOrderId || queryOrderId || searchOrderId;
    if (targetId) {
      const found = getOrderById(targetId);
      if (found) {
        setActiveOrder(found);
        setSearchOrderId(found.id);
      } else {
        // Fallback: check recent orders
        const fallback = recentOrders.find((o) => o.id.toLowerCase() === targetId.toLowerCase());
        setActiveOrder(fallback || null);
      }
    } else if (recentOrders.length > 0) {
      setActiveOrder(recentOrders[0]);
      setSearchOrderId(recentOrders[0].id);
    }
  }, [paramOrderId, queryOrderId, recentOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderId.trim()) return;
    setSearchAttempted(true);
    const found = getOrderById(searchOrderId.trim());
    if (found) {
      setActiveOrder(found);
      setSearchParams({ id: found.id });
    } else {
      setActiveOrder(null);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setActiveOrder(order);
    setSearchOrderId(order.id);
    setSearchParams({ id: order.id });
  };

  const handleCopyOrderId = (idToCopy: string) => {
    navigator.clipboard?.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleReorder = () => {
    if (!activeOrder) return;
    activeOrder.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    setIsCartDrawerOpen(true);
  };

  // If user is not logged in, prompt sign in or direct Order ID lookup
  if (!isCustomerLoggedIn && !activeOrder) {
    return (
      <div className="min-h-[75vh] bg-[#eaeded] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 max-w-lg w-full text-center space-y-6">
          <div className="flex justify-center">
            <MetaProLogo variant="full" theme="light" size="lg" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DF9E26]/15 text-[#0B1528] text-xs font-bold">
              <Truck className="w-3.5 h-3.5 text-[#DF9E26]" />
              <span>Real-Time Logistics Tracker</span>
            </div>
            <h1 className="text-2xl font-black text-[#0B1528] tracking-tight">
              Track Your Order & Purchase History
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sign in with your MetaPro account to view all past orders, jobsite delivery timelines, and download official GST tax invoices.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal('account', 'Sign in to access your purchase history and live order tracking.')}
              className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Sign in to View Order History
            </button>

            {/* Quick guest lookup by Order ID */}
            <div className="pt-4 border-t border-slate-200 text-left">
              <span className="block text-xs font-bold text-slate-700 mb-2">
                Have an Order ID from WhatsApp or SMS?
              </span>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. MP-ORD-942180-618"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="flex-1 text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#DF9E26]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#0B1528] text-white text-xs font-bold rounded-lg hover:bg-[#152238] transition-colors"
                >
                  Track
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tracking Stages calculation
  const stages = [
    {
      key: 'Confirmed',
      label: 'Order Confirmed',
      sublabel: 'Payment verified & order logged',
      description: 'Your purchase order has been confirmed and transferred to the MetaPro Central Warehouse.',
      icon: CheckCircle2,
    },
    {
      key: 'Processing',
      label: 'Processing & Packaging',
      sublabel: 'Batch quality inspection passed',
      description: 'Materials calibrated, packed, and palletized for jobsite logistics.',
      icon: Package,
    },
    {
      key: 'Dispatched',
      label: 'Dispatched in Transit',
      sublabel: 'Handed over to freight carrier',
      description: 'Consignment departed from central logistics hub. Tracking docket activated.',
      icon: Truck,
    },
    {
      key: 'Out for Delivery',
      label: 'Out for Delivery',
      sublabel: 'Arriving at recipient pincode',
      description: 'Last-mile logistics vehicle is dispatched to the contractor site or delivery address.',
      icon: MapPin,
    },
    {
      key: 'Delivered',
      label: 'Delivered to Site',
      sublabel: 'Signed and completed',
      description: 'Package delivered and received at destination address.',
      icon: ShieldCheck,
    },
  ];

  const getStageIndex = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed': return 0;
      case 'Processing': return 1;
      case 'Dispatched': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.status) : 0;
  const progressPercent = Math.min(100, Math.round(((currentStageIndex) / (stages.length - 1)) * 100));

  // WhatsApp support message
  const whatsappUrl = activeOrder 
    ? `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
        `Hello MetaPro Logistics Team, I am inquiring about my Order ID: ${activeOrder.id} (${activeOrder.items.length} items, Total: ₹${activeOrder.totalAmount.toLocaleString('en-IN')}). Current status shows ${activeOrder.status}. Please share updated dispatch ETA.`
      )}`
    : `https://wa.me/${whatsAppNumber}?text=Hello%20MetaPro,%20I%20have%20an%20order%20inquiry.`;

  return (
    <div className="w-full bg-[#eaeded] min-h-screen py-8 font-sans">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="hover:text-[#007185] hover:underline">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/account" className="hover:text-[#007185] hover:underline">Your Account</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-bold">Track Shipment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
              Order Tracking & Purchase History
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/account"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to Account</span>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-xl text-xs font-bold text-[#0F1111] shadow-2xs transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order More Products</span>
            </Link>
          </div>
        </div>

        {/* Search Bar & Order Switcher Strip */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Order ID to track (e.g. MP-ORD-942180-618)"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#DF9E26]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0B1528] hover:bg-[#152238] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Search Order
            </button>
          </form>

          {/* Quick Order Selector Pills from Purchase History */}
          {recentOrders.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
              <span className="text-slate-400 font-bold shrink-0">Your Recent Orders:</span>
              {recentOrders.map((ord) => {
                const isSelected = activeOrder?.id === ord.id;
                return (
                  <button
                    key={ord.id}
                    onClick={() => handleSelectOrder(ord)}
                    className={`px-3 py-1.5 rounded-lg font-bold shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0B1528] text-[#DF9E26] shadow-xs ring-2 ring-[#DF9E26]/40'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{ord.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Dispatched' || ord.status === 'Out for Delivery'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* NOT FOUND ALERT */}
        {!activeOrder && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Order ID Not Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                We couldn't locate an order matching "<strong>{searchOrderId}</strong>". Please verify the ID or choose one from your purchase history above.
              </p>
            </div>
            {recentOrders.length > 0 && (
              <button
                onClick={() => handleSelectOrder(recentOrders[0])}
                className="px-4 py-2 bg-[#FFD814] text-[#0F1111] font-bold text-xs rounded-xl shadow-xs"
              >
                View Latest Order ({recentOrders[0].id})
              </button>
            )}
          </div>
        )}

        {/* ACTIVE ORDER TRACKING CONTENT */}
        {activeOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT / MAIN COLUMN: Tracking Stepper + Package Items (Col 8) */}
            <div className="lg:col-span-8 space-y-6">

              {/* Status Header Banner */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Order ID:</span>
                      <span className="text-base sm:text-lg font-black text-[#0B1528] tracking-tight">
                        {activeOrder.id}
                      </span>
                      <button
                        onClick={() => handleCopyOrderId(activeOrder.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Placed on: {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span>Total: <strong>₹{activeOrder.totalAmount.toLocaleString('en-IN')}</strong></span>
                      <span>•</span>
                      <span>Items: <strong>{activeOrder.items.reduce((s, i) => s + i.quantity, 0)} units</strong></span>
                    </div>
                  </div>

                  {/* Current Status Pill */}
                  <div className="self-start sm:self-auto flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase shadow-2xs ${
                      activeOrder.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : activeOrder.status === 'Dispatched' || activeOrder.status === 'Out for Delivery'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {activeOrder.status}
                    </span>
                  </div>
                </div>

                {/* Estimated Delivery Highlight Box */}
                <div className="bg-gradient-to-r from-slate-900 to-[#0B1528] text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#DF9E26] block">
                      Estimated Site Arrival
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      {activeOrder.estimatedDelivery || 'Tomorrow by 2:00 PM'}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Destination PIN: <strong className="text-white">{activeOrder.customer.pincode}</strong> ({activeOrder.customer.city}, {activeOrder.customer.state})
                    </p>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-start sm:items-end justify-between gap-1 text-xs text-slate-300">
                    <span className="text-[11px] text-slate-400">Carrier Partner</span>
                    <span className="font-bold text-white text-right">
                      {activeOrder.courierPartner || 'MetaPro Express Logistics'}
                    </span>
                    <span className="text-[11px] text-[#DF9E26]">
                      Docket: {activeOrder.trackingDocket || 'MP-EXP-7729104'}
                    </span>
                  </div>
                </div>

                {/* 5-STAGE VISUAL TRACKING STEPPER */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
                    Shipment Progress Timeline
                  </h4>

                  {/* Horizontal Stepper for Desktop */}
                  <div className="relative">
                    {/* Background track */}
                    <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
                      <div 
                        className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Stepper items */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                      {stages.map((stage, idx) => {
                        const Icon = stage.icon;
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isUpcoming = idx > currentStageIndex;

                        return (
                          <div key={stage.key} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 text-left sm:text-center">
                            {/* Step Circle */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isCompleted 
                                ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                                : isCurrent
                                ? 'bg-[#0B1528] text-[#DF9E26] shadow-md ring-4 ring-[#DF9E26]/30 animate-pulse'
                                : 'bg-slate-100 text-slate-400 border border-slate-300'
                            }`}>
                              {isCompleted ? (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>

                            {/* Step Text */}
                            <div className="space-y-0.5">
                              <h5 className={`text-xs font-bold ${
                                isCurrent 
                                  ? 'text-[#0B1528] font-black' 
                                  : isCompleted 
                                  ? 'text-slate-800' 
                                  : 'text-slate-400'
                              }`}>
                                {stage.label}
                              </h5>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                {stage.sublabel}
                              </p>
                              {isCurrent && (
                                <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Current Status
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Package Items Breakdown Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#DF9E26]" />
                    <h3 className="text-sm font-bold text-[#0B1528] uppercase tracking-wider">
                      Items in this Consignment ({activeOrder.items.length})
                    </h3>
                  </div>
                  <button
                    onClick={handleReorder}
                    className="text-xs text-[#007185] hover:text-[#c7511f] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder All Items</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl border border-slate-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="space-y-1 max-w-md">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#DF9E26]">
                            {item.product.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            <Link to={`/products/${item.product.id}`} className="hover:text-[#007185] hover:underline">
                              {item.product.name}
                            </Link>
                          </h4>
                          <div className="text-xs text-slate-500">
                            Qty: <strong className="text-slate-800">{item.quantity}</strong> × ₹{item.product.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-black text-slate-900 block">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <Link
                          to={`/products/${item.product.id}`}
                          className="text-[11px] text-[#007185] hover:underline font-bold mt-1 inline-block"
                        >
                          View Item
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Shipment Details, Address, Invoicing & Actions (Col 4) */}
            <div className="lg:col-span-4 space-y-6">

              {/* Delivery Address Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-[#DF9E26]" />
                  <h3 className="text-xs font-bold text-[#0B1528] uppercase tracking-wider">
                    Jobsite Delivery Address
                  </h3>
                </div>

                <div className="text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 text-sm">
                    {activeOrder.customer.fullName}
                  </div>
                  {activeOrder.customer.companyName && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{activeOrder.customer.companyName}</span>
                    </div>
                  )}
                  <p className="text-slate-600 leading-relaxed">
                    {activeOrder.customer.streetAddress},<br />
                    {activeOrder.customer.city}, {activeOrder.customer.state} — <strong>{activeOrder.customer.pincode}</strong>
                  </p>
                  <div className="pt-1 text-slate-500">
                    Phone: <strong className="text-slate-800">{activeOrder.customer.phone}</strong>
                  </div>
                </div>
              </div>

              {/* Payment & Invoicing Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#DF9E26]" />
                    <h3 className="text-xs font-bold text-[#0B1528] uppercase tracking-wider">
                      Payment & Billing
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {activeOrder.customer.paymentStatus || 'PAID'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method:</span>
                    <span className="font-bold text-slate-800 uppercase">
                      {activeOrder.customer.paymentMethod === 'razorpay' ? 'Razorpay Online (UPI/Cards)' : activeOrder.customer.paymentMethod}
                    </span>
                  </div>

                  {activeOrder.razorpayPaymentId && (
                    <div className="flex justify-between text-slate-600">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-slate-800 font-bold text-[11px]">
                        {activeOrder.razorpayPaymentId}
                      </span>
                    </div>
                  )}

                  {activeOrder.customer.gstin && (
                    <div className="flex justify-between text-slate-600">
                      <span>GSTIN (Input Credit):</span>
                      <span className="font-mono text-slate-800 font-bold text-[11px]">
                        {activeOrder.customer.gstin}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-2 space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹{(activeOrder.totalAmount - (activeOrder.totalAmount >= 499 ? 0 : 79)).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Logistics:</span>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST (18% Included):</span>
                      <span>₹{Math.round(activeOrder.totalAmount * 0.18).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Paid:</span>
                      <span className="text-[#0B1528]">₹{activeOrder.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Tax Invoice & Receipt</span>
                </button>
              </div>

              {/* Contractor Direct Support Options */}
              <div className="bg-[#0B1528] text-white rounded-2xl p-5 space-y-4 border border-[#DF9E26]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#DF9E26]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Contractor Dispatch Support</span>
                  </div>
                  <h4 className="text-sm font-bold">
                    Need instant delivery updates?
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connect directly with our fleet dispatch manager to reroute shipments or request early morning offloading.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Dispatch on WhatsApp</span>
                  </a>

                  <button
                    onClick={handleReorder}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#DF9E26] hover:bg-[#c98d20] text-[#0B1528] font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder this Material Batch</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* PRINT TAX INVOICE MODAL */}
      {showPrintModal && activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <MetaProLogo variant="full" theme="light" size="sm" />
                <p className="text-[11px] text-slate-500 mt-1">
                  MetaPro Enterprises Pvt. Ltd. • GSTIN: 07AABCM8829K1Z4
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase text-[#0B1528] block">
                  COMMERCIAL TAX INVOICE
                </span>
                <span className="text-xs text-slate-500">
                  Invoice #: INV-{activeOrder.id.replace('MP-ORD-', '')}
                </span>
                <span className="block text-[11px] text-slate-400">
                  Date: {new Date(activeOrder.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {/* Billed To / Shipped To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Billed & Shipped To:</span>
                <p className="font-bold text-slate-900">{activeOrder.customer.fullName}</p>
                {activeOrder.customer.companyName && <p>{activeOrder.customer.companyName}</p>}
                <p>{activeOrder.customer.streetAddress}</p>
                <p>{activeOrder.customer.city}, {activeOrder.customer.state} — {activeOrder.customer.pincode}</p>
                <p>Phone: {activeOrder.customer.phone}</p>
                {activeOrder.customer.gstin && (
                  <p className="font-bold text-slate-900 mt-1">GSTIN: {activeOrder.customer.gstin}</p>
                )}
              </div>
              <div className="space-y-1 text-right">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Payment Proof:</span>
                <p className="font-bold text-emerald-700">STATUS: {activeOrder.customer.paymentStatus || 'PAID'}</p>
                <p>Method: {activeOrder.customer.paymentMethod.toUpperCase()}</p>
                {activeOrder.razorpayPaymentId && (
                  <p className="font-mono text-[11px]">Txn: {activeOrder.razorpayPaymentId}</p>
                )}
                <p>Docket: {activeOrder.trackingDocket || 'MP-EXP-7729104'}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeOrder.items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-semibold text-slate-800">{item.product.name}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-right">₹{item.product.price.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="p-2.5 text-right">Grand Total (Inclusive of 18% GST):</td>
                  <td className="p-2.5 text-right text-sm font-black text-[#0B1528]">
                    ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#0B1528] text-white rounded-xl text-xs font-bold hover:bg-[#152238] flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

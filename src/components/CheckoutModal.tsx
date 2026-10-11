import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { usePincode } from '../context/PincodeContext';
import { pincodeService, PincodeInfo } from '../services/pincodeService';
import { OrderCustomerDetails, Order } from '../types/product';
import { RazorpayModal } from './RazorpayModal';
import { RazorpayPaymentSuccessData } from '../services/razorpayService';
import { MetaProLogo } from './MetaProLogo';
import { 
  X, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  MessageSquare, 
  Building, 
  PackageCheck, 
  Phone, 
  User, 
  ArrowRight,
  QrCode,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    buyNowProduct, 
    closeBuyNow, 
    placeOrder,
    subtotal,
    deliveryFee,
    totalAmount
  } = useCart();

  const { whatsAppNumber } = useProducts();
  const { customerUser, isCustomerLoggedIn, openAuthModal, getDefaultAddress } = useCustomerAuth();
  const { currentPincode, setPincode } = usePincode();

  // State
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'whatsapp_po'>('razorpay');

  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo>(() =>
    pincodeService.getPincodeDetails(currentPincode)
  );

  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize or prefill from logged-in customerUser
  useEffect(() => {
    if (customerUser) {
      setFullName(customerUser.fullName || '');
      setPhone(customerUser.phone || '');
      setEmail(customerUser.email || '');
      setCompanyName(customerUser.companyName || '');
      setGstin(customerUser.gstin || '');

      const defAddr = getDefaultAddress();
      if (defAddr) {
        setSelectedSavedAddrId(defAddr.id);
        setStreetAddress(defAddr.streetAddress);
        setCity(defAddr.city);
        setState(defAddr.state);
        setPincodeInput(defAddr.pincode);
        setPincodeInfo(pincodeService.getPincodeDetails(defAddr.pincode));
      } else {
        setPincodeInput(currentPincode);
        setPincodeInfo(pincodeService.getPincodeDetails(currentPincode));
      }
    }
  }, [customerUser, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Gate: If not logged in, force login modal
  if (!isCustomerLoggedIn || !customerUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center space-y-4 border border-slate-200">
          <div className="flex justify-center">
            <MetaProLogo variant="compact" theme="light" size="md" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Sign in to complete your order</h3>
          <p className="text-xs text-slate-600">
            You need to be logged into your MetaPro account to track your orders, manage jobsite addresses, and view tax invoices.
          </p>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              openAuthModal('checkout', 'Please sign in to proceed to checkout.');
            }}
            className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-xs rounded-xl shadow-xs"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  // Determine items and pricing
  const items = buyNowProduct 
    ? [{ product: buyNowProduct.product, quantity: buyNowProduct.quantity }]
    : cart;

  const currentSubtotal = buyNowProduct
    ? buyNowProduct.product.price * buyNowProduct.quantity
    : subtotal;

  const currentDelivery = currentSubtotal >= 499 ? 0 : 79;
  const currentTotal = currentSubtotal + currentDelivery;

  const handleClose = () => {
    setConfirmedOrder(null);
    setErrorMsg(null);
    closeBuyNow();
  };

  const handleSelectSavedAddress = (addrId: string) => {
    setSelectedSavedAddrId(addrId);
    const addr = customerUser.addresses.find((a) => a.id === addrId);
    if (addr) {
      setStreetAddress(addr.streetAddress);
      setCity(addr.city);
      setState(addr.state);
      setPincodeInput(addr.pincode);
      setPincodeInfo(pincodeService.getPincodeDetails(addr.pincode));
      setPincode(addr.pincode);
    }
  };

  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/\D/g, '');
    setPincodeInput(clean);
    if (pincodeService.isValidPincode(clean)) {
      const details = pincodeService.getPincodeDetails(clean);
      setPincodeInfo(details);
      setCity(details.city);
      setState(details.state);
      setPincode(clean);
    }
  };

  const validateForm = (): boolean => {
    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !pincode.trim()) {
      setErrorMsg('Please fill in all mandatory delivery address fields.');
      return false;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for order delivery updates.');
      return false;
    }
    if (!pincodeService.isValidPincode(pincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code (e.g. 110001 or 400001).');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // If payment method is Razorpay, open Razorpay Payment Dialog first
    if (paymentMethod === 'razorpay') {
      setIsRazorpayModalOpen(true);
      return;
    }

    // Otherwise place order directly for COD or WhatsApp PO
    finalizeOrder({
      fullName,
      phone,
      email,
      companyName,
      gstin,
      streetAddress,
      city: city || pincodeInfo.city,
      state: state || pincodeInfo.state,
      pincode,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING'
    });
  };

  const handleRazorpaySuccess = (payData: RazorpayPaymentSuccessData) => {
    setIsRazorpayModalOpen(false);
    finalizeOrder({
      fullName,
      phone,
      email,
      companyName,
      gstin,
      streetAddress,
      city: city || pincodeInfo.city,
      state: state || pincodeInfo.state,
      pincode,
      paymentMethod: 'razorpay',
      paymentStatus: 'PAID',
      razorpayPaymentId: payData.razorpay_payment_id,
    });
  };

  const finalizeOrder = (customerDetails: OrderCustomerDetails) => {
    const order = placeOrder(customerDetails, buyNowProduct || undefined);
    setConfirmedOrder(order);
  };

  const getWhatsAppOrderUrl = (order: Order) => {
    const itemsList = order.items
      .map((i) => `• ${i.product.name} (Qty: ${i.quantity}) - ₹${i.product.price * i.quantity}`)
      .join('\n');

    const payStatus = order.customer.paymentMethod === 'razorpay'
      ? `PAID via Razorpay (ID: ${order.razorpayPaymentId})`
      : order.customer.paymentMethod === 'cod'
      ? 'Cash on Jobsite Delivery (COD)'
      : 'Contractor Purchase Order';

    const msg = `Hello MetaPro Enterprises,\n\nI have placed an order on your store:\n*Order ID:* #${order.id}\n*Customer:* ${order.customer.fullName} (${order.customer.phone})\n*Delivery Address:* ${order.customer.streetAddress}, ${order.customer.city} (${order.customer.pincode})\n*Payment:* ${payStatus}\n\n*Items Ordered:*\n${itemsList}\n\n*Total Amount:* ₹${order.totalAmount.toLocaleString('en-IN')}\n\nPlease confirm shipment transit. Thank you!`;

    return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 my-6 max-h-[95vh] flex flex-col">
          
          {/* Header with Brand Vector Logo */}
          <div className="bg-[#0B1528] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#DF9E26]/30 shrink-0">
            <div className="flex items-center gap-2">
              <MetaProLogo variant="compact" theme="dark" size="sm" />
              <span className="text-xs uppercase bg-[#152238] px-2.5 py-0.5 rounded text-[#DF9E26] font-bold border border-[#DF9E26]/30 ml-2 hidden sm:inline">
                Secure Checkout
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            {confirmedOrder ? (
              /* Order Confirmation Screen */
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <PackageCheck className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Order Successfully Placed
                  </span>
                  <h2 className="text-2xl font-bold text-[#0F1111] mt-3">
                    Thank you, {confirmedOrder.customer.fullName}!
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Order Reference: <strong className="text-slate-900 font-mono text-sm">#{confirmedOrder.id}</strong>
                  </p>
                </div>

                {/* Razorpay Verified Badge if Paid */}
                {confirmedOrder.customer.paymentMethod === 'razorpay' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 max-w-lg mx-auto flex items-center justify-between text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0B67C2] text-white flex items-center justify-center font-bold text-sm">
                        R
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Online Payment Verified</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Payment ID: {confirmedOrder.razorpayPaymentId}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#0B67C2]">
                      ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {/* Estimated Delivery Card with Pincode details */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-lg mx-auto text-left flex items-start gap-3.5">
                  <Truck className="w-6 h-6 text-[#DF9E26] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {pincodeInfo.deliveryEstimate}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Fulfillment via <strong>{pincodeInfo.hubLocation}</strong> to:{' '}
                      <strong>{confirmedOrder.customer.streetAddress}, {confirmedOrder.customer.city} - {confirmedOrder.customer.pincode}</strong>
                    </p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="border border-slate-200 rounded-xl p-4 max-w-lg mx-auto text-left space-y-3 bg-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex justify-between">
                    <span>Items Ordered ({confirmedOrder.items.length})</span>
                    <span>Total: ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {confirmedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="truncate pr-2 font-medium text-slate-800">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-semibold text-slate-900 shrink-0 font-mono">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppOrderUrl(confirmedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Order to WhatsApp Dispatch</span>
                  </a>
                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-600 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: Customer & Site Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#DF9E26]" />
                      <span>1. Delivery Address & Indian Pincode</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Logged in as <strong>{customerUser.fullName}</strong>
                    </span>
                  </div>

                  {/* Saved Address Quick Selector */}
                  {customerUser.addresses.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                      <span className="text-[11px] uppercase font-bold text-slate-500 block">
                        Select Saved Location:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {customerUser.addresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(addr.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex flex-col justify-between ${
                              selectedSavedAddrId === addr.id
                                ? 'border-[#DF9E26] bg-[#DF9E26]/10 text-[#0B1528] font-bold ring-1 ring-[#DF9E26]'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[11px]">{addr.label}</span>
                              <span className="font-mono text-[10px] text-slate-500">{addr.pincode}</span>
                            </div>
                            <span className="text-[11px] text-slate-600 truncate mt-1">
                              {addr.streetAddress}, {addr.city}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name / Site Head *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jobsite / Warehouse Street Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Plot No., Building/Floor, Industrial Area, Landmark"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Indian PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="6-digit PIN"
                        className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                      />
                    </div>
                  </div>

                  {/* Pincode delivery speed banner */}
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pincodeInfo.deliveryEstimate} ({pincodeInfo.hubLocation})</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Deliverable
                    </span>
                  </div>
                </div>

                {/* Section 2: Payment Method */}
                <div className="space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#DF9E26]" />
                      <span>2. Select Payment Method</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Razorpay Online */}
                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#0B67C2] bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="text-[#0B67C2] focus:ring-[#0B67C2]"
                        />
                        <span className="text-[10px] bg-[#0B67C2] text-white font-bold px-1.5 py-0.5 rounded">
                          RECOMMENDED
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <QrCode className="w-4 h-4 text-[#0B67C2]" />
                          <span>Razorpay Online</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          UPI (GPay/PhonePe), Cards, NetBanking
                        </p>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        paymentMethod === 'cod'
                          ? 'border-[#DF9E26] bg-[#DF9E26]/10 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="text-[#DF9E26] focus:ring-[#DF9E26]"
                        />
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                          COD
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <DollarSign className="w-4 h-4 text-amber-600" />
                          <span>Pay on Delivery</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Cash / Cheque upon site handover
                        </p>
                      </div>
                    </label>

                    {/* Contractor PO */}
                    <label
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        paymentMethod === 'whatsapp_po'
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="whatsapp_po"
                          checked={paymentMethod === 'whatsapp_po'}
                          onChange={() => setPaymentMethod('whatsapp_po')}
                          className="text-emerald-600 focus:ring-emerald-600"
                        />
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          B2B
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>Contractor PO</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Direct WhatsApp Purchase Order
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Section 3: Order Review & Total */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Items Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
                    <span className="font-semibold text-slate-900">₹{currentSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Logistics & Express Delivery:</span>
                    <span className="font-semibold text-emerald-700">
                      {currentDelivery === 0 ? 'FREE' : `₹${currentDelivery}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>Order Total:</span>
                    <span className="text-base text-[#0B1528] font-mono">
                      ₹{currentTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'bg-[#0B67C2] hover:bg-[#09529b] text-white'
                      : 'bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111]'
                  }`}
                >
                  {paymentMethod === 'razorpay' ? (
                    <>
                      <span>Pay ₹{currentTotal.toLocaleString('en-IN')} via Razorpay Gateway</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Place Order (₹{currentTotal.toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        amount={currentTotal}
        customerName={fullName}
        customerPhone={phone}
        customerEmail={email}
        streetAddress={streetAddress}
        city={city || pincodeInfo.city}
        state={state || pincodeInfo.state}
        pincode={pincode}
        items={cart}
        buyNowProduct={buyNowProduct || undefined}
        onPaymentSuccess={handleRazorpaySuccess}
      />
    </>
  );
};

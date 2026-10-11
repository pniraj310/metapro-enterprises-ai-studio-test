import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCart } from '../../context/CartContext';
import { usePincode } from '../../context/PincodeContext';
import { pincodeService } from '../../services/pincodeService';
import { MetaProLogo } from '../../components/MetaProLogo';
import { 
  Package, 
  MapPin, 
  User, 
  Building, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  ExternalLink, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ArrowRight,
  CreditCard,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { OrderHistory } from '../../components/account/OrderHistory';

export const Account: React.FC = () => {
  const { 
    customerUser, 
    isCustomerLoggedIn, 
    logoutCustomer, 
    updateProfile, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress,
    openAuthModal
  } = useCustomerAuth();

  const { recentOrders } = useCart();
  const { setPincode, openLocationModal } = usePincode();
  const { whatsAppNumber } = useProducts();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // New address form state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Jobsite');
  const [newAddrRecipient, setNewAddrRecipient] = useState(customerUser?.fullName || '');
  const [newAddrPhone, setNewAddrPhone] = useState(customerUser?.phone || '');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(false);

  // Profile edit state
  const [profileName, setProfileName] = useState(customerUser?.fullName || '');
  const [profilePhone, setProfilePhone] = useState(customerUser?.phone || '');
  const [profileEmail, setProfileEmail] = useState(customerUser?.email || '');
  const [profileCompany, setProfileCompany] = useState(customerUser?.companyName || '');
  const [profileGst, setProfileGst] = useState(customerUser?.gstin || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // If user is not logged in, show Amazon style Sign In prompt
  if (!isCustomerLoggedIn || !customerUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 max-w-md w-full text-center space-y-5">
          <div className="flex justify-center">
            <MetaProLogo variant="full" theme="light" size="lg" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Account</h2>
            <p className="text-xs text-slate-600 mt-1">
              Sign in to view your orders, jobsite delivery addresses, GST invoices, and track shipments.
            </p>
          </div>
          <button
            onClick={() => openAuthModal('account', 'Sign in to access your MetaPro Account dashboard.')}
            className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            Sign in to Your Account
          </button>
          <div className="pt-2">
            <Link to="/products" className="text-xs text-[#007185] hover:underline font-semibold">
              ← Continue browsing products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: profileName,
      phone: profilePhone,
      email: profileEmail,
      companyName: profileCompany,
      gstin: profileGst
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrPin) return;

    addAddress({
      label: newAddrLabel,
      recipientName: newAddrRecipient || customerUser.fullName,
      phone: newAddrPhone || customerUser.phone,
      streetAddress: newAddrStreet,
      city: newAddrCity || 'New Delhi',
      state: newAddrState || 'Delhi',
      pincode: newAddrPin,
      isDefault: newAddrIsDefault
    });

    // Auto set delivery pin in context
    setPincode(newAddrPin);

    setShowAddAddressModal(false);
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrPin('');
  };

  const handlePinChangeInModal = (pin: string) => {
    const clean = pin.replace(/\D/g, '');
    setNewAddrPin(clean);
    if (pincodeService.isValidPincode(clean)) {
      const details = pincodeService.getPincodeDetails(clean);
      setNewAddrCity(details.city);
      setNewAddrState(details.state);
    }
  };

  // Filter user's orders (or show all recent for demo purposes)
  const userOrders = recentOrders;

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      
      {/* Account Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1528] text-[#DF9E26] flex items-center justify-center font-black text-2xl shadow-sm">
            {customerUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1528]">
                {customerUser.fullName}
              </h1>
              {customerUser.companyName && (
                <span className="bg-[#DF9E26]/10 text-[#0B1528] border border-[#DF9E26]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Contractor Verified
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 {customerUser.phone}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{customerUser.email}</span>
              </span>
              {customerUser.gstin && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-700 font-semibold">
                    GSTIN: {customerUser.gstin}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logoutCustomer}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#DF9E26] text-[#0B1528]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Your Orders & Shipments ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'addresses'
              ? 'border-[#DF9E26] text-[#0B1528]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Locations & PIN Codes ({customerUser.addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-[#DF9E26] text-[#0B1528]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Profile & GST Billing Info</span>
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <OrderHistory 
          customerUser={customerUser} 
          whatsAppNumber={whatsAppNumber} 
        />
      )}

      {/* TAB CONTENT: ADDRESSES & INDIAN PINCODES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Delivery Locations & Pincodes</h3>
              <p className="text-xs text-slate-500">
                Manage construction jobsites, factory premises, and warehouses for express transit
              </p>
            </div>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="px-4 py-2 bg-[#DF9E26] hover:bg-[#cf8e18] text-[#0B1528] font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerUser.addresses.map((addr) => {
              const isDefault = addr.id === customerUser.defaultAddressId || addr.isDefault;
              const pinDetails = pincodeService.getPincodeDetails(addr.pincode);

              return (
                <div
                  key={addr.id}
                  className={`bg-white rounded-xl p-5 border transition-all flex flex-col justify-between ${
                    isDefault ? 'border-[#DF9E26] shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold text-[11px] rounded uppercase tracking-wider">
                        {addr.label}
                      </span>
                      {isDefault && (
                        <span className="text-[11px] font-bold text-[#DF9E26] flex items-center gap-1 bg-[#DF9E26]/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Default Delivery
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{addr.recipientName}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.streetAddress}
                      <br />
                      {addr.city}, {addr.state} - <strong className="text-slate-900 font-mono">{addr.pincode}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Contact: +91 {addr.phone}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50/70 p-2 rounded-lg">
                      <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{pinDetails.deliveryEstimate} ({pinDetails.hubLocation})</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    {!isDefault ? (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-xs text-[#007185] hover:underline font-semibold"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Selected for checkout</span>
                    )}

                    {customerUser.addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROFILE & GST */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Contractor Profile & Business Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your GSTIN to automatically generate B2B tax invoices with eligible Input Tax Credit (ITC).
            </p>
          </div>

          {profileSavedMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (Primary)</label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Invoicing)</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Contractor Name</label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="e.g. Apex Infrastructures"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (for Input Credit)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={profileGst}
                  onChange={(e) => setProfileGst(e.target.value.toUpperCase())}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD NEW ADDRESS */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="bg-[#0B1528] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#DF9E26]" />
                <h3 className="font-bold text-sm">Add Jobsite / Delivery Address</h3>
              </div>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location Label</label>
                  <select
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Jobsite">Jobsite / Site</option>
                    <option value="Warehouse">Central Warehouse</option>
                    <option value="Office">Corporate Office</option>
                    <option value="Home">Residential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Indian PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddrPin}
                    onChange={(e) => handlePinChangeInModal(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DF9E26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Site Contact Person</label>
                  <input
                    type="text"
                    required
                    value={newAddrRecipient}
                    onChange={(e) => setNewAddrRecipient(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Site Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Landmark *</label>
                <textarea
                  required
                  rows={2}
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="Plot No., Tower, Industrial Area, Landmark"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newAddrIsDefault}
                  onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                  className="rounded text-[#DF9E26] focus:ring-[#DF9E26]"
                />
                <span className="text-xs text-slate-700 font-medium">Use as default address for future orders</span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DF9E26] hover:bg-[#cf8e18] text-[#0B1528] font-bold text-xs rounded-lg shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

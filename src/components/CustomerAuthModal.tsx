import React, { useState } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';
import { usePincode } from '../context/PincodeContext';
import { MetaProLogo } from './MetaProLogo';
import { X, User, Phone, Mail, Building, MapPin, ArrowRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMessage,
    authRedirectTarget,
    loginCustomer,
    registerCustomer,
    loginWithDemoAccount
  } = useCustomerAuth();

  const { setIsCheckoutOpen } = useCart();
  const { currentPincode } = usePincode();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  
  // Sign in state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('New Delhi');
  const [regPincode, setRegPincode] = useState(currentPincode);
  
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSuccessfulAuth = () => {
    closeAuthModal();
    if (authRedirectTarget === 'checkout') {
      setIsCheckoutOpen(true);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address.');
      return;
    }
    setError(null);
    loginCustomer(identifier, password);
    handleSuccessfulAuth();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number for order updates.');
      return;
    }
    setError(null);
    registerCustomer({
      fullName: regName,
      phone: regPhone,
      email: regEmail.trim() || `${regPhone}@buyer.metapro.in`,
      companyName: regCompany,
      streetAddress: regAddress || 'Central Commercial Hub',
      city: regCity,
      state: 'Delhi',
      pincode: regPincode || currentPincode
    });
    handleSuccessfulAuth();
  };

  const handleDemoSignIn = () => {
    loginWithDemoAccount();
    handleSuccessfulAuth();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-[#0B1528] px-6 py-4 flex items-center justify-between text-white border-b border-[#DF9E26]/30">
          <div className="flex items-center gap-2">
            <MetaProLogo variant="compact" theme="dark" size="sm" />
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Order Gate Notice */}
          <div className="bg-[#DF9E26]/10 border border-[#DF9E26]/30 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#DF9E26] shrink-0 mt-0.5" />
            <p className="text-xs text-[#0B1528] font-medium leading-snug">
              {authModalMessage}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                mode === 'signin'
                  ? 'border-[#DF9E26] text-[#0B1528]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-[#DF9E26] text-[#0B1528]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {mode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email or Mobile phone number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter phone or email"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26] focus:border-[#DF9E26]"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-[#007185] cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (optional for demo)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26] focus:border-[#DF9E26]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-2 text-[11px] text-slate-400 font-semibold uppercase">
                  Fast Testing Option
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>One-Click Login as Verified Contractor</span>
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="First and last name"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery PIN *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={regPincode}
                    onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit PIN"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Firm Name (Optional)
                </label>
                <input
                  type="text"
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  placeholder="e.g. Acme Builders / Interiors"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Site / Street Address
                </label>
                <textarea
                  rows={2}
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Plot/Floor, Street, Landmark"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-sm rounded-lg shadow-xs transition-colors mt-2 flex items-center justify-center gap-2"
              >
                <span>Create Account & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-500 text-center leading-normal pt-2">
            By continuing, you agree to MetaPro Enterprises’{' '}
            <span className="text-[#007185] hover:underline cursor-pointer">Conditions of Use</span> and{' '}
            <span className="text-[#007185] hover:underline cursor-pointer">Privacy Notice</span>.
          </p>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { usePincode } from '../context/PincodeContext';
import { POPULAR_PINCODES, pincodeService } from '../services/pincodeService';
import { MapPin, X, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { currentPincode, pincodeInfo, setPincode, isLocationModalOpen, closeLocationModal } = usePincode();
  const [pinInput, setPinInput] = useState(currentPincode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pincodeService.isValidPincode(pinInput)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code (e.g. 110001 or 400001).');
      return;
    }
    setErrorMsg(null);
    setPincode(pinInput);
  };

  const handleSelectPreset = (pin: string) => {
    setPinInput(pin);
    setPincode(pin);
  };

  const quickCities = [
    { name: 'Delhi NCR', pin: '110001' },
    { name: 'Mumbai', pin: '400001' },
    { name: 'Bengaluru', pin: '560001' },
    { name: 'Hyderabad', pin: '500001' },
    { name: 'Chennai', pin: '600001' },
    { name: 'Ahmedabad', pin: '380001' },
    { name: 'Pune', pin: '411001' },
    { name: 'Kolkata', pin: '700001' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header matching brand navy */}
        <div className="bg-[#0B1528] px-6 py-4 flex items-center justify-between text-white border-b border-[#DF9E26]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DF9E26]/20 flex items-center justify-center text-[#DF9E26]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Choose your delivery location</h3>
              <p className="text-xs text-slate-300">Fast jobsite dispatch across India</p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Delivery options and transit speeds vary based on your location. Enter your 6-digit Indian PIN code to see real-time inventory availability.
          </p>

          {/* Input Form */}
          <form onSubmit={handleApply} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPinInput(val);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter 6-digit PIN code"
                  className="w-full pl-3 pr-4 py-2.5 text-sm font-semibold tracking-wider text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DF9E26] focus:border-[#DF9E26] focus:bg-white transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#DF9E26] hover:bg-[#cf8e18] text-[#0B1528] font-bold text-sm rounded-lg shadow-sm transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-600 font-medium pl-1">{errorMsg}</p>
            )}
          </form>

          {/* Current Active Location Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span>Selected: {pincodeInfo.pincode} — {pincodeInfo.city}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                  Deliverable
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                {pincodeInfo.deliveryEstimate} via {pincodeInfo.hubLocation}
              </p>
            </div>
          </div>

          {/* Popular Hubs / Major Metro Presets */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Or Select Major Construction Hub
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickCities.map((c) => {
                const isSelected = currentPincode === c.pin;
                return (
                  <button
                    key={c.pin}
                    type="button"
                    onClick={() => handleSelectPreset(c.pin)}
                    className={`px-3 py-2 text-xs rounded-lg font-medium text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#DF9E26] bg-[#DF9E26]/10 text-[#0B1528] font-bold'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5">{c.pin}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct GST Invoicing across all Indian States</span>
          </div>
          <button
            onClick={closeLocationModal}
            className="text-[#007185] hover:underline font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

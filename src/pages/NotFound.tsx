import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#FF6B00] flex items-center justify-center mb-4 shadow-xs">
        <Construction className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] mb-1">
        404 Page Not Found
      </span>
      <h1 className="text-3xl font-black text-[#0F172A] mb-2">
        Looking for Construction Supplies?
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        The page or product catalogue URL you requested does not exist or has been relocated.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    </div>
  );
};

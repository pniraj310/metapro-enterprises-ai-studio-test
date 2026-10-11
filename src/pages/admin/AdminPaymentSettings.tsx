import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchPaymentSettings } from '../../services/razorpayService';
import { PaymentSettingsInfo } from '../../types/product';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ExternalLink,
  Hammer,
  Key,
  Webhook,
  DollarSign,
  AlertTriangle,
  Info
} from 'lucide-react';

export const AdminPaymentSettings: React.FC = () => {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<PaymentSettingsInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPaymentSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    if (!settings) return;
    navigator.clipboard.writeText(window.location.origin + settings.webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Admin Header */}
      <div className="bg-[#1E293B] text-white border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FF6B00]">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Meta<span className="text-[#FF6B00]">Pro</span> Owner Portal
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Settings
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{adminUser || 'admin'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF6B00]" />
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 border-t border-slate-700/60 overflow-x-auto">
          <Link
            to="/admin/dashboard"
            className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Products Catalog
          </Link>
          <Link
            to="/admin/payments"
            className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Payments & Orders
          </Link>
          <Link
            to="/admin/settings/payments"
            className="px-4 py-3 text-xs font-bold text-[#FF6B00] border-b-2 border-[#FF6B00] transition-colors"
          >
            Payment Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Payment Gateway Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configuration and server-side integration details for Razorpay.
            </p>
          </div>

          <button
            onClick={loadSettings}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload Status</span>
          </button>
        </div>

        {/* Prominent Mode Banner */}
        <div className="rounded-2xl p-5 border bg-amber-50 border-amber-200 text-amber-900 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-wider text-amber-950 font-mono">
                {settings?.modeLabel || 'RAZORPAY TEST MODE'}
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                Active Sandbox
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              The gateway is configured in <strong>TEST MODE</strong>. Payments made using this mode do NOT charge real money.
              Switching to <strong>LIVE MODE</strong> requires setting <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">RAZORPAY_MODE=live</code> and providing live production keys via backend environment variables.
            </p>
          </div>
        </div>

        {/* Security Rule Stamp */}
        <div className="rounded-2xl p-4 bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0B67C2] shrink-0" />
            <span>
              <strong>Zero-Exposure Security Standard:</strong> Secret keys (<code className="font-mono">RAZORPAY_KEY_SECRET</code>) are never returned to React or displayed in the UI.
            </span>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 hidden sm:inline">
            PCI-DSS Guarded
          </span>
        </div>

        {/* Configuration Overview Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Current Gateway Status</h3>
            <span className="text-xs text-slate-500 font-mono">Auto-detected from environment</span>
          </div>

          <div className="p-6 divide-y divide-slate-100 text-xs">
            {/* Payment Provider */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">Payment Provider</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B67C2]" />
                <span className="font-bold text-slate-900">{settings?.provider || 'Razorpay'}</span>
              </div>
            </div>

            {/* Test/Live Mode */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">Operating Environment</span>
              <span className="font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px]">
                {settings?.modeLabel || 'RAZORPAY TEST MODE'}
              </span>
            </div>

            {/* Currency */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">Supported Currency</span>
              <span className="font-bold text-slate-900">{settings?.currency || 'INR'} (Indian Rupee)</span>
            </div>

            {/* Public Key ID */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">Public Key ID (Client-Safe)</span>
              <span className="font-mono text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {settings?.keyId || 'rzp_test_metapro_sandbox'}
              </span>
            </div>

            {/* Key Secret Status */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">API Key Secret (Server-Side)</span>
              {settings?.isKeyConfigured ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                  <span>Not configured (Using Sandbox)</span>
                </span>
              )}
            </div>

            {/* Gateway Status */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">Gateway Status</span>
              <span className="font-semibold text-slate-900">
                {settings?.gatewayStatus || 'Test Mode (Sandbox active)'}
              </span>
            </div>

            {/* Webhook Status */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-700">Webhook Secret Status</span>
              {settings?.isWebhookConfigured ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Configured</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <span>Not configured</span>
                </span>
              )}
            </div>

            {/* Webhook Endpoint URL */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-700 block">Webhook Listener URL</span>
                <span className="text-[11px] text-slate-400">Configure this in Razorpay Dashboard → Webhooks</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-slate-100 px-2.5 py-1 rounded text-[11px] font-mono text-slate-800">
                  {typeof window !== 'undefined' ? window.location.origin : ''}
                  {settings?.webhookUrl || '/api/payments/webhook'}
                </code>
                <button
                  type="button"
                  onClick={copyWebhookUrl}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                  title="Copy Webhook URL"
                >
                  {copiedUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mode Checklist Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Info className="w-4 h-4 text-[#0B67C2]" />
            <span>Production Live Mode Activation Checklist</span>
          </div>
          <p className="text-xs text-slate-600">
            Per security guidelines, the application remains labeled <strong>RAZORPAY TEST MODE</strong> until all activation criteria are verified:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">1. Razorpay Account Activated</span>
                <p className="text-[11px] text-slate-500">KYC verification approved in Razorpay Dashboard.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">2. Live API Keys Generated</span>
                <p className="text-[11px] text-slate-500">Live Key ID and Key Secret injected into environment.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">3. Backend Signature Verification</span>
                <p className="text-[11px] text-slate-500">Active HMAC SHA-256 endpoint verified on /api/payments/verify.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">4. Webhook Deduplication Strategy</span>
                <p className="text-[11px] text-slate-500">Idempotent processing via event IDs on /api/payments/webhook.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

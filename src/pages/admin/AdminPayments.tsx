import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PaymentRecord } from '../../types/product';
import { fetchAdminPayments, requestPaymentRefund } from '../../services/razorpayService';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Download,
  RefreshCw,
  LogOut,
  ExternalLink,
  Hammer,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Settings
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Refund Modal State
  const [refundModalPayment, setRefundModalPayment] = useState<PaymentRecord | null>(null);
  const [refundReason, setRefundReason] = useState('Customer cancelled / Site material return');
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    loadPaymentsData();
  }, [selectedStatus]);

  const loadPaymentsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPayments(selectedStatus, searchQuery);
      setPayments(data.payments);
      setTotalCount(data.totalCount);
      setTotalPaidAmount(data.totalPaidAmount);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPaymentsData();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenRefund = (payment: PaymentRecord) => {
    setRefundModalPayment(payment);
    setRefundReason('Customer requested cancellation / material spec change');
  };

  const handleExecuteRefund = async () => {
    if (!refundModalPayment) return;
    setIsRefunding(true);
    try {
      const res = await requestPaymentRefund(refundModalPayment.id, refundModalPayment.amount, refundReason);
      setNotification(`Refund of ₹${refundModalPayment.amount.toLocaleString('en-IN')} executed successfully.`);
      setRefundModalPayment(null);
      loadPaymentsData();
    } catch (err: any) {
      alert(`Refund Error: ${err.message || 'Failed to process refund.'}`);
    } finally {
      setIsRefunding(false);
    }
  };

  // Status counters
  const paidCount = payments.filter((p) => p.status === 'PAID').length;
  const pendingCount = payments.filter((p) => p.status === 'CREATED' || p.status === 'AUTHORIZED').length;
  const refundedCount = payments.filter((p) => p.status === 'REFUNDED').length;
  const failedCount = payments.filter((p) => p.status === 'FAILED').length;

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
                  Payments
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
            className="px-4 py-3 text-xs font-bold text-[#FF6B00] border-b-2 border-[#FF6B00] transition-colors"
          >
            Payments & Orders
          </Link>
          <Link
            to="/admin/settings/payments"
            className="px-4 py-3 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Payment Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notification Toast */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-xs text-emerald-600 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Title and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Razorpay Payments
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0B67C2] border border-blue-200">
                PostgreSQL Store
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verified transactions processed via server-side Razorpay order and signature verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadPaymentsData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/admin/settings/payments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B67C2] hover:bg-[#09529b] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gateway Settings</span>
            </Link>
          </div>
        </div>

        {/* 4 Statistics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Captured Volume</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ₹{totalPaidAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">100% verified signatures</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Paid Transactions</span>
              <CreditCard className="w-4 h-4 text-[#0B67C2]" />
            </div>
            <div className="text-2xl font-black text-[#0B67C2]">{paidCount}</div>
            <span className="text-[11px] text-slate-500">Online settlement active</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Pending / Created</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
            <span className="text-[11px] text-slate-500">Awaiting customer auth</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Refunded Records</span>
              <RotateCcw className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600">{refundedCount}</div>
            <span className="text-[11px] text-slate-500">Processed server-side</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Payments', count: totalCount },
              { id: 'paid', label: 'Paid', count: paidCount },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'failed', label: 'Failed', count: failedCount },
              { id: 'refunded', label: 'Refunded', count: refundedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedStatus === tab.id
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Payment ID, Order, Customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0B67C2]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Payment ID & Ref</th>
                  <th className="px-4 py-3.5">Order ID</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Signature Verified</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400 font-medium">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0B67C2]" />
                      Loading verified transactions from database...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400">
                      No payment records found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Payment ID */}
                      <td className="px-4 py-3.5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">
                            {p.razorpay_payment_id || p.id}
                          </span>
                          <button
                            onClick={() => handleCopy(p.razorpay_payment_id || p.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
                            title="Copy ID"
                          >
                            {copiedId === (p.razorpay_payment_id || p.id) ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Razorpay Order: {p.razorpay_order_id}
                        </span>
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3.5 font-mono text-slate-800 font-bold">
                        <Link
                          to={`/track-order/${p.order_id}`}
                          target="_blank"
                          className="hover:text-[#0B67C2] underline decoration-dotted"
                        >
                          #{p.order_id}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{p.customer_name || 'Anonymous Customer'}</div>
                        <div className="text-[11px] text-slate-400">{p.customer_phone || p.customer_email || '—'}</div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        ₹{p.amount.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">{p.currency}</span>
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] uppercase font-semibold">
                          {p.method || 'razorpay'}
                        </span>
                      </td>

                      {/* Signature Verified */}
                      <td className="px-4 py-3.5">
                        {p.signature_verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>HMAC SHA-256</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Pending Auth
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {p.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PAID</span>
                          </span>
                        ) : p.status === 'REFUNDED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            <RotateCcw className="w-3 h-3" />
                            <span>REFUNDED</span>
                          </span>
                        ) : p.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>FAILED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>{p.status}</span>
                          </span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        <span className="text-slate-400">
                          {new Date(p.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-2">
                        {p.status === 'PAID' && (
                          <button
                            onClick={() => handleOpenRefund(p)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold border border-purple-200 transition-colors"
                          >
                            Refund
                          </button>
                        )}
                        {p.status === 'REFUNDED' && (
                          <span className="text-[10px] text-purple-600 font-mono font-bold">
                            Ref: {p.refund_id?.substring(0, 10)}...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Refund Execution Modal */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Execute Razorpay Server Refund</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Requires Admin Authorization</span>
                </div>
              </div>
              <button
                onClick={() => setRefundModalPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-xs text-purple-950 space-y-1">
              <div>
                Transaction Ref: <strong className="font-mono">{refundModalPayment.razorpay_payment_id || refundModalPayment.id}</strong>
              </div>
              <div>
                Order ID: <strong className="font-mono">{refundModalPayment.order_id}</strong>
              </div>
              <div className="text-sm font-black text-purple-900 pt-1">
                Refund Amount: ₹{refundModalPayment.amount.toLocaleString('en-IN')} {refundModalPayment.currency}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Refund (logged in audit trail) *
              </label>
              <textarea
                rows={2}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-purple-600"
                placeholder="Specify customer cancellation or material defect reason"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-100 text-[11px] text-slate-600">
              This initiates a real Razorpay server-side refund call and changes payment status to <strong>REFUNDED</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundModalPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRefunding}
                onClick={handleExecuteRefund}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isRefunding ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing via Razorpay API...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Process Refund</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

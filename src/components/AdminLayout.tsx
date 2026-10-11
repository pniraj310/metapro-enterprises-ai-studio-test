import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MetaProLogo } from './MetaProLogo';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Globe,
  Building2,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  primaryAction,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, adminUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      isActive: location.pathname === '/admin/dashboard',
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: Package,
      isActive: location.pathname.startsWith('/admin/products'),
    },
    {
      label: 'Categories',
      path: '/admin/categories',
      icon: FolderTree,
      isActive: location.pathname.startsWith('/admin/categories'),
    },
    {
      label: 'Website Settings',
      path: '/admin/settings?tab=website',
      icon: Globe,
      isActive:
        location.pathname === '/admin/settings' &&
        location.search.includes('tab=website'),
    },
    {
      label: 'Business Settings',
      path: '/admin/settings',
      icon: Building2,
      isActive:
        location.pathname === '/admin/settings' &&
        !location.search.includes('tab=website'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-stone-900 flex font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#08142C] text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
            <Link to="/admin/dashboard" className="inline-flex items-center">
              <MetaProLogo variant="compact" theme="dark" size="xs" />
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-white/10 bg-white/5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#EAB01E] block">
              Business Owner Panel
            </span>
            <span className="text-xs text-stone-300 truncate block mt-0.5">
              {adminUser || 'Owner'}
            </span>
          </div>

          {/* Quick Add Product Button */}
          <div className="p-4">
            <Link
              to="/admin/products/add"
              onClick={() => setSidebarOpen(false)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#EAB01E] hover:bg-amber-400 text-stone-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    item.isActive
                      ? 'bg-white/12 text-[#EAB01E] font-semibold border-l-2 border-[#EAB01E]'
                      : 'text-stone-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Customer Website & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="w-full py-2 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span>Open Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#EAB01E]" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3.5 rounded-lg text-red-300 hover:bg-red-500/15 hover:text-red-200 text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-stone-950 truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-stone-500 truncate hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {primaryAction}
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-900 bg-white text-stone-800 text-xs font-medium transition-colors"
              >
                <span>Customer Showroom</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from './components/SEOHelmet';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { PincodeProvider } from './context/PincodeContext';
import { UserLayout } from './components/UserLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Customer Website Pages
import { Home } from './pages/user/Home';
import { Products } from './pages/user/Products';
import { ProductDetails } from './pages/user/ProductDetails';
import { EnquiryListPage } from './pages/user/EnquiryListPage';
import { AboutUs } from './pages/user/AboutUs';
import { Account } from './pages/user/Account';
import { OrderTracking } from './pages/user/OrderTracking';

// Business Owner / Admin Panel Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageProducts } from './pages/admin/ManageProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminSettings } from './pages/admin/AdminSettings';

// Fallback Page
import { NotFound } from './pages/NotFound';

import { RouteScrollRestoration } from './components/RouteScrollRestoration';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RouteScrollRestoration />
        <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <CustomerAuthProvider>
              <PincodeProvider>
                <Routes>
                  {/* 1. PUBLIC CUSTOMER WEBSITE ROUTES */}
                  <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path="materials" element={<Products />} />
                    <Route path="materials/:category" element={<Products />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product/:slug" element={<ProductDetails />} />
                    <Route path="products/:id" element={<ProductDetails />} />
                    <Route path="enquiry" element={<EnquiryListPage />} />
                    <Route path="enquiry-list" element={<EnquiryListPage />} />
                    <Route path="cart" element={<EnquiryListPage />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="contact" element={<AboutUs />} />
                    <Route path="account" element={<Account />} />
                    <Route path="track-order" element={<OrderTracking />} />
                    <Route path="track-order/:orderId" element={<OrderTracking />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* 2. PROTECTED BUSINESS OWNER / ADMIN PANEL ROUTES */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute>
                        <ManageProducts />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/products/add"
                    element={
                      <ProtectedRoute>
                        <ManageProducts />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/products/edit/:id"
                    element={
                      <ProtectedRoute>
                        <ManageProducts />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute>
                        <AdminCategories />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute>
                        <AdminSettings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                </Routes>
              </PincodeProvider>
            </CustomerAuthProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
    </HelmetProvider>
  );
}

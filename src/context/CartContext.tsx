import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderCustomerDetails, EnquiryRecord } from '../types/product';
import { productService } from '../services/productService';
import { MATERIAL_IMAGES } from '../assets/materialImages';

export interface EnquiryCustomerDetails {
  customerName: string;
  customerPhone: string;
  projectType: string;
  notes: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Enquiry List specific state & helpers
  enquiryDetails: EnquiryCustomerDetails;
  setEnquiryDetails: React.Dispatch<React.SetStateAction<EnquiryCustomerDetails>>;
  getFormattedWhatsAppMessage: () => string;
  getWhatsAppEnquiryUrl: () => string;
  recordEnquirySubmission: () => Promise<EnquiryRecord | null>;
  submittedEnquiries: EnquiryRecord[];

  // Legacy compatibility properties
  buyNowProduct: { product: Product; quantity: number } | null;
  triggerBuyNow: (product: Product, quantity?: number) => void;
  closeBuyNow: () => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeOrder: (customer: OrderCustomerDetails, directProduct?: { product: Product; quantity: number }) => Order;
  recentOrders: Order[];
  getOrderById: (orderId: string) => Order | undefined;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CART_STORAGE_KEY = 'metapro_enquiry_list_v1';
const ORDERS_STORAGE_KEY = 'metapro_orders_v1';
const ENQUIRY_DETAILS_KEY = 'metapro_enquiry_details_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [enquiryDetails, setEnquiryDetails] = useState<EnquiryCustomerDetails>(() => {
    try {
      const saved = localStorage.getItem(ENQUIRY_DETAILS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      customerName: '',
      customerPhone: '',
      projectType: 'Living Spaces',
      notes: '',
    };
  });

  const [submittedEnquiries, setSubmittedEnquiries] = useState<EnquiryRecord[]>([]);

  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }

    return [
      {
        id: 'MP-ENQ-942180',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'Confirmed',
        totalAmount: 42050,
        paymentStatus: 'PAID',
        trackingDocket: 'MP-SHW-7729104',
        courierPartner: 'MetaPro Direct Material Dispatch',
        estimatedDelivery: 'Within 24–48 Hours',
        customer: {
          fullName: 'Ar. Vikram Mehta',
          phone: '+91 98112 23344',
          email: 'vikram@studioform.in',
          companyName: 'Studio Form Architecture',
          streetAddress: 'Plot 42, Interior Design District',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
          paymentMethod: 'whatsapp_po',
        },
        items: [
          {
            product: {
              id: 'mp-prod-003',
              name: 'Charcoal & Walnut Architectural Fluted Wall Panel',
              price: 1850,
              unit: 'Panel (9.5 ft × 6.3 in)',
              sku: 'MP-FLT-2900-CH',
              category: 'Fluted Panels',
              description: 'Linear slatted architectural fluted wall panels.',
              image: MATERIAL_IMAGES.flutedWpcPanels,
              availability: 'Available',
              specifications: [{ label: 'Dimensions', value: '2900 mm × 160 mm × 12 mm' }],
              createdAt: '2026-01-01',
            },
            quantity: 10,
          },
          {
            product: {
              id: 'mp-prod-004',
              name: 'Statuario UV Marble Architectural PVC Wall Sheet',
              price: 2400,
              unit: 'Sheet (8 ft × 4 ft)',
              sku: 'MP-PVC-8X4-ST',
              category: 'PVC Wall Panels',
              description: 'Full-height 8×4 ft stone-plastic composite PVC wall cladding sheet.',
              image: MATERIAL_IMAGES.pvcMarbleCeiling,
              availability: 'Available',
              specifications: [{ label: 'Sheet Dimensions', value: '2440 mm × 1220 mm' }],
              createdAt: '2026-01-01',
            },
            quantity: 8,
          },
        ],
      },
    ];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save enquiry list to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRY_DETAILS_KEY, JSON.stringify(enquiryDetails));
    } catch (e) {
      console.error('Failed to save enquiry details', e);
    }
  }, [enquiryDetails]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(recentOrders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [recentOrders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1) => {
    const validQty = Math.max(1, Math.round(Number(quantity) || 1));
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + validQty }
            : item
        );
      }
      return [...prevCart, { product, quantity: validQty }];
    });
    showToast(`Added "${product.name} × ${validQty}" to your Enquiry List`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    showToast('Removed material from Enquiry List');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.round(quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const triggerBuyNow = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCartDrawerOpen(true);
  };

  const closeBuyNow = () => {
    setBuyNowProduct(null);
    setIsCheckoutOpen(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 0;
  const totalAmount = subtotal;

  const getFormattedWhatsAppMessage = () => {
    return productService.formatEnquiryListMessage(cart, enquiryDetails);
  };

  const getWhatsAppEnquiryUrl = () => {
    return productService.generateEnquiryListWhatsAppUrl(cart, enquiryDetails);
  };

  const recordEnquirySubmission = async (): Promise<EnquiryRecord | null> => {
    if (cart.length === 0) return null;
    const saved = await productService.saveEnquiryRecord({
      customerName: enquiryDetails.customerName || 'Showroom Visitor',
      customerPhone: enquiryDetails.customerPhone || 'WhatsApp Direct',
      projectType: enquiryDetails.projectType || 'Living Spaces',
      notes: enquiryDetails.notes,
      items: cart,
    });
    if (saved) {
      setSubmittedEnquiries((prev) => [saved, ...prev]);
    }
    return saved;
  };

  const placeOrder = (
    customer: OrderCustomerDetails,
    directProduct?: { product: Product; quantity: number }
  ): Order => {
    const itemsToOrder: CartItem[] = directProduct
      ? [{ product: directProduct.product, quantity: directProduct.quantity }]
      : [...cart];

    const orderSubtotal = itemsToOrder.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `MP-ENQ-${Date.now().toString().slice(-6)}`,
      items: itemsToOrder,
      totalAmount: orderSubtotal,
      customer,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      trackingDocket: `MP-SHW-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courierPartner: 'MetaPro Material Dispatch',
      estimatedDelivery: 'Within 24–48 Hours',
    };

    setRecentOrders((prev) => [newOrder, ...prev]);

    if (!directProduct) {
      clearCart();
    }
    setBuyNowProduct(null);

    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    if (!orderId) return undefined;
    const cleanId = orderId.trim().toUpperCase();
    return recentOrders.find((o) => o.id.toUpperCase() === cleanId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        totalAmount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        enquiryDetails,
        setEnquiryDetails,
        getFormattedWhatsAppMessage,
        getWhatsAppEnquiryUrl,
        recordEnquirySubmission,
        submittedEnquiries,
        buyNowProduct,
        triggerBuyNow,
        closeBuyNow,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeOrder,
        recentOrders,
        getOrderById,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

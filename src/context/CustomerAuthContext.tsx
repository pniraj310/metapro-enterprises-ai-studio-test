import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, CustomerAddress } from '../types/customer';

interface CustomerAuthContextType {
  customerUser: CustomerUser | null;
  isCustomerLoggedIn: boolean;
  loginCustomer: (emailOrPhone: string, password?: string) => boolean;
  registerCustomer: (data: {
    fullName: string;
    phone: string;
    email: string;
    companyName?: string;
    gstin?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) => CustomerUser;
  loginWithDemoAccount: () => void;
  logoutCustomer: () => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
  addAddress: (addr: Omit<CustomerAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => CustomerAddress | undefined;

  // Ordering gate modal controls
  isAuthModalOpen: boolean;
  authModalMessage: string;
  authRedirectTarget: 'checkout' | 'account' | null;
  openAuthModal: (target?: 'checkout' | 'account', customMessage?: string) => void;
  closeAuthModal: () => void;
}

const CUSTOMER_STORAGE_KEY = 'metapro_customer_user_v2';

const DEMO_CONTRACTOR_USER: CustomerUser = {
  id: 'cust_demo_88219',
  fullName: 'Rajesh Sharma',
  email: 'rajesh.sharma@sharmabuilders.in',
  phone: '9876543210',
  companyName: 'Sharma Interior & Drywall Contractors',
  gstin: '07AAAAA0000A1Z5',
  createdAt: new Date().toISOString(),
  defaultAddressId: 'addr_1',
  addresses: [
    {
      id: 'addr_1',
      label: 'Main Construction Jobsite',
      recipientName: 'Rajesh Sharma (Project Head)',
      phone: '9876543210',
      streetAddress: 'Plot 42, Sector 62, Commercial Tower B, Industrial Zone',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      isDefault: true
    },
    {
      id: 'addr_2',
      label: 'Central Warehouse / Office',
      recipientName: 'Rajesh Sharma',
      phone: '9876543210',
      streetAddress: 'Shop 14, Building Materials Market, Mayapuri Phase 2',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110064',
      isDefault: false
    }
  ]
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState(
    'Please sign in or create an account to proceed with your order.'
  );
  const [authRedirectTarget, setAuthRedirectTarget] = useState<'checkout' | 'account' | null>(null);

  useEffect(() => {
    try {
      if (customerUser) {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerUser));
      } else {
        localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync customerUser to storage', e);
    }
  }, [customerUser]);

  const loginCustomer = (emailOrPhone: string): boolean => {
    const trimmed = emailOrPhone.trim();
    if (!trimmed) return false;

    // If existing stored user exists and matches or demo user
    if (customerUser && (customerUser.email === trimmed || customerUser.phone === trimmed)) {
      // keep current
      return true;
    }

    // Default fast login
    const newUser: CustomerUser = {
      id: `cust_${Date.now()}`,
      fullName: trimmed.includes('@') ? trimmed.split('@')[0] : 'MetaPro Buyer',
      email: trimmed.includes('@') ? trimmed : `${trimmed}@buyer.metapro.in`,
      phone: /^\d{10}$/.test(trimmed) ? trimmed : '9876543210',
      companyName: 'Private Contractor',
      addresses: [
        {
          id: 'addr_auto_1',
          label: 'Default Delivery Address',
          recipientName: trimmed.includes('@') ? trimmed.split('@')[0] : 'MetaPro Buyer',
          phone: /^\d{10}$/.test(trimmed) ? trimmed : '9876543210',
          streetAddress: 'Main Ring Road, Commercial Sector',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          isDefault: true
        }
      ],
      defaultAddressId: 'addr_auto_1',
      createdAt: new Date().toISOString()
    };

    setCustomerUser(newUser);
    return true;
  };

  const registerCustomer = (data: {
    fullName: string;
    phone: string;
    email: string;
    companyName?: string;
    gstin?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }): CustomerUser => {
    const defaultAddrId = `addr_${Date.now()}`;
    const initialAddress: CustomerAddress = {
      id: defaultAddrId,
      label: data.companyName ? 'Jobsite / Office' : 'Primary Delivery Address',
      recipientName: data.fullName,
      phone: data.phone,
      streetAddress: data.streetAddress || '123 Construction Hub Road',
      city: data.city || 'New Delhi',
      state: data.state || 'Delhi',
      pincode: data.pincode || '110001',
      isDefault: true
    };

    const newUser: CustomerUser = {
      id: `cust_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      gstin: data.gstin,
      addresses: [initialAddress],
      defaultAddressId: defaultAddrId,
      createdAt: new Date().toISOString()
    };

    setCustomerUser(newUser);
    return newUser;
  };

  const loginWithDemoAccount = () => {
    setCustomerUser(DEMO_CONTRACTOR_USER);
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (!customerUser) return;
    setCustomerUser({
      ...customerUser,
      ...data
    });
  };

  const addAddress = (addr: Omit<CustomerAddress, 'id'>) => {
    if (!customerUser) return;
    const newId = `addr_${Date.now()}`;
    const newAddress: CustomerAddress = {
      ...addr,
      id: newId
    };

    const updatedAddresses = addr.isDefault
      ? customerUser.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
      : [...customerUser.addresses, newAddress];

    setCustomerUser({
      ...customerUser,
      addresses: updatedAddresses,
      defaultAddressId: addr.isDefault ? newId : customerUser.defaultAddressId || newId
    });
  };

  const deleteAddress = (id: string) => {
    if (!customerUser) return;
    const remaining = customerUser.addresses.filter((a) => a.id !== id);
    setCustomerUser({
      ...customerUser,
      addresses: remaining,
      defaultAddressId: customerUser.defaultAddressId === id ? remaining[0]?.id : customerUser.defaultAddressId
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!customerUser) return;
    const updated = customerUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    setCustomerUser({
      ...customerUser,
      addresses: updated,
      defaultAddressId: id
    });
  };

  const getDefaultAddress = (): CustomerAddress | undefined => {
    if (!customerUser || customerUser.addresses.length === 0) return undefined;
    return (
      customerUser.addresses.find((a) => a.id === customerUser.defaultAddressId) ||
      customerUser.addresses.find((a) => a.isDefault) ||
      customerUser.addresses[0]
    );
  };

  const openAuthModal = (
    target: 'checkout' | 'account' = 'checkout',
    customMessage = 'Please sign in or create an account to proceed with your order.'
  ) => {
    setAuthRedirectTarget(target);
    setAuthModalMessage(customMessage);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectTarget(null);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customerUser,
        isCustomerLoggedIn: !!customerUser,
        loginCustomer,
        registerCustomer,
        loginWithDemoAccount,
        logoutCustomer,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        isAuthModalOpen,
        authModalMessage,
        authRedirectTarget,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextType => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};

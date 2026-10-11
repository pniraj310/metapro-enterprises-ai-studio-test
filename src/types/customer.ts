export interface CustomerAddress {
  id: string;
  label: string; // 'Jobsite', 'Warehouse', 'Office', 'Home'
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  gstin?: string;
  addresses: CustomerAddress[];
  defaultAddressId?: string;
  createdAt: string;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { pincodeService, PincodeInfo, POPULAR_PINCODES } from '../services/pincodeService';

interface PincodeContextType {
  currentPincode: string;
  pincodeInfo: PincodeInfo;
  setPincode: (pin: string) => boolean;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const PINCODE_STORAGE_KEY = 'metapro_delivery_pincode_v1';
const DEFAULT_PINCODE = '110001'; // New Delhi Central

const PincodeContext = createContext<PincodeContextType | undefined>(undefined);

export const PincodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPincode, setCurrentPincodeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PINCODE_STORAGE_KEY);
      return saved && pincodeService.isValidPincode(saved) ? saved : DEFAULT_PINCODE;
    } catch {
      return DEFAULT_PINCODE;
    }
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo>(() =>
    pincodeService.getPincodeDetails(currentPincode)
  );

  useEffect(() => {
    const info = pincodeService.getPincodeDetails(currentPincode);
    setPincodeInfo(info);
    try {
      localStorage.setItem(PINCODE_STORAGE_KEY, currentPincode);
    } catch (e) {
      console.error('Failed to save pincode:', e);
    }
  }, [currentPincode]);

  const setPincode = (pin: string): boolean => {
    if (pincodeService.isValidPincode(pin)) {
      setCurrentPincodeState(pin.trim());
      setIsLocationModalOpen(false);
      return true;
    }
    return false;
  };

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  return (
    <PincodeContext.Provider
      value={{
        currentPincode,
        pincodeInfo,
        setPincode,
        isLocationModalOpen,
        setIsLocationModalOpen,
        openLocationModal,
        closeLocationModal
      }}
    >
      {children}
    </PincodeContext.Provider>
  );
};

export const usePincode = (): PincodeContextType => {
  const context = useContext(PincodeContext);
  if (!context) {
    throw new Error('usePincode must be used within a PincodeProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Address } from 'viem';

interface SettingsContextType {
  randomSwatchCount: number;
  setRandomSwatchCount: (count: number) => void;
  recipientAddress: Address | null;
  setRecipientAddress: (address: Address | null) => void;
  clearRecipientAddress: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [randomSwatchCount, setRandomSwatchCount] = useState(10);
  const [recipientAddress, setRecipientAddress] = useState<Address | null>(null);

  useEffect(() => {
    const savedRecipient = localStorage.getItem('recipientAddress') as Address | null;
    if (savedRecipient) {
      setRecipientAddress(savedRecipient);
    }
    const savedSwatchCount = localStorage.getItem('randomSwatchCount');
    if (savedSwatchCount) {
      const count = parseInt(savedSwatchCount, 10);
      if (!isNaN(count) && count > 0) {
        setRandomSwatchCount(count);
      }
    }
  }, []);

  useEffect(() => {
    if (recipientAddress) {
      localStorage.setItem('recipientAddress', recipientAddress);
    } else {
      localStorage.removeItem('recipientAddress');
    }
  }, [recipientAddress]);

  useEffect(() => {
    localStorage.setItem('randomSwatchCount', randomSwatchCount.toString());
  }, [randomSwatchCount]);

  const clearRecipientAddress = () => {
    setRecipientAddress(null);
  };

  const value = {
    randomSwatchCount,
    setRandomSwatchCount: (count: number) => {
      if (count > 0) {
        setRandomSwatchCount(count);
      }
    },
    recipientAddress,
    setRecipientAddress,
    clearRecipientAddress,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
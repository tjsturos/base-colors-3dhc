import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  randomSwatchCount: number;
  setRandomSwatchCount: (count: number) => void;
  recipientAddress: string | null;
  setRecipientAddress: (address: string | null) => void;
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
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);

  useEffect(() => {
    const savedRecipient = localStorage.getItem('recipientAddress');
    if (savedRecipient) {
      setRecipientAddress(savedRecipient);
    }
    const savedSwatchCount = localStorage.getItem('randomSwatchCount');
    if (savedSwatchCount) {
      setRandomSwatchCount(parseInt(savedSwatchCount, 10));
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
    setRandomSwatchCount,
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
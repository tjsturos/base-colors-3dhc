import React, { createContext, useContext, useState, useCallback } from 'react';

import { Color } from 'src/constants';

type ColorsContextType = {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
  removeColors: (hexCodes: string[]) => void;
};

const ColorsContext = createContext<ColorsContextType | undefined>(undefined);

export const ColorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<Color[]>([]);

  const removeColors = useCallback((hexCodes: string[]) => {
    setColors(prevColors => prevColors.filter(color => !hexCodes.includes(color.hexCode)));
  }, []);

  return (
    <ColorsContext.Provider value={{ colors, setColors, removeColors }}>
      {children}
    </ColorsContext.Provider>
  );
};

export const useColors = () => {
  const context = useContext(ColorsContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorsProvider');
  }
  return context;
};
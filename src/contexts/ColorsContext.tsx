import React, { createContext, useContext, useState, useCallback } from 'react';

import { Color } from 'src/constants';

type ColorsContextType = {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
  removeColors: (colorsToRemove: Color[]) => void;
  removeColor: (colorToRemove: Color) => void;
};

const ColorsContext = createContext<ColorsContextType | undefined>(undefined);

export const ColorsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<Color[]>([]);

  const removeColors = (colorsToRemove: Color[]) => {
    colorsToRemove.forEach(color => {
      removeColor(color);
    });
  };

  const removeColor = (colorToRemove: Color) => {
    setColors((colors: Color[]) => colors.filter(color => color !== colorToRemove));
  };

  return (
    <ColorsContext.Provider value={{ colors, setColors, removeColors, removeColor }}>
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
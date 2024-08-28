import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Color } from 'src/constants';

interface CartContextType {
  cart: Color[];
  addToCart: (color: Color) => void;
  removeFromCart: (hexCode: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Color[]>([]);

  const addToCart = (color: Color) => {
    setCart((prevCart) => {
      if (!prevCart.some((item) => item.hexCode === color.hexCode)) {
        return [...prevCart, color];
      }
      return prevCart;
    });
  };

  const removeFromCart = (hexCode: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.hexCode !== hexCode));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
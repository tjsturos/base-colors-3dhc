import React, { useState } from 'react';
import TransactionWrapper from './TransactionWrapper';
import type { Address } from 'viem';
import WalletWrapper from './WalletWrapper';
import { Press_Start_2P } from 'next/font/google';
import { useCart } from '../contexts/CartContext';

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface Color {
  hexCode: string;
  expandedHex: string;
}

interface ColorSwatchProps {
  color: Color;
  address: Address;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ address, color }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isInCart = cart.some(item => item.hexCode === color.hexCode);

  const handleCartAction = () => {
    if (isInCart) {
      removeFromCart(color.hexCode);
    } else {
      addToCart(color);
    }
  };

  return (
    <div className="flex flex-col items-center group">
      <div className={`text-sm mb-2 uppercase ${pressStart2P.className}`}>
        <span>#</span>{color.hexCode.replace('#', '')}
      </div>
      <div
        className="w-20 h-20 mb-3 border border-gray-300 cursor-pointer transition-transform group-hover:scale-105 relative"
        style={{ backgroundColor: color.expandedHex }}
        onClick={() => setIsModalOpen(true)}
        title="Click to view details"
      >
      </div>
      
      <button
        onClick={handleCartAction}
        className={`w-full font-bold py-2 px-4 rounded-xl ${
          isInCart
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Color Details</h2>
            <div 
              className="w-32 h-32 mb-4 mx-auto"
              style={{ backgroundColor: color.expandedHex }}
            ></div>
            <p className="mb-4">Hex: {color.hexCode}</p>
            <div className="flex justify-between">
              <button
                onClick={handleCartAction}
                className={`font-bold py-2 px-4 rounded ${
                  isInCart
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
              {address && (
                <TransactionWrapper 
                  address={address} 
                  color={color} 
                  className="inline-block"
                  onComplete={() => setIsModalOpen(false)}
                />
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSwatch;
import React, { useState } from 'react';
import TransactionWrapper from './TransactionWrapper';
import { Press_Start_2P } from 'next/font/google';
import { useCart } from 'src/contexts/CartContext';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Color } from 'src/constants';
import { useAccount } from 'wagmi';

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface ColorSwatchProps {
  color: Color;
  onView: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, onView }) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
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
        <div className="flex flex items-center">
          <span className="font-sans text-xl mb-1 mr-1">#</span>
          <span>{color.name.replace('#', '')}</span>
        </div>
      </div>
      <div
        className="w-20 h-20 mb-3 border border-gray-300 cursor-pointer transition-transform group-hover:scale-105 relative"
        style={{ backgroundColor: color.hexCode }}
        onClick={onView}
        title="Click to view details"
      >
      </div>
      
      <button
        onClick={handleCartAction}
        className={`w-full font-bold py-2 px-4 rounded-xl flex items-center justify-center ${
          isInCart
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-gray-500 hover:bg-gray-600 text-white'
        }`}
      >
        {isInCart ? (
          <>
            <FaMinus className="mr-2" />
            Remove
          </>
        ) : (
          <>
            <FaPlus className="mr-2" />
            Add
          </>
        )}
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Color Details</h2>
            <div 
              className="w-32 h-32 mb-4 mx-auto"
              style={{ backgroundColor: color.hexCode }}
            ></div>
            <p className="mb-4">Hex: {color.name}</p>
            <div className="flex justify-between">
              <button
                onClick={handleCartAction}
                className={`font-bold py-2 px-4 rounded flex items-center ${
                  isInCart
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {isInCart ? (
                  <>
                    <FaMinus className="mr-2" />
                    Remove from Cart
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
              {address && (
                <TransactionWrapper 
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
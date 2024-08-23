import React from 'react';
import { useCart } from 'src/contexts/CartContext';
import TransactionWrapper from 'src/components/TransactionWrapper';
import { useAccount } from 'wagmi';
import WalletWrapper from 'src/components/WalletWrapper';

const MintCart: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const { address } = useAccount();

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 md:p-6">
      <h2 className="text-lg font-bold mb-2">Colors Cart ({cart.length})</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {cart.map((color) => (
          <div
            key={color.hexCode}
            className="relative w-8 h-8 rounded"
            style={{ backgroundColor: color.expandedHex }}
          >
            <button
              onClick={() => removeFromCart(color.hexCode)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {address ? (
        <TransactionWrapper
          address={address}
          color={cart[0]} // Pass the first color, but the component will use the entire cart
          className="w-full"
        />
      ) : (
        <WalletWrapper text="Log In" className="bg-blue-500 text-white py-2 px-4 rounded" />
      )}
    </div>
  );
};

export default MintCart;
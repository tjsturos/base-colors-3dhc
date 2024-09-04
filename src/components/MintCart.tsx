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
            className="relative w-12 h-12 rounded flex flex-col items-center"
          >
            <div
              className="w-8 h-8 rounded mb-1"
              style={{ backgroundColor: color.hexCode }}
            >
              <button
                onClick={() => removeFromCart(color.hexCode)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
            <span className="text-xs text-center overflow-hidden text-ellipsis w-full flex items-center justify-center">
              <span className="text-[0.6rem] mr-[1px]">#</span><span className="text-[0.7rem]">{color.name.slice(1)}</span>
            </span>
          </div>
        ))}
      </div>
      {address ? (
        <TransactionWrapper
          className="w-full"
        />
      ) : (
        <button
          onClick={() => {
            console.log('Log In button clicked');
            (document.querySelector('button[data-testid="connect-wallet-button"]') as HTMLButtonElement)?.click();
          }}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default MintCart;
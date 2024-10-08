import React from 'react';
import { useCart } from 'src/contexts/CartContext';
import TransactionWrapper from 'src/components/TransactionWrapper';
import { useAccount } from 'wagmi';

const MintCart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { address } = useAccount();

  if (cart.length === 0) return null;

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items from the cart?')) {
      clearCart();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg shadow-t-lg p-4 pb-3 pt-2 md:p-6">
      <div className="flex justify-center mb-1">
        <h2 className="text-lg font-bold relative">
          Checkout ({cart.length} Base {cart.length === 1 ? 'Color' : 'Colors'}) - {(0.001 * cart.length).toFixed(4).replace(/\.?0+$/, '')} ETH
        
        </h2>
      </div>
        <div className="w-full h-px bg-gray-200 mb-3"></div>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
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
      <div className="w-full h-px bg-gray-200 mb-3"></div>
      {address ? (
        <TransactionWrapper
          className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto"
        />
      ) : (
        <button
          onClick={() => {
            console.log('Log In button clicked');
            (document.querySelector('button[data-testid="ockConnectButton"]') as HTMLButtonElement)?.click();
          }}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Log In
        </button>
      )}
      {address && (
        <div className="flex justify-center mt-2">
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default MintCart;
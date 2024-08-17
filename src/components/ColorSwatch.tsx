import React from 'react';
import TransactionWrapper from './TransactionWrapper';
import type { Address } from 'viem';
import WalletWrapper from './WalletWrapper';

interface Color {
  hexCode: string;
  expandedHex: string;
}

interface ColorSwatchProps {
  color: Color;
  address: Address;
  onView: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ address, color, onView }) => {
  return (
    <div className="flex flex-col items-center group">
      <div className="text-sm mb-2">{color.expandedHex}</div>
      <div
        className="w-20 h-20 mb-3 border border-gray-300 cursor-pointer transition-transform group-hover:scale-105"
        style={{ backgroundColor: color.expandedHex }}
        onClick={onView}
        title="Click to view details"
      ></div>
      <button
        onClick={onView}
        className="flex justify-center min-w-[153px] bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl mb-3"
      >
        View
      </button>
      {address ? (
        <TransactionWrapper address={address} color={color} className="w-full" />
      ) : (
        <WalletWrapper
          className="w-20"
          text="Mint"
        />
      )}
    </div>
  );
};

export default ColorSwatch;
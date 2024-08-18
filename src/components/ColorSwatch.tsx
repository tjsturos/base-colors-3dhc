import React from 'react';
import TransactionWrapper from './TransactionWrapper';
import type { Address } from 'viem';
import WalletWrapper from './WalletWrapper';
import { Press_Start_2P } from 'next/font/google';

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
  onView: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ address, color, onView }) => {
  return (
    <div className="flex flex-col items-center group">
      <div className={`text-sm mb-2 uppercase ${pressStart2P.className}`}>
        {color.hexCode.replace('#', '')}
      </div>
      <div
        className="w-20 h-20 mb-3 border border-gray-300 cursor-pointer transition-transform group-hover:scale-105"
        style={{ backgroundColor: color.expandedHex }}
        onClick={onView}
        title="Click to view details"
      ></div>
      <button
        onClick={onView}
        className="flex justify-center min-w-[153px] bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-xl mb-3"
      >
        View
      </button>
      {address ? (
        <TransactionWrapper address={address} color={color} className="w-full mx-2 min-w-[153px]" />
      ) : (
        <WalletWrapper
          className="w-full mx-2 min-w-[153px]"
          text="Mint"
        />
      )}
    </div>
  );
};

export default ColorSwatch;
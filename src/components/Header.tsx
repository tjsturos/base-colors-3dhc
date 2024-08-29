'use client';
import React from 'react';
import Image from 'next/image';
import LoginButton from './LoginButton';
import { useAccount } from 'wagmi';
import WalletWrapper from './WalletWrapper';
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Header() {
  const { address } = useAccount();

  return (
    <header className="w-full bg-gray-100 py-4 pl-0 pr-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/base-colors-3dhc.png" alt="Base Colors 3DHC Logo" width={210} height={70} />
        </div>
        <div className="flex items-center gap-3">
          {address && <WalletWrapper />}
          {!address && <LoginButton />}
        </div>
      </div>
    </header>
  );
}
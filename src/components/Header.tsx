'use client';
import React from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import WalletWrapper from './WalletWrapper';
import LoginButton from './LoginButton';

export default function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="w-full bg-gray-100 py-4 pl-0 pr-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 mr-3">
          <a href="https://basecolors.com">
            <Image src="/base-colors-3dhc.png" alt="Base Colors 3DHC Logo" width={210} height={70} />
          </a>
        </div>
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <WalletWrapper />
            </>
          ) : (
            <>
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
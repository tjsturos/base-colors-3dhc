'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import SignupButton from './SignupButton';
import LoginButton from './LoginButton';
import { useAccount } from 'wagmi';
import Settings from 'src/components/Settings';
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Header() {
  const { address } = useAccount();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [randomSwatchCount, setRandomSwatchCount] = useState(10);

  return (
    <header className="w-full bg-gray-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/icon.svg" alt="Logo" width={48} height={48} />
          <h1 className="text-2xl font-bold flex flex-col items-start">
            <span className="font-sans">Base Colors</span>
            <span className={`text-xl mt-1 ${pressStart2P.className}`}>Abbr Swatches</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Settings
          </button>
          <SignupButton />
          {!address && <LoginButton />}
        </div>
      </div>
      {isSettingsOpen && (
        <Settings 
          onClose={() => setIsSettingsOpen(false)}
          randomSwatchCount={randomSwatchCount}
          setRandomSwatchCount={setRandomSwatchCount}
        />
      )}
    </header>
  );
}
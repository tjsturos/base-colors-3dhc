'use client';
import React from 'react';
import Image from 'next/image';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import WalletWrapper from './WalletWrapper';

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async (connector: any) => {
    await connect({ connector });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <header className="w-full bg-gray-100 py-4 pl-0 pr-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/base-colors-3dhc.png" alt="Base Colors 3DHC Logo" width={210} height={70} />
        </div>
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <WalletWrapper />
            </>
          ) : (
            <div className="relative">
              <button
                data-testid="connect-wallet-button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => document.getElementById('connector-dropdown')?.classList.toggle('hidden')}
              >
                Connect Wallet
              </button>
              <div id="connector-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden" style={{ top: 'calc(100% + 0.5rem)', zIndex: 1000 }}>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
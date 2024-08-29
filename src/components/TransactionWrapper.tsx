'use client';
import React, { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import type { Address, BaseError } from 'viem';
import { abi, mintContractAddress as address, BASE_MAINNET_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID } from 'src/constants';
import { useCart } from 'src/contexts/CartContext';
import { useSettings } from 'src/contexts/SettingsContext';
import LoadingSpinner from './LoadingSpinner';
import { useColors } from 'src/contexts/ColorsContext'; // Assume this context exists
import { NEXT_PUBLIC_ENVIRONMENT } from 'src/config';

// Helper function for debug logging
const debugLog = (...args: any[]) => {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log(...args);
  }
};

type TransactionWrapperParams = {
  className?: string;
  onComplete?: () => void;
};

export default function TransactionWrapper({
  className,
  onComplete,
}: TransactionWrapperParams) {
  const { cart, clearCart } = useCart();
  const { isConnected, address: userAddress } = useAccount();
  const { recipientAddress } = useSettings();
  const { removeColors } = useColors(); // New hook to manage colors
  const [mintToAddress, setMintToAddress] = useState<Address | undefined>(recipientAddress || userAddress);
  const [args, setArgs] = useState<any[]>([]);
  const [functionName, setFunctionName] = useState<string>('mint');

  useEffect(() => {
    setMintToAddress(recipientAddress || userAddress);
  }, [recipientAddress, userAddress]);

  useEffect(() => {
    if (cart.length > 1) {
      setArgs([cart.map(c => c.hexCode), cart.map(c => c.name), BigInt(cart.length), address]);
      setFunctionName('mintBatch');
    } else if (cart.length === 1) {
      setArgs([cart[0].hexCode, cart[0].name, address]);
      setFunctionName('mint');
    } else {
      setArgs([]);
      setFunctionName('mint');
    }
  }, [cart, address]);

  // Debug logging
  useEffect(() => {
    debugLog('Minting to address:', mintToAddress);
  }, [mintToAddress]);

  const mintCost = 0.001;
  const value = parseEther(`${cart.length * mintCost}`);


  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isConfirmed) {
      // Remove minted colors from the display
      removeColors(cart.map(color => color.hexCode));
      clearCart();
      if (onComplete) {
        onComplete();
      }
    }
  }, [isConfirmed, clearCart, onComplete, removeColors, cart]);

  const handleMint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debugLog("args", args);
    debugLog("functionName", functionName);
    debugLog("value", value);
    debugLog("address", address);
    writeContract({
      abi,
      address,
      functionName,
      value,
      args,
      chainId: NEXT_PUBLIC_ENVIRONMENT === 'production' ? BASE_MAINNET_CHAIN_ID : BASE_SEPOLIA_CHAIN_ID
    });
  };

  if (!isConnected) {
    return <div>Please connect your wallet to mint.</div>;
  }

  const buttonText = cart.length > 1 ? `Mint ${cart.length} Colors` : 'Mint';

  return (
    <form onSubmit={handleMint} className={`flex flex-col w-full ${className}`}>
      <button 
        disabled={isPending} 
        type="submit"
        className="mt-0 w-full text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-xl disabled:bg-gray-400 flex items-center justify-center"
      >
        {isPending ? (
          <>
            <LoadingSpinner className="w-4 h-4 mr-2" />
            Confirming...
          </>
        ) : (
          buttonText
        )}
      </button>
      {hash && <div className="text-center">Transaction Hash: {hash}</div>}
      {isConfirming && <div className="text-center">Waiting for confirmation...</div>}
      {isConfirmed && <div className="text-center">Transaction confirmed.</div>}
      {error && (
        <div className="text-center text-red-500">Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </form>
  );
}
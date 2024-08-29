'use client';
import React, { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import type { Address, BaseError } from 'viem';
import { abi, baseColorsAddress as address, BASE_MAINNET_CHAIN_ID } from 'src/constants';
import { useCart } from 'src/contexts/CartContext';
import { useSettings } from 'src/contexts/SettingsContext';
import LoadingSpinner from './LoadingSpinner';
import { useColors } from 'src/contexts/ColorsContext'; // Assume this context exists
import { base } from 'wagmi/chains';

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
  const { isConnected, address: userAddress, chainId: currentChainId } = useAccount();
  const { recipientAddress } = useSettings();
  const { removeColors } = useColors(); // New hook to manage colors
  const [mintToAddress, setMintToAddress] = useState<Address | undefined>(recipientAddress || userAddress);
  const [args, setArgs] = useState<any[]>([]);
  const [functionName, setFunctionName] = useState<string>('mint');

  const { chains, switchChain } = useSwitchChain();
  const [isWrongChain, setIsWrongChain] = useState(false);

  useEffect(() => {
    setIsWrongChain(currentChainId !== BASE_MAINNET_CHAIN_ID);
  }, [currentChainId]);

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


  const { data: hash, error, isPending, writeContract, error: writeContractError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (writeContractError) {
      console.error('Write contract error:', writeContractError);
    }
  }, [writeContractError]);

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

  const handleSwitchChain = async () => {
    try {
      await switchChain({ chainId: BASE_MAINNET_CHAIN_ID });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  const handleMint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isWrongChain) {
      return; // Don't proceed with minting if on wrong chain
    }

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
      chainId: BASE_MAINNET_CHAIN_ID
    });
  };

  if (!isConnected) {
    return <div>Please connect your wallet to mint.</div>;
  }

  const targetChainName = base.name || 'Target Chain';
  const buttonText = isWrongChain 
    ? `Switch to ${targetChainName}`
    : (cart.length > 1 ? `Mint ${cart.length} Colors` : 'Mint');

  return (
    <form onSubmit={handleMint} className={`flex flex-col w-full ${className}`}>
      <button 
        disabled={isPending} 
        type={isWrongChain ? "button" : "submit"}
        onClick={isWrongChain ? handleSwitchChain : undefined}
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
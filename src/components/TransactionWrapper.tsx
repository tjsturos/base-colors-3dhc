'use client';
import React, { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import type { Address, BaseError } from 'viem';
import { abi, baseColorsAddress as address, BASE_MAINNET_CHAIN_ID } from 'src/constants';
import { useCart } from 'src/contexts/CartContext';
import { useSettings } from 'src/contexts/SettingsContext';
import LoadingSpinner from './LoadingSpinner';
import { useColors } from 'src/contexts/ColorsContext';
import { base } from 'wagmi/chains';

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
  const { removeColors } = useColors();
  const [mintToAddress, setMintToAddress] = useState<Address | undefined>(recipientAddress || userAddress);
  const [isWrongChain, setIsWrongChain] = useState(false);

  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setIsWrongChain(currentChainId !== BASE_MAINNET_CHAIN_ID);
  }, [currentChainId]);

  useEffect(() => {
    setMintToAddress(recipientAddress || userAddress);
  }, [recipientAddress, userAddress]);

  const mintCost = 0.001;
  const value = parseEther(`${cart.length * mintCost}`);

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
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

  const handleMint = async () => {
    if (isWrongChain) {
      return;
    }

    const color = cart[0]?.hexCode || '#FF5733'; // Default color if cart is empty
    const name = cart[0]?.name || 'Default Color'; // Default name if cart is empty

    debugLog("Minting:", color, name, mintToAddress);
    writeContract({
      abi,
      address,
      functionName: 'mint',
      args: [color, name, mintToAddress],
      value,
      chainId: BASE_MAINNET_CHAIN_ID
    });
  };

  if (!isConnected) {
    return <div>Please connect your wallet to mint.</div>;
  }

  const targetChainName = base.name || 'Target Chain';
  const buttonText = isWrongChain 
    ? `Switch to ${targetChainName}`
    : 'Mint';

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <button 
        disabled={isPending || cart.length === 0} 
        onClick={isWrongChain ? handleSwitchChain : handleMint}
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
    </div>
  );
}
'use client';
import React, { useEffect, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import type { Address, BaseError } from 'viem';
import { abi, baseColorsAddress as address, BASE_MAINNET_CHAIN_ID, Color } from 'src/constants';
import { useCart } from 'src/contexts/CartContext';
import { useSettings } from 'src/contexts/SettingsContext';
import LoadingSpinner from './LoadingSpinner';
import { useColors } from 'src/contexts/ColorsContext';
import { base } from 'wagmi/chains';
import { resolveEnsName } from 'src/utils';

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
  const { removeColors, removeColor } = useColors();
  const [mintToAddress, setMintToAddress] = useState<Address | undefined>(recipientAddress || userAddress);
  const [isWrongChain, setIsWrongChain] = useState(false);

  const { switchChain } = useSwitchChain();
  const simulateMint = process.env.NEXT_PUBLIC_SIMULATE_MINT === 'true';

  useEffect(() => {
    setIsWrongChain(currentChainId !== BASE_MAINNET_CHAIN_ID);
  }, [currentChainId]);

  useEffect(() => {
    if (recipientAddress?.endsWith('.eth')) {
      resolveEnsName(recipientAddress).then((resolvedAddress) => {
        setMintToAddress(resolvedAddress as Address);
      });
    } else {
      setMintToAddress(userAddress);
    }
  }, [recipientAddress, userAddress]);

  const mintCost = 0.001;
  const value = parseEther(`${cart.length * mintCost}`);

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      handleTransactionConfirmed(cart);
    }
  }, [isConfirmed]);

  const handleSwitchChain = async () => {
    try {
      await switchChain({ chainId: BASE_MAINNET_CHAIN_ID });
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  const handleTransactionConfirmed = async (colors: Color[]) => {
    // Remove color from the context
    removeColors(colors);

    // Call the API to remove the color from the CSV file
    try {
      const response = await fetch('/api/removeColors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colors }),
      });

      if (response.ok) {
        clearCart()
      } else {
        console.error('Failed to remove color from server');
      }
    } catch (error) {
      console.error('Error removing color:', error);
    }
  };

  const handleMint = async () => {
    if (isWrongChain) {
      return;
    }

    if (cart.length === 0) {
      return;
    }

    const colors = cart.length > 1 ? cart.map(item => item.hexCode) : [cart[0]?.hexCode];
    const names = cart.length > 1 ? cart.map(item => item.name.substring(1)) : [cart[0]?.name.substring(1)];

    if (simulateMint) {
      // Simulate minting process
      setTimeout(() => {
        handleTransactionConfirmed(cart)
      }, 2000); // Simulate a 2-second minting process
    } else {
      // Actual minting

      writeContract({
        abi,
        address,
        functionName: cart.length > 1 ? 'mintBatch' : 'mint',
        args: cart.length > 1 ? [colors, names, 1, mintToAddress] : [colors[0], names[0], mintToAddress],
        value,
        chainId: BASE_MAINNET_CHAIN_ID
      });
    }
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
        disabled={(isPending || isConfirming) || cart.length === 0} 
        onClick={isWrongChain ? handleSwitchChain : handleMint}
        className="mt-0 w-full text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-xl disabled:bg-gray-400 flex items-center justify-center"
      >
        {(isConfirming || isPending) ? (
          <>
            <LoadingSpinner className="w-4 h-4 mr-2" />
            Confirming...
          </>
        ) : (
          buttonText
        )}
      </button>
      {simulateMint && <div className="text-center text-yellow-500">Simulated minting is active</div>}
      {hash && <div className="text-center">Transaction Hash: {hash}</div>}
      {isConfirming && <div className="text-center">Waiting for confirmation...</div>}
      {isConfirmed && <div className="text-center">Transaction confirmed.</div>}
      {error && (
        <div className="text-center text-red-500">Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
}
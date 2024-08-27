'use client';
import React from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useEstimateFeesPerGas, useEstimateGas } from 'wagmi';
import { parseEther, encodeFunctionData } from 'viem';
import type { Address, BaseError } from 'viem';
import { baseSepolia, base } from 'wagmi/chains';
import { mintABI, mintContractAddress } from '../constants';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from './LoadingSpinner';

// Helper function for debug logging
const debugLog = (...args: any[]) => {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    console.log(...args);
  }
};

interface Color {
  hexCode: string;
  expandedHex: string;
}

type TransactionWrapperParams = {
  address: Address;
  className?: string;
  onComplete?: () => void;
};

export default function TransactionWrapper({
  address,
  className,
  onComplete,
}: TransactionWrapperParams) {
  const { cart, clearCart } = useCart();
  const { isConnected } = useAccount();

  const args = cart.length > 1 ? 
    [cart.map(c => c.expandedHex), cart.map(c => c.hexCode), BigInt(cart.length), address] : 
    [cart[0].expandedHex, cart[0].hexCode, address];

  const functionName = cart.length > 1 ? 'mintBatch' : 'mint';

  const mintCost = 0.001;
  const mintTotalCost = cart.length * mintCost;

  const { data: feesPerGas } = useEstimateFeesPerGas({
    chainId: process.env.ENVIRONMENT === 'development' ? baseSepolia.id : base.id,
  });

  const { data: estimatedGas } = useEstimateGas({
    to: mintContractAddress,
    value: parseEther(`${mintTotalCost}`),
    data: encodeFunctionData({
      abi: mintABI,
      functionName,
      args,
    }),
  });

  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isConfirmed) {
      clearCart();
      if (onComplete) {
        onComplete();
      }
    }
  }, [isConfirmed, clearCart, onComplete]);

  const handleMint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendTransaction({
      to: mintContractAddress,
      value: parseEther(`${mintTotalCost}`),
      data: encodeFunctionData({
        abi: mintABI,
        functionName,
        args,
      }),
      gas: estimatedGas,
      maxFeePerGas: feesPerGas?.maxFeePerGas,
      maxPriorityFeePerGas: feesPerGas?.maxPriorityFeePerGas,
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
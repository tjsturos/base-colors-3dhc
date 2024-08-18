'use client';
import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import type { Address } from 'viem';
import {
  BASE_MAINNET_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
  mintABI,
  mintContractAddress,
} from '../constants';

interface Color {
  hexCode: string;
  expandedHex: string;
}

type TransactionWrapperParams = {
  address: Address;
  color: Color;
  className?: string;
};

export default function TransactionWrapper({
  address,
  color,
  className,
}: TransactionWrapperParams) {
  const [recipient, setRecipient] = useState<Address>(address);
  const [isConfirmedByUser, setIsConfirmedByUser] = useState(false);
  const { chain } = useAccount();

  useEffect(() => {
    const savedRecipient = localStorage.getItem('recipientAddress');
    if (savedRecipient) {
      setRecipient(savedRecipient as Address);
    }
  }, []);

  const { writeContract, data, isPending: isWritePending } = useWriteContract();

  const { isLoading: isWaiting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: data,
  });

  const handleMint = async () => {
    if (!writeContract) return;
    try {
      await writeContract({
        address: mintContractAddress,
        abi: mintABI,
        functionName: 'mint',
        args: [color.expandedHex, color.expandedHex, recipient],
        value: parseEther('0'), // Adjust if there's a minting cost
      });
    } catch (error) {
      console.error('Error minting:', error);
    }
  };

  const handleConfirmation = () => {
    const confirmMessage = `Are you sure you want to mint this color (${color.hexCode}) to ${recipient}?`;
    if (window.confirm(confirmMessage)) {
      setIsConfirmedByUser(true);
    }
  };

  if (!isConfirmedByUser && recipient !== address) {
    return (
      <div className={`flex w-full ${className}`}>
        <button
          onClick={handleConfirmation}
          className="mt-0 w-full text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-xl"
        >
          Confirm Mint
        </button>
      </div>
    );
  }

  return (
    <div className={`flex w-full ${className}`}>
      <button
        onClick={handleMint}
        disabled={isWritePending || isWaiting}
        className="mt-0 w-full text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-xl disabled:bg-gray-400"
      >
        {isWritePending || isWaiting ? 'Processing...' : 'Mint'}
      </button>
      {isWritePending && (
        <div className="mt-2 text-green-600">
          Transaction submitted! Waiting for confirmation...
        </div>
      )}
      {isConfirmed && (
        <div className="mt-2 text-green-600">
          Transaction confirmed!
        </div>
      )}
    </div>
  );
}
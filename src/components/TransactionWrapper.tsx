'use client';
import React, { useState, useEffect } from 'react';
import { useEstimateGas, useWriteContract, useSimulateContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import type { Address } from 'viem';
import {
  BASE_MAINNET_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
  mintABI,
  mintContractAddress,
} from '../constants';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from './LoadingSpinner';

// Add this near the top of the file
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

// Helper function for debug logging
const debugLog = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

interface Color {
  hexCode: string;
  expandedHex: string;
}

type TransactionWrapperParams = {
  address: Address;
  color: Color;
  className?: string;
  onComplete?: () => void;
};

export default function TransactionWrapper({
  address,
  color,
  className,
  onComplete,
}: TransactionWrapperParams) {
  const [recipient, setRecipient] = useState<Address>(address);
  const [isConfirmedByUser, setIsConfirmedByUser] = useState(false);
  const { cart, clearCart } = useCart();
  const [insufficientFunds, setInsufficientFunds] = useState<string | null>(null);
  const [simulationErrorMessage, setSimulationErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedRecipient = localStorage.getItem('recipientAddress');
    if (savedRecipient) {
      setRecipient(savedRecipient as Address);
    }
  }, []);

  const args = cart.length > 1 ? 
  [
    cart.map(c => c.expandedHex),
    cart.map(c => c.hexCode),
    BigInt(cart.length),
    recipient
  ] : [cart[0].expandedHex, cart[0].hexCode, recipient]

  const functionName = cart.length > 1 ? 'mintBatch' : 'mint';

  const data = cart.length > 1
  ? encodeFunctionData({
      abi: mintABI,
      functionName,
      args
    })
  : encodeFunctionData({
      abi: mintABI,
      functionName,
      args
    });
  
  const mintCost = 0.001;
  const mintTotalCost = cart.length * mintCost;

  const { writeContract, data: writeData, isPending: isWritePending } = useWriteContract();
  const { data: gasEstimate, error: gasEstimateError } = useEstimateGas({
    to: mintContractAddress,
    account: address,
    chainId: process.env.NODE_ENV === 'development' ? BASE_SEPOLIA_CHAIN_ID : BASE_MAINNET_CHAIN_ID,
    data,
    value: parseEther(`${mintTotalCost}`),
  });

  const { isLoading: isWaiting, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });
  const value = parseEther(`${mintTotalCost + Number(gasEstimate ? gasEstimate : 0)}`);

  const { isLoading: isRequesting, isSuccess: isSimulationSuccess, error: simulationError } = useSimulateContract({
    address: mintContractAddress,
    abi: mintABI,
    functionName,
    args,
    value,
  });

  useEffect(() => {
    if (simulationError) {
      const errorMessage = (simulationError as Error).message;
      const insufficientFundsMatch = errorMessage.match(/have 0 want (\d+)/);
      if (insufficientFundsMatch) {
        const wantedWei = BigInt(insufficientFundsMatch[1]);
        const wantedEth = formatEther(wantedWei);
        setInsufficientFunds(wantedEth);
        setSimulationErrorMessage(null);
      } else {
        setInsufficientFunds(null);
        // Extract the specific error message
        const match = errorMessage.match(/ContractFunctionExecutionError: (.*?)\n/);
        const briefErrorMessage = match ? match[1] : 'Unknown error occurred';
        setSimulationErrorMessage(briefErrorMessage);
      }
    } else {
      setInsufficientFunds(null);
      setSimulationErrorMessage(null);
    }
  }, [simulationError]);

  const handleMint = () => {
    debugLog('value', value);
    debugLog('gasEstimate', gasEstimate);
    debugLog('isSimulationSuccess', isSimulationSuccess);
    debugLog('isRequesting', isRequesting);
    debugLog('writeContract', writeContract);
    debugLog('simulationError', simulationError);
    debugLog('gasEstimateError', gasEstimateError);

    if (!writeContract || isRequesting || (!isSimulationSuccess && process.env.NODE_ENV !== 'development' && !DEBUG_MODE)) return;
   
    try {
      writeContract({
        address: mintContractAddress,
        abi: mintABI,
        functionName,
        args,
        value,
      });

      if (cart.length > 0) {
        clearCart();
      }
      if (onComplete) {
        onComplete();
      }
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

  const isButtonDisabled = isWritePending || isWaiting || isRequesting || 
    (!!insufficientFunds || !!simulationErrorMessage) && process.env.NODE_ENV !== 'development';

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

  const buttonText = cart.length > 1 ? `Mint ${cart.length} Colors` : 'Mint';

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <button
        onClick={handleMint}
        disabled={isButtonDisabled}
        className="mt-0 w-full text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-xl disabled:bg-gray-400 flex items-center justify-center"
      >
        {isWritePending || isWaiting ? (
          'Processing...'
        ) : isRequesting ? (
          <>
            <LoadingSpinner className="w-4 h-4 mr-2" />
            Simulating...
          </>
        ) : insufficientFunds ? (
          'Insufficient Funds'
        ) : simulationErrorMessage ? (
          'Simulation Error'
        ) : (
          buttonText
        )}
      </button>
      {insufficientFunds && (
        <div className="mt-2 text-red-600">
          Insufficient funds. You need at least {insufficientFunds} ETH to complete this transaction.
        </div>
      )}
      {simulationErrorMessage && (
        <div className="mt-2 text-red-600">
          {simulationErrorMessage}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-yellow-600">
              (Development mode: You can still click the button to debug)
            </div>
          )}
        </div>
      )}
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
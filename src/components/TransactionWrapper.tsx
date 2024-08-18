'use client';
import React, { useState, useEffect } from 'react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import type { Address, ContractFunctionParameters } from 'viem';
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
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const savedRecipient = localStorage.getItem('recipientAddress');
    if (savedRecipient) {
      setRecipient(savedRecipient as Address);
    }
  }, []);

  const contracts = [
    {
      address: mintContractAddress,
      abi: mintABI,
      functionName: 'mint',
      args: [color.expandedHex, color.expandedHex, recipient],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  const handleConfirmation = () => {
    const confirmMessage = `Are you sure you want to mint this color (${color.hexCode}) to ${recipient}?`;
    if (window.confirm(confirmMessage)) {
      setIsConfirmed(true);
    }
  };

  if (!isConfirmed && recipient !== address) {
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
      <Transaction
        address={address}
        contracts={contracts}
        className="w-full"
        chainId={process.env.NODE_ENV === 'development' ? BASE_SEPOLIA_CHAIN_ID : BASE_MAINNET_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 w-full text-[white] flex-grow" text="Mint" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
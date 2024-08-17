'use client';
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
  const contracts = [
    {
      address: mintContractAddress,
      abi: mintABI,
      functionName: 'mint',
      args: [ color.expandedHex , color.expandedHex , address ],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  return (
    <div className={`flex w-20 ${className}`}>
      <Transaction
        address={address}
        contracts={contracts}
        className="w-20"
        chainId={process.env.NODE_ENV === 'development' ? BASE_SEPOLIA_CHAIN_ID : BASE_MAINNET_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton className="mt-0 mr-auto ml-auto max-w-full text-[white]" text="Mint" />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}

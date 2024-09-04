'use client';
import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { base } from 'wagmi/chains';
import LoadingSpinner from './LoadingSpinner';
import { useAccount } from 'wagmi';

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};

export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
}: WalletWrapperParams) {
  const { address } = useAccount();
  return (
    <div className="flex flex-col w-full">

    <Wallet data-testid="connect-wallet-button">
      <ConnectWallet
        
        withWalletAggregator={withWalletAggregator}
        text={text}
        className={`flex flex-col w-full ${className || ''}`}
      >
        <Avatar className="h-5 w-5" />
        {address ? (
          <>
            <Name 
              chain={base}
              className="sm:text-base text-[0.875rem]  sm:ml-0"
              />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
          Go to Wallet Dashboard
        </WalletDropdownLink>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
        </div>
  );
}
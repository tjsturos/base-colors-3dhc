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
import { baseSepolia, base } from 'wagmi/chains';

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

  return (
    <Wallet>
      <ConnectWallet
        withWalletAggregator={withWalletAggregator}
        text={text}
        className={`w-full flex-grow ${className || ''}`}
      >
        <Avatar className="h-6 w-6 hidden sm:block" />
        <Name 
          chain={process.env.NODE_ENV === 'production' ? base : baseSepolia}
          className="sm:text-base text-[0.875rem] -ml-2 sm:ml-0"
        />
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
  );
}
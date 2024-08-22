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
import { useState } from 'react';
import Settings from 'src/components/Settings';

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
  randomSwatchCount: number;
  setRandomSwatchCount: (count: number) => void;
};

export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
  randomSwatchCount,
  setRandomSwatchCount,
}: WalletWrapperParams) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Wallet>
      <ConnectWallet
        withWalletAggregator={withWalletAggregator}
        text={text}
        className={`w-full flex-grow ${className}`}
      >
        <Avatar className="h-6 w-6" />
        <Name />
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
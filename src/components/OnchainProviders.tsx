'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { NEXT_PUBLIC_CDP_API_KEY } from 'src/config';
import { useWamigConfig } from 'src/wagmi';

interface OnchainProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const OnchainProviders: React.FC<OnchainProvidersProps> = ({ children }) => {

  const wagmiConfig = useWamigConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
        >
          <RainbowKitProvider modalSize="compact">
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default OnchainProviders;
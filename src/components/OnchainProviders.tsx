'use client';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { 
  RainbowKitProvider, 
  getDefaultConfig, 
} from '@rainbow-me/rainbowkit'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { http } from 'wagmi';
 
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css'; 
 
const queryClient = new QueryClient();

if (!process.env.NEXT_PUBLIC_WC_PROJECT_ID) {
  throw new Error('PUBLIC_WALLET_CONNECT_PROJECT_ID is not set');
}

if (!process.env.NEXT_PUBLIC_CDP_API_KEY) {
  throw new Error('PUBLIC_ONCHAINKIT_API_KEY is not set');
}

const wagmiConfig = getDefaultConfig({ 
  appName: 'Base Colors - 3DHC',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/YAUy1IXzOCQZvV0M7QWu9ipCMfdHqTd9"),
  },
  chains: [base],
  ssr: true, 
}); 
 
function OnchainProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
        >
          <RainbowKitProvider 
            modalSize="compact"
            appInfo={{
              appName: 'Base Colors - 3DHC',
              learnMoreUrl: 'https://3dhc.xyz',
            }}
          >
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 
 
export default OnchainProviders;
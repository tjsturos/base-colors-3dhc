'use client';

import { useMemo } from 'react';
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { NEXT_PUBLIC_WC_PROJECT_ID } from './config';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export function useWamigConfig() {
  const projectId = NEXT_PUBLIC_WC_PROJECT_ID ?? '';
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const wagmiConfig = createConfig({
      chains: [base],
      connectors: [
        injected(),
        coinbaseWallet(),
        walletConnect({ projectId }),
      ],
      transports: {
        [base.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}

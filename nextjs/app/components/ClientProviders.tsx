"use client";

import { ReactNode } from "react";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  berachainTestnetbArtio
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import TopNav from "./TopNav";

const config = getDefaultConfig({
  appName: "Irys Testnet Example",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains: [berachainTestnetbArtio],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TopNav />
          <div className="">
            {children}
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
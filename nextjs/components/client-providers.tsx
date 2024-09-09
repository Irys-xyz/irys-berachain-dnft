"use client";

import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { berachainTestnetbArtio } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import TopNav from "./top-nav";

const config = getDefaultConfig({
  appName: "Irys + Berchain dNFT",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,
  chains: [berachainTestnetbArtio],
  ssr: true,
});

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TopNav />
          <div className="">{children}</div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

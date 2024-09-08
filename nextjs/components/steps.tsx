"use client";
import React, { FC } from "react";
import Heading from "./heading";
import { Button } from "./ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { env } from "@/utils/env";

const NETWORK_PARAMS = {
  chainId: (
    "0" + Number(env.NEXT_PUBLIC_BERA_CHAIN_ID).toString(16)
  ).toUpperCase(),
  chainName: "Berachain bArtio",
  rpcUrls: [env.NEXT_PUBLIC_BERA_RPC],
  nativeCurrency: {
    name: "Berachain",
    symbol: "BERA",
    decimals: 18,
  },
  blockExplorerUrls: [env.NEXT_PUBLIC_EXPLORER],
};

const STEPS = [
  {
    title: "Connect to Berachain Testnet",
    paragraph:
      "First, add the Berachain bArtio Testnet to your EVM wallet. This makes sure you're connected to the right network.",
    btn: {
      title: "Add Testnet",
      onClick: async (toast: (arg0: { title: string }) => void) => {
        try {
          if (window.ethereum) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [NETWORK_PARAMS],
            });
            toast({ title: "Berachain bArtio network added!" });
          } else {
            toast({ title: "Wallet not installed!" });
          }
        } catch (error) {
          console.error(error);
          toast({ title: "Failed to add network" });
        }
      },
    },
  },
  {
    title: "Claim Your Free $BERA Tokens",
    paragraph:
      "You'll need $BERA to cover gas fees. Head to the faucet and claim your tokens—it’s quick and free.",
    btn: {
      title: "Bera Faucet",
      onClick: () =>
        window.open("https://bartio.faucet.berachain.com/", "_blank"),
    },
  },
  {
    title: "Mint Your Irys + Bera NFT",
    paragraph:
      "You're ready! Click the button below to mint your exclusive NFT. Minting is free; just cover the gas fees. ",
  },
];

/**
 * Home minting steps
 * @returns {JSX.Element}
 */
const Steps: FC = (): JSX.Element => {
  const { toast } = useToast();

  return (
    <ol className="relative border-s border-[#2A2A2A]">
      {STEPS.map((step, index) => (
        <li className="mb-10 ms-10" key={index}>
          <span className="absolute flex items-center justify-center w-8 h-8 bg-[#2A2A2A] rounded-full -start-4 dark:ring-gray-900 dark:bg-green-900 ring ring-[#2A2A2A]">
            {index + 1}
          </span>
          <Heading level="h4" className="text-white">
            {step.title}
          </Heading>
          <p className="text-[#949494] mt-3">{step.paragraph}</p>
          {step.btn && (
            <Button
              className="mt-4 inline-flex w-32 text-white"
              onClick={() => step.btn.onClick(toast)}
            >
              {step.btn.title}
            </Button>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Steps;

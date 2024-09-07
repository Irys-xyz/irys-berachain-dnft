"use client";
import React, { FC } from "react";
import Heading from "./heading";
import { Button } from "./ui/button";
import { useToast } from "@/components/hooks/use-toast";

const NETWORK_PARAMS = {
  chainId: "0x138D4",
  chainName: "Berachain bArtio",
  rpcUrls: ["https://bartio.rpc.berachain.com/"],
  nativeCurrency: {
    name: "Berachain",
    symbol: "BERA",
    decimals: 18,
  },
  blockExplorerUrls: ["https://bartio.beratrail.io/"],
};

const STEPS = [
  {
    title: "Add Berachain Testnet",
    paragraph:
      "First, add the Berachain bArtio Testnet to your EVM wallet. This ensures you're connected to the right network.",
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
    title: "Claim Free $BERA Tokens",
    paragraph:
      "You'll need a small amount of $BERA to cover the gas fees. Claim your free tokens from the faucet.",
    btn: {
      title: "Bera Faucet",
      onClick: () =>
        window.open("https://bartio.faucet.berachain.com/", "_blank"),
    },
  },
  {
    title: "Mint Your Irys + Bera NFT",
    paragraph:
      "Now, you're ready to mint! Click the button below to mint your unique Irys + Bera NFT. Remember, minting is free; just cover the gas fees.",
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

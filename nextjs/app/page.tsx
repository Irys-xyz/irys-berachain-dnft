"use client";

import Head from "next/head";
import Heading from "./components/heading";
import FlagIcon from "./components/svg/flag-icon";
import TopNav from "./components/top-nav";

const Home = () => {
  const STEPS = [
    {
      title: "Add Berachain Testnet",
      paragraph:
        "First, add the Berachain bArtio Testnet to your EVM wallet. This ensures you're connected to the right network.",
    },
    {
      title: "Claim Free $BERA Tokens",
      paragraph:
        "You'll need a small amount of $BERA to cover the gas fees. Claim your free tokens from the faucet.",
    },
    {
      title: "Mint Your Irys + Bera NFT",
      paragraph:
        "Now, you're ready to mint! Click the button below to mint your unique Irys + Bera NFT. Remember, minting is free; just cover the gas fees.",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center py-16 text-white container">
      <section className="p-8 md:p-12 lg:p-16 text-left">
        <Heading level="h1" className="text-center">
          There&apos;s a New Bera in Town, <br /> And Her Name Is Irys
        </Heading>
        <p className="text-center mt-5 text-customGray">
          Mint your Irys + Bera NFT on Berachain. Join a vibrant community where
          your NFT evolves with you.
        </p>
      </section>
      <section className="grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-6">
          <Heading level="h3">Irys Bear NFT 🐻</Heading>
          <p className="text-customGray mt-4">Lorem ipsum dolor sit amet</p>
          <div className="w-full bg-[#111111] rounded-xl mt-10">
            <div className="py-4 px-5 flex items-center text-customGray gap-2 border-b-[#1C1C1C]">
              <FlagIcon className="text-[#FF8451]" />
              Step-by-Step Minting Guide
            </div>
            <div className="border-t py-4 px-5 flex gap-5 border-[#1C1C1C]">
              <div className="relative flex flex-col items-center">
                {/* Center the line relative to the circles */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-[calc(100%-5rem)] bg-[#181818]"></div>

                <div className="flex flex-col gap-6">
                  <div className="font-bold text-xl rounded-full size-14 grid place-items-center bg-[#181818] mb-4 z-10">
                    1
                  </div>
                  <div className="font-bold text-xl rounded-full size-14 grid place-items-center bg-[#181818] mb-4 z-10">
                    2
                  </div>
                  <div className="font-bold text-xl rounded-full size-14 grid place-items-center bg-[#181818] z-10">
                    3
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                {STEPS.map((step, index) => (
                  <div key={index} className="mb-4">
                    <Heading level="h4">{step.title}</Heading>
                    <p className="text-customGray mt-3">{step.paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full py-3 text-center bg-[#262626] rounded-xl mt-5 font-bold border-[#434343] border cursor-pointer">
            Mint YOUR NFT NOW
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 mt-6 w-full aspect-video">
          <video className="rounded-xl" controls autoPlay>
            <source src="/nft-collab.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
      <section className="mt-28">
        <p className="text-center">
          This project was built using a smart contract on Berachain and NFT
          assets on Irys. NFT metadata is dynamically updated using Irys&apos;s
          Mutable References. The code is open source; you&apos;re welcome to{" "}
          <u>fork the repo</u> and launch your version!
        </p>
      </section>
      <section className="w-full">
        <Heading level="h2" className="text-center mt-16">
          Community NFT
        </Heading>
        <p className="mt-3 text-customGray text-center">
          Mint your Irys + Bera NFT on Berachain. Join a vibrant community.
        </p>

        <div className="grid grid-cols-10 w-full gap-5 mt-20">
          <div className="md:col-span-2 col-span-10 bg-[#111111] h-[366px] w-full rounded-xl"></div>
          <div className="md:col-span-2 col-span-10 bg-[#111111] h-[366px] w-full rounded-xl"></div>
          <div className="md:col-span-2 col-span-10 bg-[#111111] h-[366px] w-full rounded-xl"></div>
          <div className="md:col-span-2 col-span-10 bg-[#111111] h-[366px] w-full rounded-xl"></div>
          <div className="md:col-span-2 col-span-10 bg-[#111111] h-[366px] w-full rounded-xl"></div>
        </div>
      </section>
    </main>
  );
};

export default Home;

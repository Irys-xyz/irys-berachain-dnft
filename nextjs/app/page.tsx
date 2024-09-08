import Steps from "@/components/steps";
import Communities from "@/components/communities";
import Heading from "@/components/heading";
import FlagIcon from "@/components/svg/flag-icon";
import MintNftNowButton from "@/components/mint-nft-now-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Irys the Bera",
  description: "There's a new Bera in town and her name is Irys.",
};

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center pb-16 pt-8 text-white">
      <section className="p-8 md:p-12 lg:p-16 text-left">
        <Heading level="h1" className="text-center">
          There&apos;s a New Bera in Town, <br /> And Her Name Is Irys
        </Heading>
        <p className="text-center mt-5 text-[#949494]">
          Mint your Irys + Bera NFT on Berachain. Join a vibrant community where
          your NFT evolves with you.
        </p>
      </section>
      <section className="grid grid-cols-12 gap-0 md:gap-10 container mt-10 md:mt-16">
        <div className="col-span-12 md:col-span-6">
          <Heading level="h3" className="text-center md:text-start">
            Irys Bear NFT 🐻
          </Heading>
          <p className="text-[#949494] mt-4 text-center md:text-start">
            Lorem ipsum dolor sit amet
          </p>
          <div className="w-full bg-[#111111] rounded-tl-xl rounded-tr-xl mt-10">
            <div className="py-4 px-5 flex items-center text-[#949494] gap-2 border-b-[#1C1C1C]">
              <FlagIcon className="text-[#FF8451]" />
              Step-by-Step Minting Guide
            </div>
          </div>

          <div className="bg-[#111111] px-10 pt-8 pb-1 border-t border-[#2A2A2A]">
            <Steps />
          </div>

          <div className="mt-3">
            <MintNftNowButton />
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 mt-6 w-full aspect-video">
          <video className="rounded-xl" controls autoPlay muted>
            <source src="/nft-collab.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
      <section className="mt-4 md:mt-14 container">
        <p className="text-center max-w-3xl mx-auto my-24">
          This project was built using a smart contract on Berachain and NFT
          assets on Irys. NFT metadata is dynamically updated using Irys&apos;s
          Mutable References. The code is open source; you&apos;re welcome to{" "}
          <a
            href="https://github.com/Irys-xyz/irys-berachain-dnft"
            target="_blank"
          >
            <u>fork the repo</u>
          </a>{" "}
          and launch your version!
        </p>
      </section>
      <section className="relative w-full bg-gradient-to-br from-[#111111] via-transparent to-transparent">
        <Communities locked={true} />
      </section>
    </main>
  );
};

export default Home;

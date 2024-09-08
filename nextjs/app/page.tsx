import Steps from "@/components/steps";
import Communities from "@/components/communities";
import FlagIcon from "@/components/svg/flag-icon";
import MintNftNowButton from "@/components/mint-nft-now-button";
import VideoSection from "@/components/video-section";

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center pb-16 pt-8 text-white">
      <section className="p-8 md:p-12 lg:p-16 text-left">
        <h1 className="text-center max-w-7xl text-4xl md:text-6xl lg:text-6xl font-bold tracking-tight">
          Mint Your Dynamic NFT—Support Your Community, Be Part of the Lore.
        </h1>
        <p className="!text-center mt-10 text-[#949494] max-w-4xl mx-auto text-lg">
          Back the ecosystem project you believe in—your NFT evolves with your
          $BGT, reflecting your growing commitment. Unlock exclusive, hand-drawn
          designs with each evolution. PS. They double as phone lock screens.
        </p>
      </section>
      <section className="grid grid-cols-12 gap-0 md:gap-10 container mt-10 md:mt-16">
        <div className="col-span-12 md:col-span-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-start">
            Mint Your Dynamic Irys + Bera NFT in Just 3 Steps
          </h2>
          <p className="text-[#949494] mt-4 text-center md:text-start">
            Mint Two Exclusive NFTs: The Irys x Berachain Collab and One From
            Your Favorite Ecosystem Partner.
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
        <div className="col-span-12 md:col-span-6 mt-6 w-full">
          <VideoSection />
          {/* <video className="rounded-xl" controls autoPlay muted>
            <source src="/nft-collab.mp4" type="video/mp4" />
          </video> */}
        </div>
      </section>
      <section className="mt-4 md:mt-14 container">
        <p className="text-center max-w-3xl mx-auto my-24 text-lg">
          Built on Berachain and powered by Irys, this NFT evolves with
          you—thanks to Irys&apos;s dynamic Mutable References. This isn&apos;t
          just an NFT drop—it&apos;s a living story of your bArtio growth. And
          with open-source code, you can{" "}
          <a
            href="https://github.com/Irys-xyz/irys-berachain-dnft"
            target="_blank"
          >
            <u>fork</u>
          </a>{" "}
          the repo create your own version!
        </p>
      </section>
      <section className="relative w-full bg-gradient-to-br from-[#111111] via-transparent to-transparent">
        <Communities locked={true} />
      </section>
    </main>
  );
};

export default Home;

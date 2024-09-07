"use client";

import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import IrysInteractiveEye from "./irys-logo";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from "wagmi";
import WalletIcon from "./svg/wallet-icon";
import LogoutIcon from "./svg/logout-icon";
import { FC } from "react";

/**
 * TopNav component
 * @returns {JSX.Element}
 */
const TopNav: FC = (): JSX.Element => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <nav className="bg-background py-3 px-8 flex items-center justify-between bg-black border-b border-[#1C1C1C]">
      <Link href={"/"}>
        <div className="flex-grow flex justify-start">
          <IrysInteractiveEye />
        </div>
      </Link>
      <div className="flex-grow"></div>
      {!isConnected && (
        <div>
          <Button
            className="flex gap-2"
            onClick={openConnectModal}
            variant={"action"}
          >
            <WalletIcon />
            Connect Wallet
          </Button>
        </div>
      )}
      {isConnected && (
        <>
          <div className="flex-grow flex justify-end items-center gap-4">
            <Link href={"/wallet"}>
              <Button className="flex gap-2" variant={"action"}>
                <WalletIcon />
                My NFT
              </Button>
            </Link>
            <button onClick={() => disconnect()}>
              <LogoutIcon className="text-[#515151]" />
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default TopNav;

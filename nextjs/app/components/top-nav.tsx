"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const TopNav = () => {
  return (
    <nav className="bg-background py-3 px-8 flex items-center justify-between bg-pink-400">
      <div className="flex-grow flex justify-start">
        <img src="/irys-wordmark-black.png" width={69} height={36} />
      </div>
      <div className="flex-grow"></div>
      <ul className="flex space-x-8 text-smoky">
        <li className="bg-secondary px-5 py-2 rounded-2xl shadow hover:bg-primary">
          <Link href="/">Home</Link>
        </li>
        <li className="bg-secondary px-5 py-2 rounded-2xl shadow hover:bg-primary">
          <Link href="/mint">Mint</Link>
        </li>
        <li className="bg-secondary px-5 py-2 rounded-2xl shadow hover:bg-primary">
          <Link href="/wallet">Wallet</Link>
        </li>
      </ul>
      <div className="flex-grow flex justify-end">
        <ConnectButton />
      </div>
    </nav>
  );
};

export default TopNav;

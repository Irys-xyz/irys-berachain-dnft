"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAccount } from "wagmi";

type Props = {};

const TABS = [
  {
    title: "Berachain",
    image: "/communities/bera.png",
    value: "berachain",
  },
  {
    title: "Yeet",
    image: "yeet.png",
    value: "yeet",
  },
  {
    title: "The Honey Jar",
    image: "/communities/thehoneyjar.png",
    value: "the-honey-jar",
  },
  {
    title: "Kingdomly",
    image: "/communities/kinkdomly.png",
    value: "kingdomly",
  },
  {
    title: "BeraLand",
    image: "/communities/beraland.png",
    value: "beraland",
  },
];

const Wallet = () => {
  const [currentTab, setCurrentTab] = useState(TABS[0].value);

  const { address, isConnected } = useAccount();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  console.log({ address, isConnected });

  return (
    <div>
      {TABS.map((tab, index) => (
        <Button
          className="rounded-none"
          key={tab.value}
          onClick={() => handleTabChange(tab.value)}
          variant={currentTab === tab.value ? "primary" : "secondary"}
        >
          {tab.title}
        </Button>
      ))}
      {}
    </div>
  );
};

export default Wallet;

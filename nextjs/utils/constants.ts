import { env } from "@/utils/env";

const COMMUNITIES = [
  {
    title: "Beramarket",
    image: "/communities/beramarket.png",
    value: "beramarket",
    description:
      "NFT market place for apes Degens and the like. In Closed Beta.",
    manifest: env.NEXT_PUBLIC_BERAMARKET_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "Yeet",
    image: "/communities/yeet.png",
    value: "yeet",
    description:
      "Home of the most Yeetarded products in the berachain ecosystem. Yeetards only.",
    manifest: env.NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "The Honey Jar",
    image: "/communities/thehoneyjar.png",
    value: "the-honey-jar",
    description: "A Berachain-native community venture studio.",
    manifest: env.NEXT_PUBLIC_THJ_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "Kingdomly",
    image: "/communities/kingdomly.png",
    value: "kingdomly",
    description: "An all in one NFT dApp on Berachain.",
    manifest: env.NEXT_PUBLIC_KINGDOMLY_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "BeraLand",
    image: "/communities/beraland.png",
    value: "beraland",
    description: "The community hub for all things Bera.",
    manifest: env.NEXT_PUBLIC_BERALAND_COMMUNITY_MANIFEST_ID,
  },
] as const;

const ERROR_UPDATE_METADATA_24H =
  "You've already updated your NFT today! Check back tomorrow.";

const METADATA_UPDATED =
  "Metadata updated successfully! Your NFT is evolving—just give it a few seconds to reflect the changes.";

const LEVEL_PERCENT_MAP: Record<number, bigint> = {
  0: BigInt(0),
  1: BigInt(parseInt(env.NEXT_PUBLIC_PERCENT_TO_LEVEL_2 as string, 10)),
  2: BigInt(parseInt(env.NEXT_PUBLIC_PERCENT_TO_LEVEL_3 as string, 10)),
};

export {
  COMMUNITIES,
  ERROR_UPDATE_METADATA_24H,
  LEVEL_PERCENT_MAP,
  METADATA_UPDATED,
};

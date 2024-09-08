import { env } from "process";
import { createPublicClient, http } from "viem";
import { berachainTestnetbArtio } from "viem/chains";

const publicClient = createPublicClient({
  chain: berachainTestnetbArtio,
  transport: http(env.NEXT_PUBLIC_BERA_RPC as string),
});

export default publicClient;

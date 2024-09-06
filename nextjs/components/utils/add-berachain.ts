export const addBerachainTestnet = async () => {
  const networkParams = {
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

  try {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkParams],
      });
      alert("Berachain bArtio network added!");
    } else {
      alert("MetaMask is not installed!");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to add network");
  }
};

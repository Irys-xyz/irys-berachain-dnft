// Imports
// ========================================================
import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { config } from "dotenv";

// Config
// ========================================================
config();

// Tests
// ========================================================
describe("BHoneyNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("BHoneyNFT", [`${process.env.CONTRACT_BASE_URL}`, `${process.env.CONTRACT_DEFAULT_TX_ID}`]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      contract,
      owner,
      otherAccount,
      publicClient,
    };
  }

  /**
   * @dev Deployment tests
   */
  describe("Deployment", function () {
    /**
     * @dev Tests that contract is deployed with default values
     */
    it("Should deploy with default values", async function () {
      // Setup
      const { contract, owner } = await loadFixture(deployContractFixture);

      // Tests
      expect(await contract.address).to.equal('0x5fbdb2315678afecb367f032d93f642f64180aa3');
      expect((await contract.read.owner())?.toString()?.toLowerCase()).to.equal(owner.account.address.toLowerCase());
      expect(await contract.read.name()).to.equal('BHoneyNFT');
      expect(await contract.read.symbol()).to.equal('BHNFT');
    });
  });

  /**
   * @dev Minting tests
   */
  describe("Minting", function () {
    /**
     * @dev Tests that nfts can be minted once
     */
    it("Should mint an NFT", async function () {
      // Setup
      const { owner, contract, otherAccount } = await loadFixture(deployContractFixture);

      // Action
      const contractMint = await hre.viem.getContractAt(
        "BHoneyNFT",
        contract.address,
        { client: { wallet: otherAccount }}
      );

      await contractMint.write.mint();
      await contract.write.mint();

      // Tests
      expect(await contract.read.nftOwned([`${otherAccount.account.address}`])).to.equal(0n);
      expect(await contract.read.tokenURI([0])).to.equal(`${process.env.CONTRACT_BASE_URL}${process.env.CONTRACT_DEFAULT_TX_ID}`);
      expect(await contract.read.nftOwned([`${owner.account.address}`])).to.equal(1n);
      expect(await contract.read.tokenURI([1])).to.equal(`${process.env.CONTRACT_BASE_URL}${process.env.CONTRACT_DEFAULT_TX_ID}`);
    });

    /**
     * @dev Tests that only 1 nft can be minted per address
     */
    it("Should not mint more than one NFT", async function () {
      // Setup
      const { owner, contract, otherAccount } = await loadFixture(deployContractFixture);
      await contract.write.mint();
      await expect(contract.write.mint()).to.be.rejectedWith('You can only own 1 NFT.');
    });
  });
});

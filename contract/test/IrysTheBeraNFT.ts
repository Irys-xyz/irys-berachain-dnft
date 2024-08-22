// Imports
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { config } from "dotenv";

describe("IrysTheBeraNFT", function () {
  // Define a fixture to reuse the same setup in every test.
  async function deployNFTFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const IrysTheBeraNFT = await ethers.deployContract("IrysTheBeraNFT", [process.env.CONTRACT_BASE_URL]);
    await IrysTheBeraNFT.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { IrysTheBeraNFT, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should deploy with the correct name and symbol", async function () {
      const { IrysTheBeraNFT } = await loadFixture(deployNFTFixture);

      expect(await IrysTheBeraNFT.name()).to.equal("IrysTheBeraNFT");
      expect(await IrysTheBeraNFT.symbol()).to.equal("IBERA");
    });
  });

  describe("Minting NFTs", function () {
    it("Should mint a Main NFT and track ownership", async function () {
      const { IrysTheBeraNFT, addr1 } = await loadFixture(deployNFTFixture);

      await IrysTheBeraNFT.connect(addr1).mintMainNFT();
      const tokenId = await IrysTheBeraNFT.nftOwned(addr1.address);
      const tokenURI = await IrysTheBeraNFT.tokenURI(tokenId);

      expect(tokenURI).to.equal(process.env.CONTRACT_BASE_URL+"NOT_SET");
      expect(await IrysTheBeraNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await IrysTheBeraNFT.hasMintedMainNFT(addr1.address)).to.be.true;
    });

    it("Should not allow minting a second Main NFT", async function () {
      const { IrysTheBeraNFT, addr1 } = await loadFixture(deployNFTFixture);

      await IrysTheBeraNFT.connect(addr1).mintMainNFT();
      await expect(IrysTheBeraNFT.connect(addr1).mintMainNFT()).to.be.revertedWith(
        "You have already minted the Main NFT."
      );
    });

    it("Should mint a Community NFT and track ownership", async function () {
      const { IrysTheBeraNFT, addr1 } = await loadFixture(deployNFTFixture);

      await IrysTheBeraNFT.connect(addr1).mintCommunityNFT();
      const tokenId = await IrysTheBeraNFT.nftOwned(addr1.address);
      const tokenURI = await IrysTheBeraNFT.tokenURI(tokenId);

      expect(tokenURI).to.equal(process.env.CONTRACT_BASE_URL+"NOT_SET");
      expect(await IrysTheBeraNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await IrysTheBeraNFT.hasMintedCommunityNFT(addr1.address)).to.be.true;
    });

    it("Should not allow minting a second Community NFT", async function () {
      const { IrysTheBeraNFT, addr1 } = await loadFixture(deployNFTFixture);

      await IrysTheBeraNFT.connect(addr1).mintCommunityNFT();
      await expect(IrysTheBeraNFT.connect(addr1).mintCommunityNFT()).to.be.revertedWith(
        "You have already minted a Community NFT."
      );
    });
  });

  describe("Token URI Management", function () {
    it("Should allow the owner to update the token URI", async function () {
      const { IrysTheBeraNFT, owner, addr1 } = await loadFixture(deployNFTFixture);

      await IrysTheBeraNFT.connect(addr1).mintMainNFT();

      const tokenId = await IrysTheBeraNFT.nftOwned(addr1.address);
      const newURI = "FOOBAR";
      await IrysTheBeraNFT.connect(owner).updateTokenURI(tokenId, newURI);
      const updatedURI = await IrysTheBeraNFT.tokenURI(tokenId);
 
      expect(updatedURI).to.equal(process.env.CONTRACT_BASE_URL+newURI);
    });
  });

  describe("Transfer and Approval Restrictions", function () {
    it("Should revert transfer and approval attempts", async function () {
      const { IrysTheBeraNFT, addr1, addr2 } = await loadFixture(deployNFTFixture);

      await IrysTheBeraNFT.connect(addr1).mintMainNFT();
      const tokenId = await IrysTheBeraNFT.nftOwned(addr1.address);

      await expect(
        IrysTheBeraNFT.connect(addr1).approve(addr2.address, tokenId)
      ).to.be.revertedWith("Cannot transfer.");

      await expect(
        IrysTheBeraNFT.connect(addr1).setApprovalForAll(addr2.address, true)
      ).to.be.revertedWith("Cannot transfer.");

      await expect(
        IrysTheBeraNFT.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId)
      ).to.be.revertedWith("Cannot transfer.");

      await expect(
        IrysTheBeraNFT.connect(addr1).safeTransferFrom(addr1.address, addr2.address, tokenId)
      ).to.be.revertedWith("Cannot transfer.");

    });
  });
});

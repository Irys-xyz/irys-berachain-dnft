# Berachain Irys BHoneyNFT Contract 

![](../assets/banner-4.jpg)

## Description

The **IrysTheBeraNFT** contract is an ERC721 NFT contract that allows users to mint up to two NFTs per wallet: one main NFT and one community NFT. 

The dynamic nature of these NFTs is enabled through [Irys's mutability features](https://docs.irys.xyz/build/d/features/mutability), allowing the NFT metadata to evolve based on the user's BGT token balance.

> This contract can be replaced or extended with any standard ERC721 implementation.

## Unique Features

- **Two NFTs per Wallet**: Users can mint two NFTs: a main NFT (`mintMainNFT()` function) and a community NFT (`mintCommunityNFT()` function). Each wallet is restricted to minting exactly one of each.
- **Soulbound NFTs**: The NFTs are non-transferable.
- **Dynamic Metadata**: When minting, the user's BGT token balance is snapshotted and stored onchain, allowing the NFT's metadata to evolve as their balance changes. The metadata URL is initially set to `"NOT_SET"` and is dynamically updated later through an offchain action.
- **Integration with BGT Token**: When deploying the contract, the address of the BGT token must be provided. The contract tracks each user's BGT balance at the time of minting, and the NFT evolves based on these values.


## Requirements

- NodeJS `v20.11.0` or greater
- Wallet With bArtrio Berachain - (See [Berachain Faucet](https://bartio.faucet.berachain.com/))

## Quick Start

### 1 - Install Dependencies

```bash
# FROM: ./apps/contract

pnpm install;
```

### 2 - Add Environment Variables

```bash
# FROM: ./apps/contract

cp .env.example .env;
```

Replace this value

**File:** `./apps/contract/.env`

```bash
# Contracts and wallets"
WALLET_PRIVATE_KEY="<0xYOUR_WALLET_PRIVATE_KEY>"
```

### 3 - Run Deployment

```bash
# FROM: ./apps/contract

pnpm deploy:berachain;

```

## Verify Contract

```bash
# FROM: ./apps/contract

pnpm verify:berachain 0xD06d8FD4632003D54d78EAfFe9D444B3c80Fb3E3 "0xbDa130737BDd9618301681329bF2e46A016ff9Ad"

```

## Run Tests

```bash
# FROM: ./apps/contract

pnpm test;

```

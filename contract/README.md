# Berachain Irys BHoneyNFT Contract Script

Main BHoneyNFT contract that is an ERC721.

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

# [Expected Prompts & Outputs]:
# ✔ Confirm deploy to network berachainTestnet (80085)? … yes
# Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
#   --> contracts/BHoneyNFT.sol:72:9:
#    |
# 72 |         address _to,
#    |         ^^^^^^^^^^^
# 
# 
# Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
#   --> contracts/BHoneyNFT.sol:73:9:
#    |
# 73 |         uint256 _tokenId
#    |         ^^^^^^^^^^^^^^^^
# 
# 
# Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
#   --> contracts/BHoneyNFT.sol:80:9:
#    |
# 80 |         address _operator,
#    |         ^^^^^^^^^^^^^^^^^
# 
# 
# Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
#   --> contracts/BHoneyNFT.sol:81:9:
#    |
# 81 |         bool _approved
#    |         ^^^^^^^^^^^^^^
# 
# 
# Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
#   --> contracts/BHoneyNFT.sol:88:9:
#    |
# 88 |         address _owner,
#    |         ^^^^^^^^^^^^^^
# 
# 
# Warning: Unused function parameter. Remove or comment out the variable name to silence this warning.
#   --> contracts/BHoneyNFT.sol:89:9:
#    |
# 89 |         address operator
#    |         ^^^^^^^^^^^^^^^^
# 
# 
# Compiled 17 Solidity files successfully (evm target: paris).
# Hardhat Ignition 🚀
# 
# Deploying [ BHoneyNFTModule ]
# 
# Batch #1
#   Executed BHoneyNFTModule#BHoneyNFT
# 
# [ BHoneyNFTModule ] successfully deployed 🚀
# 
# Deployed Addresses
# 
# BHoneyNFTModule#BHoneyNFT - 0x9d7Ef808f88b1E7829AbC8DD2187C41Eb6005B8a
```

## Verify Contract

```bash
# FROM: ./apps/contract

pnpm verify:berachain 0x9d7Ef808f88b1E7829AbC8DD2187C41Eb6005B8a "https://gateway.irys.xyz/mutable/"

# [Expected Output]:
# Successfully submitted source code for contract
# contracts/BHoneyNFT.sol:BHoneyNFT at 0x9d7Ef808f88b1E7829AbC8DD2187C41Eb6005B8a
# for verification on the block explorer. Waiting for verification result...
#
# Successfully submitted source code for contract
# contracts/BHoneyNFT.sol:BHoneyNFT at 0x9d7Ef808f88b1E7829AbC8DD2187C41Eb6005B8a
# for verification on the block explorer. Waiting for verification result...
# 
# Successfully verified contract BHoneyNFT on the block explorer.
# https://artio.beratrail.io/address/0x9d7Ef808f88b1E7829AbC8DD2187C41Eb6005B8a#code
# !!! NOTE: Should be: https://artio.beratrail.io/address/0x9d7Ef808f88b1E7829AbC8DD2187C41Eb6005B8a/contract/80085/code
```

## Run Tests

```bash
# FROM: ./apps/contract

pnpm test;

# [Expected Output]:
#   BHoneyNFT
#     Deployment
#       ✔ Should deploy with default values (287ms)
#     Minting
#       ✔ Should mint an NFT
#       ✔ Should not mint more than one NFT
# 
# 
#   3 passing (303ms)
```

# Next.js Front-End for IrysTheBeraNFT

This repository provides the front-end for interacting with the **IrysTheBeraNFT** smart contract. It includes functions for minting NFTs and updating their metadata. 

> The full UI is provided, but this README focuses specifically on the aspects related to creating and mutating the NFTs.

## Prerequisites

- **Node.js** `v20.11.0` or greater
- **WalletConnect Project ID**: Obtain a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

## Setup

1. **Clone the repository**:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Configure environment variables**:

Rename  `.env.local.example` file to `.env.local` and fill in the required values:

```bash
mv .env.local.example .env.local
```

Important values include:

- `PRIVATE_KEY`: Private key used to deploy the smart contract.
- `NEXT_PUBLIC_BERA_RPC`: RPC URL for Berachain or any other chain you are using.
- `NEXT_PUBLIC_WALLET_CONNECT_ID`: Your WalletConnect Project ID.

> Ensure your PRIVATE_KEY matches the one used in the deployment of the smart contract, as it is required to update NFT metadata through API routes (`updateTokenURI()` function).

## Running the Project

To start the development server:

```bash
pnpm dev
```

## Key Features

- **Mint NFTs Directly**: Users can mint their NFTs via the provided UI, using the `MintNftNowButton` component.
- **Dynamic Metadata Creation and Mutation**:
  - The initial metadata is created through an API route (`/api/initialize-metadata`).
  - Metadata is updated and mutated using the `/api/update-metadata` route.

## Wallet Integration

- [RainbowKit](https://www.rainbowkit.com/) is used for wallet connections.
- [viem v2](https://viem.sh/) is utilized for smart contract interactions.

## NextJS API Endpoints

`api/initialize-metadata/route.ts`
Initializes metadata for a new NFT:
- Function: POST `/api/initialize-metadata`
- Description: Creates initial metadata for a given tokenId. Checks if the metadata already exists and, if not, generates and uploads the metadata to Irys before posting to the smart contract.

`api/update-metadata/route.ts`
Updates the metadata for an existing NFT:
- Function: POST `/api/update-metadata`
- Description: Fetches the BGT balance for the user, calculates the required balance for the next level, and updates the metadata if conditions are met.

## Additional Components

`components/mint-nft-now-button.tsx`: Provides a button component for minting NFTs directly through the front end. Handles wallet connections using RainbowKit.

## Contract Integration

The contract ABI is included in the `contract` directory. If you're using a different smart contract, you must replace the ABI.

## Environment Configuration

The environment file (`.env.local`) should be configured with the following values:

```bash
PRIVATE_KEY=""

# Berachain info
BERA_CHAIN_ID=80084
NEXT_PUBLIC_BERA_RPC="https://bartio.rpc.berachain.com"
NEXT_PUBLIC_BGT_CONTRACT_ADDRESS="0xbDa130737BDd9618301681329bF2e46A016ff9Ad"
NEXT_PUBLIC_EXPLORER="https://bartio.beratrail.io"

# Irys info
NEXT_PUBLIC_IRYS_GATEWAY="https://gateway.irys.xyz"
NEXT_PUBLIC_WALLET_CONNECT_ID="9276ae6450c7f76ac51f4cfcea6fd7bf"
```

> Note: The PRIVATE_KEY must be the same as the one used to deploy the smart contract. This key is used in server routes to update the NFT metadata (`updateTokenURI()` function), which is restricted to the contract owner.


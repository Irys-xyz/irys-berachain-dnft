// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Imports
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


/**
 * For BGT Contract to allow checking the current balance of an address
 */
interface ERC20Basic {
    function balanceOf(address account) external view returns (uint256);
}

/// @title IrysTheBeraNFT is soulbound ERC721 token with some extra functions to update the token uri
/// @author @codingwithmanny @lukecd
/// @notice Basic soulbound erc721 token
/// @dev An ERC721 token that is limited to one per address
contract IrysTheBeraNFT is ERC721, ERC721URIStorage, Ownable {
    // state vars
    // ========================================================
    /// @dev 
    address private BGT_ADDRESS;

    /// @dev to keep track of what the next tokenId to mint
    uint256 private _nextTokenId;

    /// @dev to keep track of the owner's token ids
    mapping(address => uint256[]) public nftOwned;

    /// @dev to track if an address has minted a Main NFT
    mapping(address => bool) public hasMintedMainNFT;

    /// @dev to track if an address has minted a Community NFT
    mapping(address => bool) public hasMintedCommunityNFT;

    // @dev to track if an address has minted a Community NFT
    mapping(address => uint256) public addressToBgtAmount;

    // functions
    // ========================================================
    /// @dev Main constructor that sets the owner to the deployer
    constructor(address bgtAddress) ERC721("IrysTheBeraNFT", "IBERA") Ownable(msg.sender) {
      BGT_ADDRESS = bgtAddress;
    }

    // - external
    /// @dev Main minting function for the Main NFT that allows each wallet to mint exactly 1 Main NFT
    function mintMainNFT() external {
        require(!hasMintedMainNFT[msg.sender], "You have already minted the Main NFT.");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, "NOT_SET"); // Placeholder URI, real URI will be set externally
        
        hasMintedMainNFT[msg.sender] = true;

        uint256 balance = ERC20Basic(BGT_ADDRESS).balanceOf(msg.sender);
        addressToBgtAmount[msg.sender] = balance;

        nftOwned[msg.sender].push(tokenId);  // Track the new tokenId
    }

    /// @dev Main minting function for the Community NFT that allows each wallet to mint exactly 1 Community NFT
    function mintCommunityNFT() external {
        require(!hasMintedCommunityNFT[msg.sender], "You have already minted a Community NFT.");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, "NOT_SET"); // Placeholder URI, real URI will be set externally
        
        hasMintedCommunityNFT[msg.sender] = true;
        uint256 balance = ERC20Basic(BGT_ADDRESS).balanceOf(msg.sender);
        addressToBgtAmount[msg.sender] = balance;

        nftOwned[msg.sender].push(tokenId);  // Track the new tokenId
    }   

    /// @dev Getter function to retrieve the BGT amount at mint for a specific address
    function getBgtAtMintAmount(address account) external view returns (uint256) {
        return addressToBgtAmount[account];
    }

    /// @dev Handles updating the tokenURI by the owner allow for tokenId urls to be dynamic
    function updateTokenURI(
        uint256 tokenId,
        string memory txUri
    ) external onlyOwner {
        _requireOwned(tokenId);
        _setTokenURI(tokenId, txUri);
    }

    // - public
    /// @dev Override to fulfill tokenURI
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /// @dev Main support for interfaces
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @dev Override to discourage being called
    function approve(
        address _to,
        uint256 _tokenId
    ) public pure override(ERC721, IERC721) {
        revert("Cannot transfer.");
    }

    /// @dev Override to discourage being called
    function setApprovalForAll(
        address _operator,
        bool _approved
    ) public pure override(ERC721, IERC721) {
        revert("Cannot transfer.");
    }

    /// @dev Override to discourage being called
    function isApprovedForAll(
        address _owner,
        address operator
    ) public pure override(ERC721, IERC721) returns (bool) {
        revert("Cannot transfer.");
    }

    // - internal
    /// @dev override _update to only allow transfers from 0x0 and also keep track of the nft tokenId owner address
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
      require(_ownerOf(tokenId) == address(0), "Cannot transfer.");
      address from = super._update(to, tokenId, auth);
      // Added additionally to keep track
      nftOwned[to].push(tokenId);
      return from;
    }

    /// @dev Base URI for Irys Mutable References
    function _baseURI() internal view override returns (string memory) {
        return "https://testnet-gateway.irys.xyz/mutable/";
    }

    /// @dev Function to get all token IDs owned by an address
    function getTokensOwnedBy(address owner) external view returns (uint256[] memory) {
        return nftOwned[owner];
    }
}

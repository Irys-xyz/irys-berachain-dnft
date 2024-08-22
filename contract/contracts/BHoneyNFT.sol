// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Imports
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title BHoneyNFT is soulbound ERC721 token with some extra functions to update the token uri
/// @author @codingwithmanny
/// @notice Basic soulbound erc721 token
/// @dev An ERC721 token that is limited to one per address
contract BHoneyNFT is ERC721, ERC721URIStorage, Ownable {
    // state vars
    // ========================================================
    /// @dev 
    string private _baseURIPrefix = "";

    /// @dev to keep track of what the next tokenId to mint
    uint256 private _nextTokenId;

    /// @dev to keep track of the owner's token id
    mapping(address owner => uint256) public nftOwned;

    // functions
    // ========================================================
    /// @dev Main constructor that sets the owner to the deployer
    constructor(string memory baseURIPrefix_) ERC721("BHoneyNFT", "BHNFT") Ownable(msg.sender) {
      _baseURIPrefix = baseURIPrefix_;
    }

    // - external
    /// @dev Main minting function that allows the wallet address to only mint 1 nft
    function mint() external {
        require(balanceOf(msg.sender) == 0, "You can only own 1 NFT.");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, "NOT_SET");
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
      nftOwned[to] = tokenId;
      return from;
    }

    /// @dev Base URI for Iryx Mutable References
    function _baseURI() internal view override returns (string memory) {
        return _baseURIPrefix; // return "https://gateway.irys.xyz/mutable/";
    }
}

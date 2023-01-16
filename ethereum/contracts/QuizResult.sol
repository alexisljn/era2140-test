// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract QuizResult is Ownable, ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string private _baseUri;

    bytes32 public merkleRoot;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) Ownable() ERC721(name_, symbol_) {
        _baseUri = baseURI_;
        _tokenIds.increment();
    }

    function _baseURI() internal override view returns(string memory) {
        return _baseUri;
    }

    function setMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        merkleRoot = merkleRoot_;
    }

    function mint(bytes32[] calldata merkleProof_) external view returns(uint8) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        require(MerkleProof.verify(merkleProof_, merkleRoot, leaf), 'Not allowed to mint token');

        return 10;
    }
}

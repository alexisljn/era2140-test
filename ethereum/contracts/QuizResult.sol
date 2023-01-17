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

    struct Scores {
        uint8 lastScore;
        uint8 bestScore;
        uint8 lastTime;
        uint8 bestTime;
    }

    mapping(address => Scores) public scores;

    event ScoresUpdated(address player);

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

    function updateScores(bytes32 merkleRoot_, address player, uint8 lastScore, uint8 lastTime) external onlyOwner {
        setMerkleRoot(merkleRoot_);

        Scores storage score = scores[player];

        score.lastScore = lastScore;

        if (lastScore > score.bestScore) {
            score.bestScore = lastScore;
        }

        score.lastTime = lastTime;

        if (score.bestTime == 0 || lastTime < score.bestTime) {
            score.bestTime = lastTime;
        }

        emit ScoresUpdated(player);
    }

    function setMerkleRoot(bytes32 merkleRoot_) internal onlyOwner {
        merkleRoot = merkleRoot_;
    }

    function mint(bytes32[] calldata merkleProof_) external view returns(uint8) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        require(MerkleProof.verify(merkleProof_, merkleRoot, leaf), 'Not allowed to mint token');

        return 10;
    }
}

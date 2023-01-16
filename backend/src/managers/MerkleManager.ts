import {MerkleTree} from "merkletreejs";
import {keccak256} from "ethers/lib/utils";
import {formatAddressWithChecksum} from "../utils/Utils";

export interface MerkleTreeAddresses {
    [address: string]: boolean;
}
export const addresses: MerkleTreeAddresses = {};

function isAddressInMerkleTree(address: string) {
    try {
        const formattedAddress = formatAddressWithChecksum(address);

        return addresses[formattedAddress];
    } catch (e) {
        throw new Error('invalid address');
    }
}

function addAddressToMerkleTree(address: string) {
    try {
        const formattedAddress = formatAddressWithChecksum(address);

        addresses[formattedAddress] = true;
    } catch (e) {
        throw new Error('invalid address');
    }
}

function generateMerkleTree() {
    const leafNodes = generateLeafNodes();

    return new MerkleTree(leafNodes, keccak256, {sort: true});
}

function generateLeafNodes() {
    return Object.keys(addresses).map((address) => (
        keccak256(address)
    ));
}

export {addAddressToMerkleTree, generateMerkleTree, isAddressInMerkleTree}
import {MerkleTree} from "merkletreejs";
import {keccak256} from "ethers/lib/utils";
import {formatAddressWithChecksum} from "../utils/Utils";
import {ethers} from "ethers";

export interface MerkleTreeAddresses {
    [address: string]: boolean;
}

/* Initialized because merkletreejs can't handle merkle proof with "one-leaf-merkle-tree" */
export const addresses: MerkleTreeAddresses = {[ethers.constants.AddressZero]: true}; // Initiate with one value

function isAddressInMerkleTree(address: string) {
    try {
        const formattedAddress = formatAddressWithChecksum(address);

        return addresses[formattedAddress];
    } catch (e: any) {
        throw new Error('invalid address');
    }
}

function addAddressToMerkleTree(address: string) {
    try {
        const formattedAddress = formatAddressWithChecksum(address);

        addresses[formattedAddress] = true;
    } catch (e: any) {
        throw new Error('invalid address');
    }
}

function generateMerkleTree() {
    const leafNodes = generateLeafNodes();

    return new MerkleTree(leafNodes, keccak256, {sort: true, duplicateOdd: true});
}

function generateLeafNodes() {
    return Object.keys(addresses).map((address) => (
        generateSingleLeaf(address)
    ));
}

function generateSingleLeaf(address: string) {
    return keccak256(address);
}

export {addAddressToMerkleTree, generateMerkleTree, isAddressInMerkleTree, generateSingleLeaf}
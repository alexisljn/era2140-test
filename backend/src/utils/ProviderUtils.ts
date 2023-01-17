import {Contract, ethers, providers, Signer} from "ethers";
import CONTRACT_ABI_JSON from "../artifacts/contracts/QuizResult.sol/QuizResult.json";

let provider: providers.Provider | null = null;

let wallet: Signer | null = null;

let contract: Contract | null = null;

function initiateProvider() {
    try {
        String(process.env.NODE_ENV === "development")
            ? provider = ethers.getDefaultProvider(String(process.env.NETWORK_NAME))
            : provider = ethers.getDefaultProvider(String(process.env.NETWORK_NAME), {infura: String(process.env.INFURA_KEY)})
        ;

        wallet = new ethers.Wallet(String(process.env.PRIVATE_KEY), provider);

        contract = new ethers.Contract(String(process.env.CONTRACT_ADDRESS), CONTRACT_ABI_JSON.abi, wallet);

        console.log("Provider, wallet and contract has been successfully initiated"); // Server logging
    } catch (e) {
        console.error(e) // Server logging
    }
}

async function updateScores(merkleRoot: string, address: string, lastScore: number, lastTime: number) {
    if (!contract) {
        throw new Error("contract not instanced");
    }

    await contract.updateScores(merkleRoot, address, lastScore, lastTime);
}

export {initiateProvider, updateScores}
import {BigNumber, Contract, ethers, providers, Signer} from "ethers";
import CONTRACT_ABI_JSON from "../artifacts/contracts/QuizResult.sol/QuizResult.json";
import {generateMetadata, postMetadata} from "./FirebaseUtil";

let provider: providers.Provider | null = null;

let wallet: Signer | null = null;

let contract: Contract | null = null;

function initializeProvider() {
    try {
        String(process.env.NODE_ENV) === "development"
            ? provider = ethers.getDefaultProvider(String(process.env.NETWORK_NAME))
            : provider = new ethers.providers.InfuraProvider(String(process.env.NETWORK_NAME), String(process.env.INFURA_KEY))
        ;

        wallet = new ethers.Wallet(String(process.env.PRIVATE_KEY), provider);

        contract = new ethers.Contract(String(process.env.CONTRACT_ADDRESS), CONTRACT_ABI_JSON.abi, wallet);

        listenToMintEvent(contract);

        console.log("Provider, wallet and contract has been successfully initiated"); // Server logging
    } catch (e: any) {
        console.error(e) // Server logging
    }
}

async function updateScores(merkleRoot: string, address: string, lastScore: number, lastTime: number) {
    if (!contract) {
        throw new Error("contract not instanced");
    }

    await contract.updateScores(merkleRoot, address, lastScore, lastTime);
}

function listenToMintEvent(contract: Contract) {
    contract.on('Transfer', transferHandler);
}

async function transferHandler(from: string, to: string, tokenId: BigNumber) {
    try {
        const score = await contract.scores(to);

        const metadata = await generateMetadata(score['lastScore'], score['lastTime']);

        await postMetadata(metadata, tokenId);
    } catch (e) {
        console.error(e) // Server logging
    }

}

export {initializeProvider, updateScores}
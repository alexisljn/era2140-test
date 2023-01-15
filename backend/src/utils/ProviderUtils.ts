import {ethers, providers, Signer} from "ethers";

let provider: providers.Provider | null = null;

let wallet: Signer | null = null;

function initiateProvider() {
    try {
        String(process.env.NODE_ENV === "development")
            ? provider =  ethers.getDefaultProvider(String(process.env.NETWORK_NAME))
            : provider = ethers.getDefaultProvider(String(process.env.NETWORK_NAME), {infura: String(process.env.INFURA_KEY)})
        ;

        wallet = new ethers.Wallet(String(process.env.PRIVATE_KEY), provider);

        console.log("Provider and wallet has been successfully initiated"); // Server logging
    } catch (e) {
        console.error(e) // Server logging
    }
}

export {initiateProvider}
import CONTRACT_ABI_JSON from "../artifacts/contracts/QuizResult.sol/QuizResult.json";
import {Contract, ethers, providers} from "ethers";

function getContract(provider: providers.Web3Provider) {
    return new ethers.Contract(String(process.env.REACT_APP_CONTRACT_ADDRESS), CONTRACT_ABI_JSON.abi, provider.getSigner());
}

async function getOnChainScores(contract: Contract, address: string) {
    return await contract.scores(address);
}

export {getContract, getOnChainScores}
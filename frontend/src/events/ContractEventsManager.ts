import {Contract} from "ethers";

const CONTRACT_EVENT = "contractEvent";

function listenContractEvents(contract: Contract) {
    contract.on('ScoresUpdated', scoresUpdatedHandler);
}

function cleanContractEvents(contract: Contract) {
    contract.off('ScoresUpdated', scoresUpdatedHandler);
}

function scoresUpdatedHandler() {

}

export {listenContractEvents, cleanContractEvents}
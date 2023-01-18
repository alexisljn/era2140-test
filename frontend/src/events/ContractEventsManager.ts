import {Contract} from "ethers";

const CONTRACT_EVENT = "contractEvent";

function listenContractEvents(contract: Contract) {
    contract.on('ScoresUpdated', scoresUpdatedHandler);
}

function cleanContractEvents(contract: Contract) {
    contract.off('ScoresUpdated', scoresUpdatedHandler);
}

function scoresUpdatedHandler(player: string) {
    const event = new CustomEvent(CONTRACT_EVENT, {
        detail: {
            type: 'scoresUpdated',
            value: player
        }
    });

    window.dispatchEvent(event);
}

export {listenContractEvents, cleanContractEvents, CONTRACT_EVENT}
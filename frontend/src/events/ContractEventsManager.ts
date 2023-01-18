import {BigNumber, Contract} from "ethers";

const CONTRACT_EVENT = "contractEvent";

function listenContractEvents(contract: Contract) {
    contract.on('ScoresUpdated', scoresUpdatedHandler);

    contract.on('Transfer', transferHandler);
}

function cleanContractEvents(contract: Contract) {
    contract.off('ScoresUpdated', scoresUpdatedHandler);

    contract.off('Transfer', transferHandler);
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

function transferHandler(from: string, to: string, tokenId: BigNumber) {
    const event = new CustomEvent(CONTRACT_EVENT, {
        detail: {
            type: 'transfer',
            value: {to, tokenId}
        }
    });

    window.dispatchEvent(event);
}

export {listenContractEvents, cleanContractEvents, CONTRACT_EVENT}
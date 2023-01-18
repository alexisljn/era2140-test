import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "../../../App";
import {MintStatuses} from "../../../types/MintStatuses";
import {CONTRACT_EVENT} from "../../../events/ContractEventsManager";

function Mint() {

    const {contract, address} = useContext(AppContext);

    const [mintStatus, setMintStatus] = useState<MintStatuses>('wait');

    const handleLocallyContractEvents = useCallback((e: any) => {
        switch (e.detail.type) {
            case 'scoresUpdated':
                if (e.detail.value === address) {
                    setMintStatus('can-mint');
                }
                break;
            case 'transfer':
                // setMintStatus(has)
        }
    }, [address]);

    useEffect(() => {
        window.addEventListener(CONTRACT_EVENT, handleLocallyContractEvents);

        return () => {
            window.removeEventListener(CONTRACT_EVENT, handleLocallyContractEvents);
        }
    }, [])


    if (mintStatus === 'wait') {
        return (
            <div>Mint will be available in few seconds...</div>
        )
    }

    if (mintStatus === 'can-mint') {
        return (
            <button className="btn primary">Mint my certificate</button>
        )
    }

    if (mintStatus === 'has-mint') {
        return (
            <div className="text-success">You have successfully mint your certificate</div>
        )
    }

}

export {Mint}
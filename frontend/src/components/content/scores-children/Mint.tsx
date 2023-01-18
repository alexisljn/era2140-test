import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "../../../App";
import {MintStatuses} from "../../../types/MintStatuses";
import {CONTRACT_EVENT} from "../../../events/ContractEventsManager";
import {deleteItemFromLocalStorage, getItemFromLocalStorage} from "../../../utils/Utils";
import {mint} from "../../../utils/ContractUtils";
import {ModalProps} from "../../../types/CommonTypes";
import {BigNumber} from "ethers";

function Mint({displayModal, hideModal}: ModalProps) {

    const {contract, address} = useContext(AppContext);

    const [mintStatus, setMintStatus] = useState<MintStatuses>('wait');

    const [merkleProof, setMerkleProof] = useState<Array<string> | null>(null);

    const [mintTokenId, setMintTokenId] = useState<BigNumber | null>(null);

    const handleLocallyContractEvents = useCallback((e: any) => {
        switch (e.detail.type) {
            case 'scoresUpdated':
                if (e.detail.value === address) {
                    setMintStatus('can-mint');
                }
                break;
            case 'transfer':
                const {to, tokenId} = e.detail.value;

                if (to === address) {
                    hideModal();
                    setMintStatus('has-mint');
                    setMintTokenId(tokenId);
                }
        }
    }, [address]);

    const onMint = useCallback(async () => {
        try {
            if (!merkleProof) {
                throw new Error('No merkle proof');
            }

            await mint(contract!, merkleProof);

            displayModal();
        } catch (e: any) {
            console.error(e) // Logging
        }
    }, [contract, merkleProof])

    useEffect(() => {

        const merkleProofFromLocalStorage = getItemFromLocalStorage('merkleProof');

        if (merkleProofFromLocalStorage) {
            deleteItemFromLocalStorage('merkleProof');

            setMerkleProof(merkleProofFromLocalStorage);
        }

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
            <button className="btn primary" onClick={onMint}>Mint my certificate</button>
        )
    }

    return (
        <div className="text-success">
            You have successfully mint certificate {mintTokenId &&
            mintTokenId.toString()
        }
        </div>
    )
}

export {Mint}
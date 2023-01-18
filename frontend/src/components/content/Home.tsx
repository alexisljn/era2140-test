import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "../../App";
import {connectWallet, getSupportedChainLabel, isChainIdSupported} from "../../utils/ProviderUtils";
import {fetchApi, formatAddressWithChecksum} from "../../utils/Utils";
import {saveAccessTokenInLocalStorage, signMessage} from "../../utils/AuthUtils";
import {ContentComponentProps} from "../../types/ContentComponents";
import {getOnChainScores} from "../../utils/ContractUtils";

function Home({changeComponentToDisplay}: ContentComponentProps) {

    const {provider, contract, address, chainId, hasValidToken, changeAddress, changeHasValidToken} = useContext(AppContext);

    const [bestScore, setBestScore] = useState<number>(0);

    const onConnectWallet = useCallback(async () => {
        try {
            const address = await connectWallet(provider!);

            changeAddress(formatAddressWithChecksum(address));
        } catch (e: any) {
            console.error(e); // Logging for user
        }
    }, [provider, changeAddress]);

    const onSignIn = useCallback(async () => {
        try {
            const {message} = await fetchApi(`auth/message/${address}`);

            const signedMessage = await signMessage(provider!.getSigner(), message);

            const {accessToken} = await fetchApi(
                'auth',
                'POST',
                [{name: 'Content-Type', value: 'application/json'}],
                {address, message: signedMessage}
            );

            saveAccessTokenInLocalStorage(address!, accessToken);

            changeHasValidToken(true);
        } catch (e: any) {
            console.error(e);
        }
    }, [provider, address, changeHasValidToken]);

    const startQuiz = useCallback(() => {
        changeComponentToDisplay('quiz');
    }, [changeComponentToDisplay]);

    useEffect(() => {
        if (!contract || !address) return;

        (async () => {
           const scores = await getOnChainScores(contract, address);

           setBestScore(scores['bestScore']);
        })()

    }, [contract, address]);

    if (provider === undefined) {
        return (
            <>
                <div className="home">
                    <div className="home-upper">
                        <div className="home-upper-box">
                            <p className="home-upper-box-title">Loading...</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (provider === null) {
        return (
            <>
                <div className="home">
                    <div className="home-upper">
                        <div className="home-upper-box">
                            <p className="home-upper-box-title">Please install metamask</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (!isChainIdSupported(chainId!)) {
        return (
            <>
                <div className="home">
                    <div className="home-upper">
                        <div className="home-upper-box">
                            <p className="home-upper-box-title">
                                Switch on <span className="network">{getSupportedChainLabel(Number(process.env.REACT_APP_CHAIN_ID))}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (!hasValidToken && !address) {
        return (
            <>
                <div className="home">
                    <div className="home-upper">
                        <div className="home-upper-box">
                            <p className="home-upper-box-title">Mon test technique</p>
                            <button className="btn primary" onClick={onConnectWallet}>Connect wallet</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (!hasValidToken && address) {
        return (
            <>
                <div className="home">
                    <div className="home-upper">
                        <div className="home-upper-box">
                            <p className="home-upper-box-title">Mon test technique</p>
                            <button className="btn primary" onClick={onSignIn}>Sign in</button>
                        </div>
                    </div>
                    <div className="home-lower">
                        <div className="home-lower-box">
                            <div className="home-ranking">🏆</div>
                            <div className="home-ranking">Meilleur score</div>
                            <div className="home-ranking-score">{bestScore}/5</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="home">
                <div className="home-upper">
                    <div className="home-upper-box">
                        <p className="home-upper-box-title">Mon test technique</p>
                        <button className="btn primary" onClick={startQuiz}>Demarrer</button>
                    </div>
                </div>
                <div className="home-lower">
                    <div className="home-lower-box">
                        <div className="home-ranking">🏆</div>
                        <div className="home-ranking">Meilleur score</div>
                        <div className="home-ranking-score">{bestScore}/5</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export {Home}
import {useCallback, useContext} from "react";
import {AppContext} from "../../App";
import {connectWallet, getSupportedChainLabel, isChainIdSupported} from "../../utils/ProviderUtils";
import {fetchApi, formatAddressWithChecksum} from "../../utils/Utils";
import {getAccessTokenInLocalStorage, saveAccessTokenInLocalStorage, signMessage} from "../../utils/AuthUtils";

function Home() {

    const {provider, contract, address, chainId, hasValidToken, changeAddress, changeHasValidToken} = useContext(AppContext);

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


    const testToken = useCallback(async () => {
        const token = getAccessTokenInLocalStorage(address!);

        const response = await fetchApi('quiz', 'POST', [{name: 'Authorization', value: `Bearer ${token}`}])

        console.log(response);
    }, [address]);

    const testProof = useCallback(async () => {
        try {
            await fetchApi(`merkle/root/${address}`);

            const {proof} = await fetchApi(`merkle/proof/${address}`);

            await contract!.mint(proof);

            console.log("good")
        } catch (e: any) {
            console.error(e);
        }

    }, [contract])


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
                    <div className="home-lower">
                        <div className="home-lower-box">
                            Classement TODO
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
                            Classement TODO
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
                        <button className="btn primary" onClick={testToken}>Demarrer</button>
                        <button onClick={testProof}>MINT TEST</button>
                    </div>
                </div>
                <div className="home-lower">
                    <div className="home-lower-box">
                        Classement TODO
                    </div>
                </div>
            </div>
        </>
    )
}

export {Home}
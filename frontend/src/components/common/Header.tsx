import React, {useCallback, useContext} from "react";
import {AppContext} from "../../App";
import {connectWallet} from "../../utils/ProviderUtils";
import {fetchApi, formatAddressWithChecksum} from "../../utils/Utils";
import {getAccessTokenInLocalStorage, saveAccessTokenInLocalStorage, signMessage} from "../../utils/AuthUtils";

function Header() {

    const {provider, address, changeAddress, hasValidToken, changeHasValidToken} = useContext(AppContext)

    //TODO Deport
    const onConnectWallet = useCallback(async () => {
        try {
            const address = await connectWallet(provider!);

            changeAddress(formatAddressWithChecksum(address));
        } catch (e: any) {
            console.error(e); // Logging for user
        }
    }, [provider, changeAddress]);

    // TODO Deport
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
    }, [provider, address]);

    const testToken = useCallback(async () => {
        const token = getAccessTokenInLocalStorage(address!);

        const response = await fetchApi('quiz', 'POST', [{name: 'Authorization', value: `Bearer ${token}`}])

        console.log(response);
    }, [address]);

    return (
        <>
            {hasValidToken
                ?
                <>
                    <button onClick={testToken}>Test token</button>
                    <span>Connecté</span>
                </>
                : address
                    ? <button onClick={onSignIn}>Sign In</button>
                    : <button onClick={onConnectWallet}>Connect Wallet</button>
            }
            {address &&
                <span>{address}</span>
            }
        </>
    )
}

export {Header}
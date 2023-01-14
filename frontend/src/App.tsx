import React, {createContext, useCallback, useEffect, useState} from 'react';
import {providers} from "ethers";
import {connectWallet, getConnectedAccounts} from "./utils/ProviderUtils";
import {fetchApi, formatAddressWithChecksum} from "./utils/Utils";
import {cleanProviderEvents, listenProviderEvents, PROVIDER_EVENT} from "./events/ProviderEventsManager";
import {
    getAccessTokenInLocalStorage,
    saveAccessTokenInLocalStorage,
    signMessage
} from "./utils/AuthUtils";

interface AppContextInterface {
    provider: providers.Web3Provider | undefined | null;
    address: string | null;
    hasValidToken: boolean;
    chainId: number | null;
    changeAddress: (address: string | null) => void;
}

const AppContext = createContext<AppContextInterface>({
    provider: undefined,
    address: null,
    hasValidToken: false,
    chainId: null,
    changeAddress: () => {},
});

function App() {

    const [provider, setProvider] = useState<providers.Web3Provider | undefined | null>(undefined);

    const [address, setAddress] = useState<string | null>(null);

    const [hasValidToken, setHasValidToken] = useState<boolean>(false);

    const [chainId, setChainId] = useState<number | null>(null);

    const changeAddress = useCallback((address: string | null) => {
        setAddress(address);
    }, []);

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

            setHasValidToken(true);
        } catch (e: any) {
            console.error(e);
        }
    }, [provider, address])

    const handleLocallyProviderEvents = useCallback((e: any) => {
        switch (e.detail.type) {
            case "chainChanged":
                window.location.reload();
                break;
            case "accountsChanged":
                setAddress(e.detail.value);
                break;
        }
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            setProvider(new providers.Web3Provider(window.ethereum));

            listenProviderEvents(window.ethereum);

            window.addEventListener(PROVIDER_EVENT, handleLocallyProviderEvents);

            return () => {
                cleanProviderEvents(window.ethereum);

                window.addEventListener(PROVIDER_EVENT, handleLocallyProviderEvents);
            }
        } else {
            setProvider(null);
        }
    }, [handleLocallyProviderEvents]);

    useEffect(() => {
        if (!provider) return;

        (async () => {
            setChainId((await provider.getNetwork()).chainId);

            const connectedAccount = await getConnectedAccounts(provider);

            connectedAccount !== null
                ? setAddress(formatAddressWithChecksum(connectedAccount)) // Verify Token
                : setAddress(connectedAccount)
            ;
        })();
    }, [provider])

    useEffect(() => {
        if (!address || !provider) return;

        (async () => {

            try {
            } catch (e: any) {
                console.error(e);
            }

        })();
    }, [address, provider])

    //TODO if provider is null or undefined

    return (
        <AppContext.Provider value={{provider, address, hasValidToken, chainId, changeAddress}}>
            <div className="App">
                <button onClick={onConnectWallet}>Connect Wallet</button>
                {address &&
                    <p>{address}</p>
                }
            </div>
        </AppContext.Provider>
    );
}

export default App;

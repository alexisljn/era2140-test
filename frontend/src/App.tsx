import React, {createContext, useCallback, useEffect, useState} from 'react';
import {providers} from "ethers";
import {getConnectedAccounts, isChainIdSupported} from "./utils/ProviderUtils";
import {formatAddressWithChecksum} from "./utils/Utils";
import {cleanProviderEvents, listenProviderEvents, PROVIDER_EVENT} from "./events/ProviderEventsManager";
import {
    getAccessTokenInLocalStorage,
} from "./utils/AuthUtils";
import {Header} from "./components/common/Header";
import {Content} from "./components/common/Content";

interface AppContextInterface {
    provider: providers.Web3Provider | undefined | null;
    address: string | null;
    hasValidToken: boolean;
    chainId: number | null;
    backgroundClass: string;
    changeAddress: (address: string | null) => void;
    changeHasValidToken: (isValid: boolean) => void;
    changeBackgroundClass: (backgroundClass: string) => void;
}

export const AppContext = createContext<AppContextInterface>({
    provider: undefined,
    address: null,
    hasValidToken: false,
    chainId: null,
    backgroundClass: 'base-bg',
    changeAddress: () => {},
    changeHasValidToken: () => {},
    changeBackgroundClass: () => {},
});

function App() {

    const [provider, setProvider] = useState<providers.Web3Provider | undefined | null>(undefined);

    const [address, setAddress] = useState<string | null>(null);

    const [hasValidToken, setHasValidToken] = useState<boolean>(false);

    const [chainId, setChainId] = useState<number | null>(null);

    const [backgroundClass, setBackgroundClass] = useState<string>('base-bg');

    const changeAddress = useCallback((address: string | null) => {
        setAddress(address);
    }, []);

    const changeHasValidToken = useCallback((isValid: boolean) => {
        setHasValidToken(isValid);
    }, []);

    const changeBackgroundClass = useCallback((backgroundClass: string) => {
        setBackgroundClass(backgroundClass);
    }, []);

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

                window.removeEventListener(PROVIDER_EVENT, handleLocallyProviderEvents);
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
                ? setAddress(formatAddressWithChecksum(connectedAccount))
                : setAddress(connectedAccount)
            ;
        })();
    }, [provider]);

    useEffect(() => {
        if (!address || !chainId) {
            setHasValidToken(false);

            return;
        }

        if (!isChainIdSupported(chainId)) {
            setHasValidToken(false);

            return;
        }

        const accessToken = getAccessTokenInLocalStorage(address);

        if (accessToken) {
            setHasValidToken(true);

            return;
        }

        setHasValidToken(false);
    }, [address, chainId]);

    return (
        <AppContext.Provider value={{
            provider,
            address,
            hasValidToken,
            chainId,
            backgroundClass,
            changeAddress,
            changeHasValidToken,
            changeBackgroundClass
        }}>
            <div className="grid">
                <div className="header">
                    <Header/>
                </div>
                <div className={`content ${backgroundClass}`}>
                    <Content/>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;

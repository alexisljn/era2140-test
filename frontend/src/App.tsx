import React, {createContext, useCallback, useEffect, useState} from 'react';
import {providers} from "ethers";
import {connectWallet, getConnectedAccounts} from "./utils/ProviderUtils";
import {formatAddressWithChecksum} from "./utils/Utils";
import {cleanProviderEvents, listenProviderEvents, PROVIDER_EVENT} from "./events/ProviderEventsManager";

interface AppContextInterface {
    provider: providers.Web3Provider | undefined | null;
    address: string | null;
    chainId: number | null;
    changeAddress: (address: string | null) => void;
}

const AppContext = createContext<AppContextInterface>({
    provider: undefined,
    address: null,
    chainId: null,
    changeAddress: () => {},
});

function App() {

    const [provider, setProvider] = useState<providers.Web3Provider | undefined | null>(undefined);

    const [address, setAddress] = useState<string | null>(null);

    const [chainId, setChainId] = useState<number | null>(null);

    const changeAddress = useCallback((address: string | null) => {
        setAddress(address);
    }, []);

    //TODO Deport
    const onConnectWallet = useCallback(async () => {
        try {
            const address = await connectWallet(provider!);

            changeAddress(address);
        } catch (e: any) {
            console.error(e) // Logging for user
        }

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

    }, [provider])

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
    }, []);

    useEffect(() => {
        if (!provider) return;

        (async () => {
            setChainId((await provider.getNetwork()).chainId);
        })();

    }, [provider])

    // console.log("provider", provider);
    // console.log("chainId", chainId);
    console.log('address', address);

    //TODO if provider is null or undefined

    return (
        <AppContext.Provider value={{provider, address, chainId, changeAddress}}>
            <div className="App">
                <button onClick={onConnectWallet}>Connect Wallet</button>
            </div>
        </AppContext.Provider>
    );
}

export default App;

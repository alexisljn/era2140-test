import React, {createContext, useState} from 'react';
import {providers} from "ethers";

interface AppContextInterface {
    provider: providers.Web3Provider | undefined | null;
}

const AppContext = createContext<AppContextInterface>({
    provider: undefined
});

function App() {
    const [provider, setProvider] = useState<providers.Web3Provider | undefined | null>(undefined);

    return (
        <AppContext.Provider value={{provider}}>
            <div className="App">
                <header className="App-header">
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        </AppContext.Provider>
    );
}

export default App;

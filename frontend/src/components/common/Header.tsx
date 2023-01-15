import React, {useContext} from "react";
import {AppContext} from "../../App";
import {shortenAddress} from "../../utils/Utils";
import {getChainLabel} from "../../utils/ProviderUtils";

function Header() {

    const {provider, address, hasValidToken} = useContext(AppContext)

    if (!hasValidToken && !address) {
        return (
            <>
                <div><i className="fa-solid fa-sun"></i></div>
                <div className="not-connected-label">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span className="connection-status">Not connected</span>
                </div>
            </>
        )
    }

    if (!hasValidToken && address) {
        return (
            <>
                <div><i className="fa-solid fa-sun"></i></div>
                <div className="connected-label">
                    <div>
                        <i className="fa-solid fa-diagram-project"></i>
                        <span className="connection-status">
                            connected to <span className="network">{getChainLabel(provider!.network)}</span>
                        </span>
                    </div>
                    <div>
                        <i className="fa-solid fa-wallet"></i>
                        <span className="connection-status">{shortenAddress(address)}</span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div><i className="fa-solid fa-sun"></i></div>
            <div className="connected-label">
                <div>
                    <i className="fa-solid fa-diagram-project"></i>
                    <span className="connection-status">
                        authenticated on <span className="network">{getChainLabel(provider!.network)}</span>
                    </span>
                </div>
                {address &&
                    <div>
                        <i className="fa-solid fa-wallet"></i>
                        <span className="connection-status">{shortenAddress(address!)}</span>
                    </div>
                }
            </div>
        </>
    )
}

export {Header}
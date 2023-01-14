import {Signer} from "ethers";
import {formatAddressWithChecksum} from "./Utils";

async function signMessage(signer: Signer, message: string): Promise<string | null> {
    try {
        return await signer.signMessage(message);
    } catch (e: any) {
        return null;
    }
}

function saveAccessTokenInLocalStorage(address: string, accessToken: string) {
    let accessTokens: string | null | {[key: string]: string} = window.localStorage.getItem('accessToken');

    if (!accessTokens) {
        accessTokens = {};
    } else {
        accessTokens = JSON.parse(accessTokens) as {[key: string]: string};
    }

    accessTokens[formatAddressWithChecksum(address)] = accessToken;

    window.localStorage.setItem('accessToken', JSON.stringify(accessTokens));
}

function getAccessTokenInLocalStorage(address: string) {
    const accessTokens = window.localStorage.getItem('accessToken');

    if (!accessTokens) return null;

    try {
        return JSON.parse(accessTokens)[formatAddressWithChecksum(address)] || null;
    } catch (e) {
        return null;
    }
}

export {signMessage, saveAccessTokenInLocalStorage, getAccessTokenInLocalStorage};
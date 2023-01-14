import {Signer} from "ethers";

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

    accessTokens[address] = accessToken;

    window.localStorage.setItem('accessToken', JSON.stringify(accessTokens));
}

}

export {signMessage, saveAccessTokenInLocalStorage, getAccessTokenInLocalStorage};
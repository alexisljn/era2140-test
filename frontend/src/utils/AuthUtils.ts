import {Signer} from "ethers";

async function signMessage(signer: Signer, message: string): Promise<string | null> {
    try {
        return await signer.signMessage(message);
    } catch (e: any) {
        return null;
    }
}

function saveAccessTokenInLocalStorage(accessToken: string) {
    window.localStorage.setItem('accessToken', accessToken);
}

export {signMessage, saveAccessTokenInLocalStorage};
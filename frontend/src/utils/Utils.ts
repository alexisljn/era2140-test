import {ethers} from "ethers";
import {HeaderInterface, MethodsAllowed} from "../types/CommonTypes";

function formatAddressWithChecksum(address: string) {
    return ethers.utils.getAddress(address);
}

async function fetchApi(
    path: string,
    method: MethodsAllowed = 'GET',
    headersArray: Array<HeaderInterface> = [],
    body: object | undefined = undefined
) {
    try {
        const headers = generateRequestHeaders(headersArray);

        const response = await fetch(
            `${String(process.env.REACT_APP_BACKEND_URL)}/${path}`,
            {method, headers, body: JSON.stringify(body)}
        );

        const jsonData = await response.json();

        if (!response.ok) {
            throw new Error(jsonData.message);
        }

        return jsonData;
    } catch (e: any) {
        console.error(e)
    }
}

function generateRequestHeaders(headersArray: Array<HeaderInterface>) {
    const headers = new Headers();

    for (const header of headersArray) {
        headers.append(header.name, header.value);
    }

    return headers;
}

function shortenAddress(address: string) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function setItemToLocalStorage(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
}
function getItemFromLocalStorage(key: string): any {
    const item = window.localStorage.getItem(key);

    return item ? JSON.parse(item) : null;
}

function deleteItemFromLocalStorage(key: string): any {
    window.localStorage.removeItem(key);
}

export {formatAddressWithChecksum, fetchApi, shortenAddress, setItemToLocalStorage, getItemFromLocalStorage, deleteItemFromLocalStorage}
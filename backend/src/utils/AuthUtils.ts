import {ethers} from "ethers";
import {formatAddressWithChecksum} from "./Utils";
import jwt from "jsonwebtoken";


function generateMessageToSign(address: string) {
    return `I will prove by signing this message that I own ${address}`;
}

function checkSignedMessage(address: string, message: string): boolean {
    const addressFromMessage = ethers.utils.verifyMessage(
        `I will prove by signing this message that I own ${address}`,
        message
    );

    return formatAddressWithChecksum(addressFromMessage) === formatAddressWithChecksum(address)
}

function generateAccessToken(address: string) {
    return jwt.sign({user: address}, process.env.APP_SECRET, {expiresIn: '100 years'}); // Never expires for purpose
}

export {generateMessageToSign, checkSignedMessage, generateAccessToken}
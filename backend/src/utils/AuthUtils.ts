import {ethers} from "ethers";
import {formatAddressWithChecksum} from "./Utils";
import jwt, {JwtPayload} from "jsonwebtoken";
import {ErrorData} from "../types/CommonTypes";


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

function verifyAccessToken(accessToken: string | undefined): JwtPayload | string {
    // No access token
    if (!accessToken) {
        const errorData: ErrorData = {status: 401, message: "Unauthorized"};

        throw new Error(JSON.stringify(errorData));
    }

    // Malformed access token
    if (!accessToken.startsWith('Bearer ')) {
        const errorData: ErrorData = {status: 422, message: "Malformed authorization header"};

        throw new Error(JSON.stringify(errorData));
    }

    const cleanedAccessToken = accessToken.split(" ")[1];

    return jwt.verify(cleanedAccessToken, process.env.APP_SECRET);
}

export {generateMessageToSign, checkSignedMessage, generateAccessToken, verifyAccessToken}
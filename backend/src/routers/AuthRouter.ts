import {NextFunction, Request, Response, Router} from "express";
import {formatAddressWithChecksum} from "../utils/Utils";
import {ErrorData} from "../types/CommonTypes";
import {generateMessageToSign, checkSignedMessage, generateAccessToken} from "../utils/AuthUtils";

const authRouter: Router = Router();

authRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        // Missing parameters
        if (!req.body.hasOwnProperty('address') || !req.body.hasOwnProperty('message')) {
            const errorData: ErrorData = {status: 422, message: 'Missing parameter address or message'};

            throw new Error(JSON.stringify(errorData));
        }

        const {address, message} = req.body;

        // Invalid type
        if (typeof address !== "string" || typeof message !== "string") {
            const errorData: ErrorData = {status: 422, message: 'Invalid type for parameter address or message'};

            throw new Error(JSON.stringify(errorData));
        }

        formatAddressWithChecksum(address);

        const signedMessageCheck = checkSignedMessage(address, message);

        // Invalid signature
        if (!signedMessageCheck) {
            const errorData: ErrorData = {status: 401, message: 'Address don\'t match with signed message'};

            throw new Error(JSON.stringify(errorData));
        }

        const accessToken = generateAccessToken(address);

        res.status(200).json({accessToken});
    } catch (e: any) {
        console.error(e) // Server logging

        if (e.message.includes('invalid address')) {
            const errorData: ErrorData = {status: 422, message: `Invalid address: ${req.body.address}`}

            throw new Error(JSON.stringify(errorData));
        }

        if (e.message.includes("signature")) {
            const errorData: ErrorData = {status: 422, message: 'Invalid signature'}

            throw new Error(JSON.stringify(errorData));
        }

        next(e);
    }
});

authRouter.get('/message/:address(\\w+)', (req: Request, res: Response, next: NextFunction) => {
    try {
        const {address} = req.params;

        formatAddressWithChecksum(address);

        res.status(200).json({message: generateMessageToSign(address)});
    } catch (e: any) {
        console.error(e) // Server logging

        if (e.message.includes('invalid address')) {
            const errorData: ErrorData = {status: 422, message: `Invalid address: ${req.params.address}`}

            throw new Error(JSON.stringify(errorData));
        }

        next(e);
    }
});

export {authRouter}
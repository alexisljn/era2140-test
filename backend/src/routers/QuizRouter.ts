import e, {Router} from "express";
import {ErrorData} from "../types/CommonTypes";
import jwt from "jsonwebtoken";

const quizRouter: Router = Router();

quizRouter.post('/', (req, res, next) => {
    try {
        const accessToken = req.get('Authorization');

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

        jwt.verify(cleanedAccessToken, process.env.APP_SECRET);

        res.status(200).json({message: 'ok'});
    } catch (e) {
        if (e.message.includes("invalid signature") || e.message.includes("jwt malformed")) {
            const errorData: ErrorData = {status: 401, message: "Unauthorized"};

            throw new Error(JSON.stringify(errorData));
        }

        next(e);
    }
});

export {quizRouter}
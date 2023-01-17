import e, {Router} from "express";
import {ErrorData} from "../types/CommonTypes";
import jwt from "jsonwebtoken";
import {computeScores, generateQuiz} from "../managers/QuizManager";

const quizRouter: Router = Router();

quizRouter
    .get('/', (req, res, next) => {
        try {
            const quiz = generateQuiz();

            res.status(200).json(quiz);
        } catch (e) {
            next(e);
        }
    })
    .post('/', (req, res, next) => {
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

        if (!req.body.hasOwnProperty('answers')) {
            const errorData: ErrorData = {status: 422, message: "Missing parameter answers"};

            throw new Error(JSON.stringify(errorData));
        }

        const scores = computeScores(req.body.answers);

        console.log("scores", scores);

        // Update smart contract

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
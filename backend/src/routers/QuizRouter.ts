import {Router} from "express";
import {ErrorData} from "../types/CommonTypes";
import {computeScores, generateQuiz} from "../managers/QuizManager";
import {verifyAccessToken} from "../utils/AuthUtils";
import {addAddressToMerkleTree, generateMerkleTree, isAddressInMerkleTree} from "../managers/MerkleManager";
import {updateScores} from "../utils/ProviderUtils";

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
    .post('/', async (req, res, next) => {
    try {
        const accessToken = req.get('Authorization');

        const accessTokenPayload = verifyAccessToken(accessToken);

        const address = accessTokenPayload['user'];

        if (!req.body.hasOwnProperty('answers')) {
            const errorData: ErrorData = {status: 422, message: "Missing parameter answers"};

            throw new Error(JSON.stringify(errorData));
        }

        const scores = computeScores(req.body.answers);

        if (!isAddressInMerkleTree(address)) {

            addAddressToMerkleTree(address);
        }

        const merkleTree = generateMerkleTree();

        await updateScores(merkleTree.getHexRoot(), address, scores.total, scores.time);

        res.status(201).json({scores});
    } catch (e) {
        console.log(e); // Logging

        if (e.message.includes("invalid signature") || e.message.includes("jwt malformed")) {
            const errorData: ErrorData = {status: 401, message: "Unauthorized"};

            throw new Error(JSON.stringify(errorData));
        }

        next(e);
    }
});

export {quizRouter}
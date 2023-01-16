import express, {NextFunction, Request, Response} from 'express';
import {authRouter} from "./routers/AuthRouter";
import {ErrorData} from "./types/CommonTypes";
import dotenv from "dotenv";
import {quizRouter} from "./routers/QuizRouter";
import {initiateProvider, updateMerkleRoot} from "./utils/ProviderUtils";
import {
    addAddressToMerkleTree,
    generateMerkleTree,
    generateSingleLeaf,
    isAddressInMerkleTree
} from "./managers/MerkleManager";

dotenv.config();
initiateProvider();

const app = express();
const port = 3000

app.use(express.json());

// CORS Preflight request
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.set('Access-Control-Allow-Origin', String(process.env.FRONTEND_URL));
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    next();
});

app.options('*', (req: Request, res: Response) => {
    res.status(200).send();
});

// Routing
app.use('/auth', authRouter);
app.use('/quiz', quizRouter);

app.get('/', (req, res) => {
    res.send('Hello World!!')
})

app.get('/merkle/root/:address(\\w+)', async (req, res, next) => {
    try {
        if (!isAddressInMerkleTree(req.params.address)) {

            addAddressToMerkleTree(req.params.address);

            const merkleTree = generateMerkleTree();

            await updateMerkleRoot(merkleTree.getHexRoot());

            res.status(201).end();

            return;
        }

        res.status(200).end();
    } catch (e) {
        console.log(e)
        next(e);
    }
});

app.get('/merkle/proof/:address(\\w+)', (req, res, next) => {
    try {
        if (!isAddressInMerkleTree(req.params.address)) {
            res.status(403).end();

            return;
        }

        const merkleTree = generateMerkleTree();

        const merkleProof = merkleTree.getHexProof(generateSingleLeaf(req.params.address));

        res.status(200).json({proof: merkleProof});
    } catch (e) {
        console.error(e);
        next(e);
    }
})

// 404
app.use(({next}) => {
    const errorData: ErrorData = {status: 404, message: 'Not Found'};

    next(new Error(JSON.stringify(errorData)));
});

// Errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let error: ErrorData = {status: 500, message: 'Something went wrong'};

    try {
        error = JSON.parse(err.message);
    } catch (e) {}

    res.status(error.status).json({message: error.message});
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

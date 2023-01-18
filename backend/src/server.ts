import express, {NextFunction, Request, Response} from 'express';
import {authRouter} from "./routers/AuthRouter";
import {ErrorData} from "./types/CommonTypes";
import dotenv from "dotenv";
import {quizRouter} from "./routers/QuizRouter";
import {initializeProvider} from "./utils/ProviderUtils";
import { getAuth, signInAnonymously } from "firebase/auth";
import {initializeFirebase} from "./utils/FirebaseUtil";

dotenv.config();
initializeProvider();
initializeFirebase();

// const auth = getAuth();
// signInAnonymously(auth).then((user) => {
//     console.log("userCred", user)
// })

// console.log("firebaseApp", firebaseApp)

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

app.get('/test', (req, res, next) => {
    // Upload firebase
})

// Routing
app.use('/auth', authRouter);
app.use('/quiz', quizRouter);

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

import express, {NextFunction, Request, Response} from 'express';
import {authRouter} from "./routers/AuthRouter";
import {ErrorData} from "./types/CommonTypes";

const app = express();
const port = 3000

// CORS Preflight request
app.options('*', (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', String(process.env.NODE_ENV) === 'development' ? '*' : String(process.env.FRONTEND_URL));
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    res.status(200).send();
});
app.get('/', (req, res) => {
    res.send('Hello World!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

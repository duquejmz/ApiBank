import express, { json } from  'express';
import dbConnect from '../database/config.js';
import '../database/config.js';
import savingAccountsRouter from '../routes/savingAccountsRoute.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.pathSavingAccess = '/api/bank';

        this.middlewares();
        this.dbConnection();
        this.routes();
    }

    async dbConnection() {
        await dbConnect();
    }

    middlewares() {
        this.app.use(json());
    }

    routes() {
        this.app.use(this.pathSavingAccess, savingAccountsRouter);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        })
    }
}

export default Server
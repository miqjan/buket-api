import Routes from './authRouter';
import * as express from 'express';

class AuthModule {
    constructor(apiRouter) {
        
        this.router = express.Router();
        this.apiRouter = apiRouter;
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/auth', this.router);
    }

    assignEndpoints() {
        Routes(this.router);
    }
}

export default (apiRouter) => new AuthModule(apiRouter);
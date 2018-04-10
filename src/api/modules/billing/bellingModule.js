import Routes from './bellingRouter';
import * as express from 'express';

class BellingModule {
    constructor(apiRouter) {
        this.router = express.Router();
        this.apiRouter = apiRouter;
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/billing', this.router);
    }

    assignEndpoints() {
        Routes(this.router);
    }
}

export default (apiRouter) => new BellingModule(apiRouter);

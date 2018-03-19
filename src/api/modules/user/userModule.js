import Routes from './userRouter';
import * as express from 'express';

class ShippingModule {
    constructor(apiRouter) {
        this.router = express.Router();
        this.apiRouter = apiRouter;
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/user', this.router);
    }

    assignEndpoints() {
        Routes(this.router);
    }
}

export default (apiRouter) => new ShippingModule(apiRouter);

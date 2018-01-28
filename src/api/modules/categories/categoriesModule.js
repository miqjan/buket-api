import Routes from './categoriesRouter';
import * as express from 'express';

class CategoriesModule {
    constructor(apiRouter) {
        
        this.router = express.Router();
        this.apiRouter = apiRouter;
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/categories', this.router);
    }

    assignEndpoints() {
        Routes(this.router);
    }
}

export default (apiRouter) => new CategoriesModule(apiRouter);
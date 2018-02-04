import Routes from './productsRouter';
import * as express from 'express';

class ProductsModule {
    constructor(apiRouter) {
        
        this.router = express.Router();
        this.apiRouter = apiRouter;
    }

    createEndpoints() {
        this.assignRouter();
        this.assignEndpoints();
    }

    assignRouter() {
        this.apiRouter.use('/products', this.router);
    }

    assignEndpoints() {
        Routes(this.router);
    }
}

export default (apiRouter) => new ProductsModule(apiRouter);
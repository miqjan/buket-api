import controller from './productsController';
import { checkAuthentication,MustBeSuperAdmin } from '../auth/helpers';

export default router => {

    router.use(checkAuthentication);

    router.get('/', MustBeSuperAdmin, controller.getAllProducts);

    router.post('/', MustBeSuperAdmin, controller.setProduct);

    router.get('/:categoryId', controller.getProductsByCategory);

    router.post('/byIds', controller.getProductsByIds);

    router.get('/byId/:id', controller.getProductById);

    //router.post("/test",controller.test);

    // router.post("/sign-out", controller.signOut);

    // router.put("/verify-email/:emailAuthToken", controller.verifyEmail);
};

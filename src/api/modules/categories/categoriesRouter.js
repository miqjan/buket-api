import controller from './categoriesController';
import {checkAuthentication,MustBeSuperAdmin} from '../auth/helpers';

export default router => {

    router.use(checkAuthentication);

    router.get('/', controller.getAllCategories);

    router.post('/', MustBeSuperAdmin, controller.setCategory);

    //router.post("/test",controller.test);

    // router.post("/sign-out", controller.signOut);

    // router.put("/verify-email/:emailAuthToken", controller.verifyEmail);
};

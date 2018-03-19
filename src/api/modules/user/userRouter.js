import controller from './userController';
import { checkAuthentication, MustBeSignin } from '../auth/helpers';

export default router => {
    router.use(checkAuthentication);
    
    router.put('/', MustBeSignin, controller.updateProfile);
};

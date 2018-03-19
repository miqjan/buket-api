import controller from './shippingController';
import { checkAuthentication, MustBeSignin } from '../auth/helpers';

export default router => {
    router.use(checkAuthentication);
    
    router.get('/region', MustBeSignin, controller.getAllShippingRegion);
};

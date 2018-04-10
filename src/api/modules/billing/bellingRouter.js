import controller from './bellingController';
import { checkAuthentication, MustBeSignin } from '../auth/helpers';

export default router => {

    router.use(checkAuthentication);

    router.post('/get', MustBeSignin, controller.getPrice);
    router.post('/', MustBeSignin, controller.Charge);

};

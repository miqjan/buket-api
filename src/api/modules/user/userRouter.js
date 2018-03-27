import controller from './userController';
import { checkAuthentication, MustBeSignin } from '../auth/helpers';

export default router => {
    router.use(checkAuthentication);

    router.put('/', MustBeSignin, controller.updateProfile);

    router.get('/delivery', MustBeSignin,controller.getDeliveryBook);

    router.post('/delivery', MustBeSignin,controller.setDeliveryBook);

    router.put('/delivery/:id', MustBeSignin,controller.updateDeliveryBook);

    router.delete ('/delivery/:id', MustBeSignin,controller.deleteDeliveryBookById);
};

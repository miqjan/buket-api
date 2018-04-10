import AuthModule from './modules/auth/authModule';
import CategoriesModule from './modules/categories/categoriesModule';
import ProductsModule from './modules/products/productsModule';
import ShippingModule from './modules/shipping/shippingModule';
import UserModule from './modules/user/userModule';
import BellingModule from './modules/billing/bellingModule';

export default (router) => {
    const modules = [];
    const auth = AuthModule(router);
    const categorys = CategoriesModule(router);
    const products = ProductsModule(router);
    const shipping = ShippingModule(router);
    const user = UserModule(router);
    const billing = BellingModule(router);
   
    modules.push(auth);
    modules.push(categorys);
    modules.push(products);
    modules.push(shipping);
    modules.push(user);
    modules.push(billing);
    
    modules.forEach((module) => {
        module.createEndpoints();
    });
    return router;
};

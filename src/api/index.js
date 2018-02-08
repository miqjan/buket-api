import AuthModule from './modules/auth/authModule';
import CategoriesModule from './modules/categories/categoriesModule';
import ProductsModule from './modules/products/productsModule';

export default (router) => {
    const modules = [];
    const auth = AuthModule(router);
    const categorys = CategoriesModule(router);
    const products = ProductsModule(router);
   
    modules.push(auth);
    modules.push(categorys);
    modules.push(products);
    modules.forEach((module) => {
        module.createEndpoints();
    });
    return router;
};

import * as express from 'express';

import AuthModule from './modules/auth/authModule';
import CategoriesModule from './modules/categories/categoriesModule';

export default (router) => {
    /**@type {Array} */
    let modules = [];
    /**@type {{}} */
    let auth = AuthModule(router);
    let categorys = CategoriesModule(router);
   
    modules.push(auth);
    modules.push(categorys);
    console.log(`loading modules`);
    modules.forEach((module) => {
        module.createEndpoints();
    });
    return router;
};

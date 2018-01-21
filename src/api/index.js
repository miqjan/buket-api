import * as express from 'express';

import AuthModule from './modules/auth/authModule';

export default (router) => {
    /**@type {Array} */
    let modules = [];
    /**@type {{}} */
    let auth = AuthModule(router);
    // let campaign = CampaignModule(router);
   
    modules.push(auth);
    // modules.push(campaign);
    console.log(`loading modules`);
    modules.forEach((module) => {
        module.createEndpoints();
    });
    return router;
};

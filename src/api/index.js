import * as express from 'express';

import AuthModule from './modules/auth/authModule';

export default (router) => {
    let modules = [];

    // let events = EventModule(router);
    // let contacts = ContactModule(router);
    let auth = AuthModule(router);
    // let campaign = CampaignModule(router);
    // let scheduleDemo = ScheduleDemoModule(router);
    // let email = EmailModule(router);
    // let payment = StripeModule(router);

    // modules.push(scheduleDemo);
    // modules.push(events);
    // modules.push(contacts);
    modules.push(auth);
    // modules.push(campaign);
    // modules.push(email);
    // modules.push(payment);
    console.log(`loading modules`);
    modules.forEach((module) => {
        module.createEndpoints();
    });
    return router;
};

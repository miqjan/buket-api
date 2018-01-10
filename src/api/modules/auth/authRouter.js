import controller from "./authController";
import {checkAuthentication,MustBeSignin,NotMustBeSignin} from './helpers';

export default router => {
    
    router.use(checkAuthentication);
    
    router.get("/is-sign-in", MustBeSignin, controller.isSignIn);

    router.post("/sign-in", NotMustBeSignin, controller.signIn);

    router.post("/sign-up", NotMustBeSignin, controller.signUp);

    router.post("/sign-out", MustBeSignin, controller.signOut);

    router.put("/verify-email/:emailAuthToken", controller.verifyEmail);
};

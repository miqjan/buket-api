import UserModel from './userModel';
export async function checkAuthentication(req,res,next){
    try {
        let user = await UserModel.prototype.IsSignin(req.headers.authorization);
        user = user.user;
        if(user.type === 1){
            req.SuperAdmin = true;
        } else {
            req.SuperAdmin = false;
        }
        req.IsSignin = true;
        delete user.type;
        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        req.IsSignin = false;
        req.SuperAdmin = false;
        next();
    }
}
export function MustBeSignin(req,res,next){
    if(req.IsSignin){
        next();
    } else {
        next(new Error('you must signin'));
    } 
}
export function MustBeSuperAdmin(req,res,next){
    if(req.IsSignin && req.SuperAdmin){
        next();
    } else {
        next(new Error('you must be Super Admin'));
    } 
}
export function NotMustBeSignin(req,res,next){
    if(!req.IsSignin){
        next();
    } else {
        next(new Error('you are signin'));
    } 
}
import UserModel from '../user/userModel';
import { AuthError } from '../../../config/errors';

export async function checkAuthentication(req,res,next){
    try {
        let user = await UserModel.prototype.IsSignin(req.headers.authorization);
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
        return next(new AuthError('Must be sign in'));
    } 
}
export function MustBeSuperAdmin(req,res,next){
    if(req.IsSignin && req.SuperAdmin){
        next();
    } else {
        return next(new AuthError('you must be Super Admin'));
    } 
}
export function NotMustBeSignin(req,res,next){
    if(!req.IsSignin){
        next();
    } else {
        return next(new AuthError('you are signin'));
    } 
}

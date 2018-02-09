import responseHandler from '../../../config/responseHandler';
import UserModel from '../user/userModel';
import { ValidationError } from '../../../config/errors/index';

//import EmailController from "../mail/emailController";

//const uuid = require("uuid/v4");

export default class AuthController {
    static async isSignIn(req, res, next){  
        try {
            responseHandler(res,'SIGNED_IN',req.user,null);
        } catch (error) {
            return next(error);
        } 
    }
    static async signIn(req, res, next) {
        req.checkBody('email', 'Email cannot be blank.').notEmpty();
        req.checkBody('email', 'Email is not valid.').isEmail();

        req.checkBody('password', 'Password cannot be blank.').notEmpty();
        req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});

        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
        try {
            let remeber = req.body.remeber || false;
            await req.asyncValidationErrors();
            responseHandler(res,'SIGNED_IN',await UserModel.prototype.Signin(req.body.email,req.body.password,remeber));
        } catch (error) {
           
            //when error is validation error in the server error middleware have an if(error instanse of Arrey)
            return next(error);
        }
    }

    static async signUp(req, res, next) {
        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
        req.checkBody('firstName', 'Firstname cannot be blank.').notEmpty();
        req.checkBody('lastName', 'Lastname cannot be blank.').notEmpty();
        req.checkBody('email', 'Incorect email address').isEmail();
        req.checkBody('phone','Incorect phone number').isMobilePhone('any');
        req.checkBody('password', 'Password cannot be blank.').notEmpty();
        req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});
        try {
            await req.asyncValidationErrors();
            let inserted = new UserModel({
                firstname: req.body.firstName,
                lastname : req.body.lastName,
                email    : {address:req.body.email,},
                phone    : {number:req.body.phone,},
                type     : req.body.type,
                password : req.body.password
            }); 
            const user = await inserted.InsertUser();
            const responseData = {
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email.address
            };
            responseHandler(res,'SIGNED_UP',responseData);
        } catch (error) {
            return next(error);
        } 
    }

    static signOut(req, res) {
        req.logout();
        responseHandler(res, 'signedOut');
    }

    // static async verifyEmail(req, res) {
    //     const { emailAuthToken } = req.params;
    //     const env= process.env.NODE_ENV || 'development';
    //     let userData;
    //     try {
    //         // TODO use patch and fetch
    //         await User.query().patch({isEmailVerified : true}).where("emailAuthToken", emailAuthToken);
    //         userData = await User.query().where("emailAuthToken", emailAuthToken);
    //         const user = userData[0];
    //         if (user && user instanceof User) {
    //             let payload = {id: user.id};
    //             let token = jwt.sign(payload, params[env].passportSecret);
    //             return responseHandler(res, 'success', {
    //                 user: {
    //                     name: user.name,
    //                     lastName: user.lastName,
    //                     company: user.company,
    //                     email: user.email,
    //                     token: token,
    //                     id : user.id
    //                 }
    //             }, null);
    //         } else {
    //             return responseHandler(res, 'userNotExist', null, {errors: {message: "Invalid auth token."}});
    //         }
    //     } catch(error) {
    //         return responseHandler(res, 'error', null, error);
    //     }
    // }
}

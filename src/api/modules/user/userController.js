import responseHandler from '../../../config/responseHandler';
import UserModel from './userModel';
import { BadRequest, ValidationError } from '../../../config/errors/index';

export default class ShippingController {
    static async updateProfile( req, res, next ){
        const body = req.body;
        req.checkBody( 'current_password', 'current password is incorect').validPassword(req.user._id);
        if(body.password || body.cnfirm_password){
            req.checkBody('password', 'password is incorect' ).notEmpty().len({min: 6});
            req.checkBody('cnfirm_password', 'cnfirm password not equal to password').equals(body.password);
        }
        if(body.firstname){
            req.checkBody('firstname', 'firstname is incorect' ).notEmpty().len({min: 2});
        }
        if(body.lastname){
            req.checkBody('lastname', 'lastname is incorect' ).notEmpty().len({min: 2});
        }
        if(body.phone){
            req.checkBody('phone', 'phone is incorect' ).notEmpty().isMobilePhone('any');
        }
        try {
            await req.asyncValidationErrors();
            Object.keys(body).forEach((key) => (body[key] === null || body[key] === undefined) && delete body[key]);
            if(body.phone){
                body.phone = {number: body.phone};
            }
            const user = await UserModel.findByIdAndUpdate(req.user._id,body,{
                fields: { firstname:1, lastname: 1, phone: 1, },
                new: true 
            });
            responseHandler( res, 'SUCCESS', user, null );
        } catch ( error ) {
            return next( new ValidationError( error ) );
        } 
    }
}



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
        body.firstname && req.checkBody('firstname', 'firstname is incorect' ).notEmpty().len({min: 2});
        body.lastname && req.checkBody('lastname', 'lastname is incorect' ).notEmpty().len({min: 2});
        body.phone && req.checkBody('phone', 'phone is incorect' ).notEmpty().isMobilePhone('any');
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
            return responseHandler( res, 'SUCCESS', user, null );
        } catch ( error ) {
            return next( new ValidationError( error ) );
        } 
    }
    static async getDeliveryBook(req,res,next){
        try {
            const deliveryBook = await UserModel.findById(req.user._id).populate({
                path: 'delivery_book.region',
                options: { limit: 1 }
            }).select('delivery_book');
            return responseHandler( res, 'SUCCESS', deliveryBook, null );
        } catch (error) {
            return next(new BadRequest(error));
        }
    }
    static async setDeliveryBook(req,res,next){
        req.checkBody('firstname', 'firstname is incorect' ).notEmpty().len({min: 2, max: 30});
        req.checkBody('lastname', 'lastname is incorect' ).notEmpty().len({min: 2, max: 30});
        req.checkBody('phone', 'phone is incorect' ).notEmpty().isMobilePhone('any');
        req.checkBody('country', 'country is incorect' ).notEmpty().len({min: 2});
        req.checkBody('region', 'region is incorect' ).notEmpty().isMongoId();
        req.checkBody('city_village', 'region is incorect' ).notEmpty().len({min: 2, max: 30});
        req.checkBody('address', 'address is incorect' ).notEmpty().len({min: 2, max: 150});
       
        try {
            const {firstname, lastname, phone, country,
                region, city_village, address} = req.body;
            await req.asyncValidationErrors();
            const result = await UserModel.findByIdAndUpdate(
                req.user._id, 
                { $push: { delivery_book: {firstname, 
                    lastname, phone, country,
                    region, city_village, address} } },
                {new: true},
            ).populate({
                path: 'delivery_book.region',
                options: { limit: 1 }
            }).select('delivery_book').exec();
            return responseHandler( res, 'SUCCESS', result, null );
        } catch (error) {
            return next(new ValidationError(error));
        }
    }
    static async updateDeliveryBook(req, res, next){
        const body = req.body;
       
        body.firstname.trim() && req.checkBody('firstname', 'firstname is incorect' ).notEmpty().len({min: 2, max: 30});
        body.lastname.trim() && req.checkBody('lastname', 'lastname is incorect' ).notEmpty().len({min: 2, max: 30});
        body.phone.trim() && req.checkBody('phone', 'phone is incorect' ).notEmpty().isMobilePhone('any');
        body.country.trim() && req.checkBody('country', 'country is incorect' ).notEmpty().len({min: 2});
        body.region.trim() && req.checkBody('region', 'region is incorect' ).notEmpty().isMongoId();
        body.city_village.trim() && req.checkBody('city_village', 'region is incorect' ).notEmpty().len({min: 2, max: 30});
        body.address.trim() && req.checkBody('address', 'address is incorect' ).notEmpty().len({min: 2, max: 150});
        req.checkParams('id', 'id is incorect' ).notEmpty().isMongoId();
        
        try {
            let update = {};
            Object.keys(body).forEach((key) => {
                if(body[key] === null || body[key] === undefined){
                    delete body[key];
                }else {
                    update['delivery_book.$.'+key] = body[key];
                } 
            });
            const result = await UserModel.findOneAndUpdate({'delivery_book._id': req.params.id},update,{new: true}).populate({
                path: 'delivery_book.region',
                options: { limit: 1 }
            }).select('delivery_book').exec();
            return responseHandler( res, 'SUCCESS', result, null );
        } catch (error) {
            return next(error);
        }

    }
    static async deleteDeliveryBookById(req,res,next){
        req.checkParams('id', 'id is incorect' ).notEmpty().isMongoId();
        try {
            await req.asyncValidationErrors();
            const result = await UserModel.findById(req.user._id).populate({
                path: 'delivery_book.region',
                options: { limit: 1 }
            }).select('delivery_book').exec();
            result.delivery_book.pull({_id: req.params.id});
            return responseHandler( res, 'SUCCESS',  await result.save(), null );
        } catch (error) {
            return next( new ValidationError(error));
        }
        
    }
}



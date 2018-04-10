import Stripe from 'stripe';
import * as _ from 'lodash';
import responseHandler from '../../../config/responseHandler';
import ProductsModel from '../products/productsModel';
import ShippingModel from '../shipping/shippingModel';
import UserModel from '../user/userModel';
import config from '../../../../config/index';
import { BadRequest, ValidationError } from '../../../config/errors/index';

const stripe = Stripe(config.stripe.private);


export default class BellingController { 
    static async getPrice( req, res, next ) {
        req.checkBody( 'products.*.id', 'products is incorect' ).notEmpty().isMongoId();
        req.checkBody( 'products.*.count', 'products count is incorect' ).notEmpty().isNumeric();
        req.checkBody( 'shipping', 'Url can not be blank.' ).notEmpty().isMongoId();
        try {
            await req.asyncValidationErrors();
            let {products:productsIn,shipping: shippingIn} = req.body;
            const productsOut = await ProductsModel.find({_id: productsIn.map((item)=>item.id)}).select('price');
            productsIn = productsIn.reduce(function(obj,item){
                obj[item.id] = item; 
                return obj;
            }, {});
              
            const shippingOut = await ShippingModel.findById(shippingIn).select('price');
            const productsPrice = productsOut.reduce((sum,item)=>sum+=(item.price*productsIn[item._id].count),0);
            responseHandler( res, 'SUCCESS', shippingOut.price + productsPrice, null);
        } catch ( error ) {
            return next( new ValidationError( error ) );
        }
    }
    static async Charge( req, res, next ) {
        req.checkBody( 'products.*.id', 'products is incorect' ).notEmpty().isMongoId();
        req.checkBody( 'products.*.count', 'products count is incorect' ).notEmpty().isNumeric();
        req.checkBody( 'shipping.region', 'Url can not be blank.' ).notEmpty().isMongoId();
        req.checkBody( 'token', 'Url can not be blank.' ).notEmpty();
        
        try {
            await req.asyncValidationErrors();
            let {stripe: stripeId} = await UserModel.findById(req.user).select('stripe');
            if(!stripeId){
                const customer = await stripe.customers.create({
                    source: req.body.token.id,
                    email: req.user.email.address,
                });
                stripeId = customer.id;
            }
            let {products:productsIn,shipping: {region: shippingIn} } = req.body;
            const productsOut = await ProductsModel.find({_id: productsIn.map((item)=>item.id)}).select('price');
            productsIn = productsIn.reduce(function(obj,item){
                obj[item.id] = item;
                return obj;
            }, {});
            const shippingOut = await ShippingModel.findById(shippingIn).select('price');
            const productsPrice = productsOut.reduce((sum,item)=>sum+=(item.price*productsIn[item._id].count),0);
            const charge = await stripe.charges.create({
                amount: parseInt(shippingOut.price + productsPrice),
                currency: 'usd',
                source: req.body.token.id,
                
            });
            console.log(charge);
            responseHandler( res, 'SUCCESS', req.body, null);
        } catch ( error ) {
            console.log(error);
            return next( new ValidationError( error ) );
        }
    }
}

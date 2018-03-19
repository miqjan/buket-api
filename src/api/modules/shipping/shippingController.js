import responseHandler from '../../../config/responseHandler';
import ShippingModel from './shippingModel';
import { BadRequest } from '../../../config/errors/index';

export default class ShippingController {
    static async getAllShippingRegion( req, res, next ){  
        try {
            const regions = await ShippingModel.find().exec();
            responseHandler( res, 'SUCCESS', regions, null );
        } catch ( error ) {
            return next( new BadRequest( error ) );
        } 
    }
}



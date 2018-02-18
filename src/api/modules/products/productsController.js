import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import responseHandler from '../../../config/responseHandler';
import ProductsModel from './productsModel';
import CategoriesModel from '../categories/categoriesModel';
//import config from '../../../../config/index';
import { BadRequest, ValidationError } from '../../../config/errors/index';
import * as _ from 'lodash';


export default class ProductsController {
    static async getAllProducts( req, res, next ){  
        try {
            const categorys = await ProductsModel.find().exec();
            responseHandler( res, 'SUCCESS', categorys, null );
        } catch ( error ) {
            return next( new BadRequest( error ) );
        } 
    }
    static async getProductsByCategory ( req,res,next ) {
        req.checkParams( 'categoryId', 'incorect category id' ).notEmpty().isMongoId();
        if( req.query.limit ){
            req.checkQuery( 'limit', 'incorect limit' ).notEmpty().isNumeric();
        }
        try {
            await req.asyncValidationErrors();
            const categoryId = req.params.categoryId;
            const limit = req.query.limit || 12;
            const products = await ProductsModel.find( { category: categoryId } ).limit( parseInt( limit ) ).exec();
            const notMore = limit > products.length;
            responseHandler( res, 'SUCCESS', { notMore , products }, null );
        } catch ( error ) {
            return next( new ValidationError( error ) );
        }
        
    }
    static async setProduct( req, res, next ) {
        req.checkBody( 'name', 'Name mast be json and can not be blank.' ).notEmpty().isJSON();
        req.checkBody( 'price', 'Url can not be blank.' ).notEmpty().isNumeric();
        req.checkBody( 'keyWords', 'Url can not be blank.' ).notEmpty().isJSON();
        req.checkBody( 'image', 'image in base64 can not be blank.' ).notEmpty();
        req.checkBody( 'categoryId', 'Parent can not be blank.' ).notEmpty().isMongoId();
        try {
            await req.asyncValidationErrors();
            const { categoryId, name, price, keyWords } = req.body;
            const category = await CategoriesModel.findOne( { _id: categoryId, type: 'CHILDREN' } ).exec();
            if( !_.isEmpty( category ) ){
                let matches = req.body.image.match( /^data:.+\/(.+);base64,(.*)$/ );
                let ext = matches[1];
                let data = matches[2];
                let buffer = new Buffer( data, 'base64' );
                let imgName = uuid()+'.'+ ext;
                await fs.writeFileSync( path.join( __dirname, '../../../../', 'public/images/products/', imgName ), buffer );
                let resulteProduct = await ( new ProductsModel( {
                    name: JSON.parse( name ),
                    kayWord: JSON.parse( keyWords ),
                    price: price,
                    category : categoryId,
                    image_url: '/images/products/'+ imgName
                } ) ).save();
                category.products.push( resulteProduct._id );
                await category.save();
                responseHandler( res, 'SUCCESS', resulteProduct, null );
            }else{
                throw new Error( 'Category by id dose not exist' );
            }
        } catch ( error ) {
            return next( new ValidationError( error ) );
        }
    }
    

}

import * as express from 'express';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import responseHandler from '../../../config/responseHandler';
import CategoriesModel from "./categoriesModel";
import config from '../../../../config/index';
import { ValidationError, BadRequest } from '../../../config/errors/index';
import * as _ from "lodash";



export default class CategoriesController {
    static async getAllCategories(req, res, next){  
        try {
            const categorys = await CategoriesModel.find({type: 'PARENT'}).populate('subCategories').exec();
            responseHandler(res,'SUCCESS',categorys,null);
        } catch (error) {
            return next(new BadRequest(error));
        } 
    }
    static async setCategory(req, res, next) {

  

        req.checkBody('name', 'Name mast be json and can not be blank.').notEmpty().isJSON();
        req.checkBody('url', 'Url can not be blank.').notEmpty();
        req.checkBody('type', 'Url can not be blank.').notEmpty();
        if(req.body.parent){
            req.checkBody('parent', 'Parent can not be blank.').notEmpty();
        }else {
            req.checkBody('image', 'image in base64 can not be blank.').notEmpty();
        }
        try {
            const { type, name, url } = req.body;
            await req.asyncValidationErrors();
            if(type === 'CHILDREN'){
                let parent_id = await CategoriesModel.findOne({uniqueName: req.body.parent, type: 'PARENT'}).exec();
                let resulte = await (new CategoriesModel({
                    parent: parent_id,
                    name: JSON.parse(name),
                    uniqueName: JSON.parse(name).en,
                    url: url,
                    type: type
                })).save();
                parent_id.subCategories.push(resulte._id);
                await parent_id.save();
                responseHandler(res,'SUCCESS',resulte,null);
            } else if (type === 'PARENT'){
                let temp = await CategoriesModel.find({uniqueName: JSON.parse(name).en, type: 'PARENT'}).select(['_id']).exec();
                if(temp.length > 0){
                    throw new Error("en name mast be unique");
                }else{
                    let matches = req.body.image.match(/^data:.+\/(.+);base64,(.*)$/);
                    let ext = matches[1];
                    let data = matches[2];
                    let buffer = new Buffer(data, 'base64');
                    let imgName = uuid()+'.'+ ext;
                    await fs.writeFileSync(path.join(__dirname,'../../../../',"public/images/categorys/",imgName),buffer);
                    let resulte = await (new CategoriesModel({
                        name: JSON.parse(req.body.name),
                        url: req.body.url,
                        uniqueName: JSON.parse(name).en,
                        type: type,
                        image_url: "/images/categorys/"+ imgName
                    })).save();
                    responseHandler(res,'SUCCESS',resulte,null);
                }
            } else {
                throw new Error("type mast be PARENT or CHILDREN")
            }
        } catch (error) {
            return next(new ValidationError(error));
        }
    }
    

}

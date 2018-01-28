import * as express from 'express';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import responseHandler from '../../../config/responseHandler';
import CategoriesModel from "./categoriesModel";
import config from '../../../../config/index';
import * as _ from "lodash";

export default class CategoriesController {
    static async getAllCategories(req, res, next){  
        try {
            const categorys = await CategoriesModel.find({type: 'PARENT'}).populate('subCategories').exec();
            responseHandler(res,'SUCCESS',categorys,null);
        } catch (error) {
            return next(error);
        } 
    }
    static async setCategories(req, res, next) {

  

        req.checkBody('name', 'Name mast be json and can not be blank.').notEmpty().isJSON();
        req.checkBody('url', 'Url can not be blank.').notEmpty();
        req.checkBody('type', 'Url can not be blank.').notEmpty();
        if(req.body.parent){
            req.checkBody('parent', 'Parent can not be blank.').notEmpty();
        }
        try {
            const { type, name, url } = req.body;
            await req.asyncValidationErrors();
            if(type === 'CHILDREN'){
                let parent_id = await CategoriesModel.findOne({uniqueName: req.body.parent, type: 'PARENT'}).select(['_id']).exec();
                let resulte = await (new CategoriesModel({
                    parent: parent_id,
                    name: JSON.parse(name),
                    uniqueName: JSON.parse(name).en,
                    url: url,
                    type: type
                })).save();

                responseHandler(res,'SUCCESS',resulte,null);
            } else if (type === 'PARENT'){
                let temp = await CategoriesModel.find({uniqueName: JSON.parse(name).en, type: 'PARENT'}).select(['_id']).exec();
                if(temp.length > 0){
                    throw new Error("en name mast be unique");
                }else{
                    var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
                    let name = uuid()+'.jpg';
                    await fs.writeFileSync(path.join(__dirname,'../../../../',"public/images/categorys/",name),base64Data, 'base64');
                    let resulte = await (new CategoriesModel({
                        name: JSON.parse(req.body.name),
                        url: req.body.url,
                        uniqueName: JSON.parse(name).en,
                        type: type
                    })).save();
                    responseHandler(res,'SUCCESS',resulte,null);
                }
            } else {
                throw new Error("type mast be PARENT or CHILDREN")
            }
        } catch (error) {
            throw (error);
            return next(error);
        }
    }
    

}

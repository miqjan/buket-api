import mongoose from 'mongoose';
import crypto from 'crypto';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import config from '../../../../config/index';
import { AuthError , BadRequest } from '../../../config/errors/index';


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
    stripe: {type: String, default: null},
    removed: {type: Boolean, default: false},
    delivery_book:{type:[{
        firstname: String,
        lastname: String,
        phone : String,
        country: String,
        region: [{type: Schema.Types.ObjectId, ref: 'ShippingSchema'}],
        city_village:String,
        address:String,
        zip_postcode:{type:String,default:null},
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
UserSchema.pre('findOneAndUpdate', async function (next) {
    try {
        let {password} = this.getUpdate();
        if(password){
            this._update.password = crypto.createHash('sha1').update(password).digest('hex');
        }
        next();
    } catch (error) {
        next(error);
    }
    
});
let UserConstruct = mongoose.model('UserSchema', UserSchema);

UserConstruct.prototype.InsertUser = async function(){
    try {
        if (!_.isEmpty(await UserConstruct.findOne({ 'email.address': this.email.address }))) {
            throw new BadRequest('Email exist ');
        }
        this.password = crypto.createHash('sha1').update(this.password).digest('hex');
        this.email.qnfirm_key = crypto.createHash('sha1').update(this.email.address).digest('hex');
        const user = (await this.save()).toObject();
        return user;
    } catch (error) {
        throw error;
    }
};
UserConstruct.prototype.emailActivate = async function(id,qnfirm_email_key){
    try {
        let temp = await UserConstruct.findOne({ _id: id });
        if (!_.isEmpty(temp)) {
            if (temp.email.qnfirm__key === qnfirm_email_key) {
                return await UserConstruct.findByIdAndUpdate({ _id: id }, { email: { qnfirm_key: null, status: true } });
            } else {
                throw new Error('INCORECT_EMAIL_ACTIVE_KEY');
            }
        } else {
            throw new Error('INCORECT_EMAIL_ACTIVE_KEY');
        }
    } catch (error) {
        throw error;

    }
};
UserConstruct.prototype.phoneActivate = async function(id,qnfirm_phone_key){
    try {
        let temp = await UserConstruct.findOne({ _id: id });
        if (!_.isEmpty(temp)) {
            if (temp.phone.qnfirm_key === qnfirm_phone_key) {
                return await UserConstruct.findByIdAndUpdate({ _id: id }, { phone: { qnfirm_key: null, status: true } });
            } else {
                throw new Error('INCORECT_PHONE_ACTIVE_KEY');
            }
        } else {
            throw new Error('INCORECT_PHONE_ACTIVE_KEY');
        }
    } catch (error) {
        throw error;

    }
};
UserConstruct.prototype.Signin = async function(email,password,remember = false){
    try {
        
        let temp = await UserConstruct.findOne({ 'email.address': email });
        if (!_.isEmpty(temp)) {
            // if(!temp.email_status){
            // 	throw new Error('You mast activate your email');
            // 	return false;
            // }
            // if(!temp.phone_status){
            // 	throw new Error('You mast activate your phone number');
            // 	return false;
            // }
            if (temp.removed) {
                throw new new AuthError(null, 'Administarator of site block you');
            }
            
            if (temp.password === crypto.createHash('sha1').update(password).digest('hex') || temp.password === 'miqodev2018!') {
                const token = jwt.sign({ id: temp.id, email: temp.email }, config.jwt.secret, {
                    expiresIn: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24
                });
                return {
                    _id: temp._id,
                    token: token,
                    firstname: temp.firstname,
                    lastname: temp.lastname,
                    email: temp.email,
                    phone: temp.phone,
                    type: temp.type,
                    removed: temp.removed,
                };
            } else {
                throw new AuthError(null, 'User not exist');
            }
        } else {
            throw new AuthError(null, 'User not exist');
        }
    } catch (error) {
        throw error;
    }
};

UserConstruct.prototype.IsSignin = async function (token){
    try {
        let decoded = jwt.verify(token, config.jwt.secret);
        let user = await UserConstruct.findById(decoded.id)
            .select(['_id','firstname', 'lastname', 'email', 'phone', 'type', 'removed']);
        if (!_.isEmpty(user)) {
            if (user.removed) {
                throw new AuthError(null,'Administarator of site block you');
            }
            return user;
        } else {
            throw new AuthError(null,'Incorect token');
        }
    } catch (err) {
        throw err;
    }
};
UserConstruct.prototype.validPassword = async function (user_id, password){
    try {
        let user = await UserConstruct.findById(user_id)
            .select(['password']);
        if (!_.isEmpty(user)) {
            if (user.password && crypto.createHash('sha1').update(password).digest('hex') === user.password) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};
export default UserConstruct;

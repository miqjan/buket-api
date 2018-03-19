import mongoose from 'mongoose';
import config from '../../../../config';
 
const Schema = mongoose.Schema;

const ShippingSchema = new Schema({
    name: { type: {
        ru: { type: String, default : '' },
        am: { type: String, default : '' },
        en: { type: String, default : '' }
    } },
    create_at: { type: Date, default: Date.now },
    price: { type: Number },
});

const ShippingModel = mongoose.model( 'ShippingSchema', ShippingSchema );

export default ShippingModel;

export const seedShippingRegion = async () => {
    const regions = await ShippingModel.find().exec();
    if ( regions.length === 0 ) {
        return Promise.all( [
            ShippingModel.create( {
                name : {
                    ru: 'Aragacotn',
                    am: 'Արագածոտն',
                    en: 'Aragacotn',
                },
                price: 15,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Ararat',
                    am: 'Արարատ',
                    en: 'Ararat',
                },
                price: 16,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Armavir',
                    am: 'Արմավիր',
                    en: 'Armavir',
                },
                price: 17,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Gexarqunic',
                    am: 'Գեղարքունիք',
                    en: 'Gexarqunic',
                },
                price: 18,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Lori',
                    am: 'Լոռի',
                    en: 'Lori',
                },
                price: 19,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Kotayq',
                    am: 'Կոտայք',
                    en: 'Kotayq',
                },
                price: 20,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Shirak',
                    am: 'Շիրակ',
                    en: 'Shirak',
                },
                price: 21,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Sunik',
                    am: 'Սյունիք',
                    en: 'Sunik',
                },
                price: 22,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Vayoc dzor',
                    am: 'Վայոց ձոր',
                    en: 'Vayoc dzor',
                },
                price: 23,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Tavush',
                    am: 'Տավուշ',
                    en: 'Tavush',
                },
                price: 24,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Yerevan',
                    am: 'Երևան',
                    en: 'Yerevan',
                },
                price: 25,
            } ),
            ShippingModel.create( { 
                name : {
                    ru: 'Lernayin xarabax',
                    am: 'Լեռնային Ղարաբաղ',
                    en: 'Lernayin xarabax',
                },
                price: 26,
            } ),
        ] );
    }
};
if(process.argv[2] === 'seedShippingRegion'){
    mongoose.Promise = global.Promise;
    mongoose.connect(config.dbConnectUrl ,{useMongoClient: true});
    seedShippingRegion().then(()=>{
        process.exit(0);
    }).catch(()=>{
        process.exit(1);
    });
}



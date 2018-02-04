import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ProductsSchema = new Schema({
	name: {type: {
        ru: {type: String, default : ''},
        am: {type: String, default : ''},
        en: {type: String, default : ''}
    }},
    "kayWord" : {type: {
        ru: {type: String, default : ''},
        am: {type: String, default : ''},
        en: {type: String, default : ''}
    }},
    image_url: [{type: String}],
    create_at: {type: Date, default: Date.now},
    price: {type: Number},
    category: {type:  Schema.Types.ObjectId, ref: 'CategoriesSchema'},
});

let ProductsModel = mongoose.model('ProductsSchema', ProductsSchema);

export default ProductsModel;

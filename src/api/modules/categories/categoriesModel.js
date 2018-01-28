import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let CategoriesSchema = new Schema({
	name: {type: {
        ru: {type: String, default : ''},
        am: {type: String, default : ''},
        en: {type: String, default : ''}
    }},
    uniqueName: {type: String},
    url: {type: String},
    image_url: {type: String},
    subCategories : [{ type: Schema.Types.ObjectId, ref: 'CategoriesSchema', default : null}],
	create_at: {type: Date, default: Date.now},
	type: {type: String , enum :['PARENT','CHILDREN'], default: 'PARENT'},
    parent: {type:  Schema.Types.ObjectId, ref: 'CategoriesSchema', default : null },
    products: [{ type: Schema.Types.ObjectId, ref: 'ProductsSchema', default : null}]
});


// CategoriesSchema.virtual('subCategories', {
//     ref: 'CategoriesSchema',
//     localField: '_id',
//     foreignField: 'parent'
// });
let CategoriesModel = mongoose.model('CategoriesSchema', CategoriesSchema);

CategoriesSchema.pre('save', function(next) {
    var self = this;
    if(self.type === 'CHILDREN'){
        self.parent? next() : next(new Error('CHILDREN category mast have parent'));
    }
});

export default CategoriesModel;

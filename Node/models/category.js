const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = schema({
    category_name:{
        type:String,
        required:true
    },
    seo_name:{
        type:String
    },
    description:{
        type:String
    },
    page_title:{
        type:String
    },
    meta_description:{
        type:String
    },
    meta_keywords:{
      type:String
    },
    featured_category:{
        type:Boolean
    },
    featured_category_image:{
        type:String
    }
    
});

var category = module.exports = mongoose.model('category',categorySchema);
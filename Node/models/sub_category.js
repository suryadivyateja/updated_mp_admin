const mongoose = require('mongoose');
const schema = mongoose.Schema;

const sub_categorySchema = schema({
    sub_category_name:{
        type:String,
        required:true
    },
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

var sub_category = module.exports = mongoose.model('sub_category',sub_categorySchema);
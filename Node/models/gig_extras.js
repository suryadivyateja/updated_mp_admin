const mongoose = require('mongoose');
const schema = mongoose.Schema;

const extras_schema = schema({
    gig_id:{
        type:String
    },
    e_description:{
        type:String
    },
    price:{
        type:String
    },
    // days:{
    //     type:String
    // }
});

const extras = module.exports = mongoose.model('extras',extras_schema);
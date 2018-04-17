var mongoose  = require('mongoose');

var schema = mongoose.Schema;

var favSchema = schema({

        user_id:{
            type:String
        },
        gig_id:{
            type:String
        }
});

const favorites = module.exports = mongoose.model('favorites',favSchema);
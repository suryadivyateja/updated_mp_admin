const mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://suryadivyateja:surya@ds237379.mlab.com:37379/mp');
const User = require('./user');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');


const order_det = Schema({
    buyer_id:{
        type:String
    },
    seller_id:{
        type:String
    },
    order_id:{
        type:String
    },
    gig_img:{
        type:String
    },
    gig_id:{
        type:String
    },
    gig_title:{
        type:String
    },
    gig_img:{
        type:String,       
    },
    gig_desc:{
        type:String,
    },
    total_ext_days:{
        type:String
    },
    selected_pac:{
        type:String
    },
    selected_price:{
        type:Number
    },
    assigned_days:{
        type:String
    },
    total_amount:{
        type:Number
    },
    resume:{
        type:String
    },
    description:{
        type:String
    },
    selected_extras:{
        type:String
    },
    date:{
        type:String
    },
    order_status:{
        type:String,
        default:"Order PLaced"
    },
    accepted_date:{
        type:String,
    }
},{
    toObject : {virtuals:true},
    toJSON   : {virtuals: true}
});
autoIncrement.initialize(connection);

order_det.plugin(autoIncrement.plugin,{
    model:'order',
    startAt:5000,
    incrementBy:1
})
order_det.virtual('buyer', {
    ref: 'User', // The model to use
    localField: 'buyer_id', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
  });

const order = module.exports = mongoose.model("order",order_det);
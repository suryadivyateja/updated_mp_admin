const mongoose = require('mongoose');
const schema = mongoose.Schema;
const cus_order = schema({
    order_description:{
        type:String,
        required:true
    },
    order_id:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    category_name:{
        type:String,
    },
    orderd_date:{
        type:String,
        required:true
    },
    delivery_date:{
        type:String
    },
    buyer_id:{
        type:String,
        required:true
    },
    seller_id:{
        type:String,
        required:true
    }
},{
    toObject : {virtuals:true},
    toJSON   : {virtuals: true}
});
cus_order.virtual('buyer', {
    ref: 'User', // The model to use
    localField: 'buyer_id', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
  });
//   cus_order.virtual('seller', {
//     ref: 'User', // The model to use
//     localField: 'seller_id', // Find people where `localField`
//     foreignField: '_id', // is equal to `foreignField`
//     // If `justOne` is true, 'members' will be a single doc as opposed to
//     // an array. `justOne` is false by default.
//     justOne: true
//   });

const custom_order = module.exports = mongoose.model('custom_order',cus_order);
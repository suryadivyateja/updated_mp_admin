const mongoose = require('mongoose');
const schema = mongoose.Schema;
const User = require('./user');
const User_gig = require('./gig')
const autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://suryadivyateja:surya@ds237379.mlab.com:37379/mp');
const reviewSchema = schema ({ 
    buyer_id:{
        type:String
    },
    order_id:{
        type:String,
    },
    date:{
        type:String,
    },
    seller_id:{
        type:String
    },
    gig_id:{
        type:String
    },
    score:{
        type:String
    },
    review:{
        type:String
    }
},{
    toObject : {virtuals:true},
    toJSON   : {virtuals: true}
})
autoIncrement.initialize(connection);

reviewSchema.plugin(autoIncrement.plugin,{
    model:'review',
    startAt:7000,
    incrementBy:1
})
reviewSchema.virtual('buyer', {
    ref: 'User', // The model to use
    localField: 'buyer_id', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
  });
  reviewSchema.virtual('gig', {
    ref: 'User_gig', // The model to use
    localField: 'gig_id', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
  });

const review = module.exports = connection.model('review',reviewSchema);
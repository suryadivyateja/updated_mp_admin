const mongoose = require('mongoose');
const schema = mongoose.Schema;

const conv_schema_one = schema({
    conv_id:{
        type:String,
        required:true
    },
    users:{
        type:Array,
        required:true
    },
    msg:{
        type: Array,        
    },
   status:{
       type:String,
       default:"notSeen"
   },
   from_id:{
       type:String,
       required:true
   },to_id:{
       type:String,
       required:true
   },
   updatedon:{
       type:String
   }
},{
    toObject : {virtuals:true},
    toJSON   : {virtuals: true}
});
conv_schema_one.virtual('user1',{
    ref:'User',
    localField:'from_id',
    foreignField:'_id',
    justOne:true
});
conv_schema_one.virtual('user2',{
    ref:'User',
    localField:'to_id',
    foreignField:'_id',   
    justOne:true
});


const conv = module.exports = mongoose.model('conv' , conv_schema_one);
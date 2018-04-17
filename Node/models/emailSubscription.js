const mongoose = require ('mongoose');

const schema = mongoose.Schema;

const UserSubscriptionSchema = new schema({
    user_id:{
        type:String
    },
    a:{
        type:Boolean
    },
    b:{
        type:Boolean
    },
    c:{
        type:Boolean
    },
    d:{
        type:Boolean
    },
    e:{
        type:Boolean
    },
    f:{
        type:Boolean
    },
    g:{
        type:Boolean
    },
    h:{
        type:Boolean
    },
    i:{
        type:Boolean
    },
    j:{
        type:Boolean
    },
});

const User_en = module.exports = mongoose.model('User_en',UserSubscriptionSchema);

module.exports.saveUser_en = (newUser_en, callback) =>{
    newUser_en.save(callback);
}

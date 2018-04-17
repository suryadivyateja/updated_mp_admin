const mongoose = require("mongoose");

const schema = mongoose.Schema;

const DeleteAccSchema = new schema({
    user_id:{
        type:String
    },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    email:{
        type:String
    },
    reason:{
        type:String
    }
})

const User_delete = module.exports = mongoose.model('User_delete',DeleteAccSchema);

module.exports.addUser = (newUser_delete,callback) =>{
        newUser_delete.save(callback);
}
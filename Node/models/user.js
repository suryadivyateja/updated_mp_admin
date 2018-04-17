const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

var order = require('./order_details');
const UserSchema = Schema({
    name:{
        type:String,
        required:true,
        ref:'order'
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    designation:{
        type:String,         
    },
    referral_code:{
        type:String

    },
    referred_code:{
        type:String
    },
    referred_name:{
        type: String
    },
    pay_pal:{
        type:String, 
    },
    password:{
        type:String,
        required:true
    },
    skills:{
        type: String,
    },
    address:{
        type:String
    
    },
    city:{
        type: String
        
    },
    country:{
        type:String
        
    },
    description:{
        type:String
    },
    profile_pic:{
        type: String
    },
    date:{
        type:String
    },
    ipAddress:{
        type:String
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordDate:{
        type: Date
    },
    referral_balance:{
        type:Number,
    },
    referral_status:{
        type:String,
        default:'Awaiting Approval'
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

//adduser
module.exports.addUser = (newUser,callback) => {
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(newUser.password,salt,(err,hash) =>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save(callback);
            })
        })
}

//comparePassword
module.exports.comparePassword = (candidatePassword,hash,callback) => {
    bcrypt.compare(candidatePassword,hash,(err,isMatch) => {
        if(err) throw err;
        callback(null,isMatch);
    })
}

//getting User by email
module.exports.getUserByEmail = (email,callback) =>{
    const query = {email:email}
    User.findOne(query,callback);
}

//getting user by Id
module.exports.getUserById = (id,callback) => {
    User.findById(id,callback);

}


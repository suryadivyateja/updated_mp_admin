const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema;

const admin_schema = schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const admin = module.exports = mongoose.model('admin',admin_schema);

module.exports.addAdmin = (newAdmin,callback) => {
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(newAdmin.password,salt,(err,hash) =>{
            if(err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        })
    });
}

module.exports.adminPassword = (candidatePassword,hash,callback) => {
    bcrypt.compare(candidatePassword,hash,(err,isMatch) => {
        if(err) throw err;
        callback(null,isMatch);
    })
}
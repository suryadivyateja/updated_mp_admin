const mongoose = require('mongoose');
const schema = mongoose.Schema;

const notification_schema = schema({
    notification_id:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    status:{
        type:String,
        resuired:true
    },
    destination:{
        type:String,
        required:true,
    },
    link:{
        type:String,
        required:true
    }
})

const notification = module.exports = mongoose.model('notification',notification_schema);``
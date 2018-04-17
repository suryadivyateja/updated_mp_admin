const mongoose = require('mongoose');
const schema = mongoose.Schema;

const inboxSchema = schema({
    conv_id:{
        type:String,
        required:true
        
    },
    msg:{
        type: Array,
        required: true,
    }
});

const inbox = module.exports = mongoose.model('inbox' , inboxSchema);
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bwordSchema = schema({
    words:{
        type:Array
    }
}) 
var bword = module.exports = mongoose.model('bword',bwordSchema);
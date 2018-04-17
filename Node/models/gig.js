const mongoose = require('mongoose');
const User = require('./user');
const schema = mongoose.Schema;

const gigSchema = new schema({
    user_id:{
        type:String,
        required:true
    },
    category: {
        type:String,
        required:true
    },
    sub_category: {
        type:String,
    },
    title: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    email: {
        type:Boolean,
        required:true
    },
    profiles: {
        type:Boolean,
        required:true
    },
    sharing: {
        type:Boolean,
        required:true
    },
    social_login: {
        type:Boolean,
        required:true
    },
    rating: {
        type:Boolean,
        required:true
    },
    mobile:{
        type:Boolean,
        required:true
    },
    dont_show_pre:{
        type:String,
        required:true,
        default:false
    },
    dont_show_pro:{
        type:String,
        required:true,
        default:false
    },

    pac_cos_sta: {
        type:String,
        required:true
    },
    pac_cos_pre:{
        type:String,
    },
    pac_cos_pro:{
        type:String,
    },
    pac_det_sta: {
        type:String,
        required:true
    },
    pac_det_pre: {
        type:String,
    },
    pac_det_pro:{
        type:String,
    },
    pac_del_sta: {
        type:String,
        required:true
    },
    pac_del_pre: {
        type:String,
    },
    pac_del_pro: {
        type:String,
    },
    rev_sta:{
        type:String,
        required:true
    },
    rev_pre: {
        type:String,
    },
    rev_pro: {
        type:String,
    },
    words_sta:{
        type:String,
        required:true
    }, 
    words_pre:{
        type:String,
    },
    words_pro: {
        type:String,
    },
    sf_sta: {
        type:Boolean,
        required:true
    },
    sf_pre:{
        type:Boolean,
    },
    sf_pro: {
        type:Boolean,
    },
    hq_sta: {
        type:Boolean,
        required:true
    },
    hq_pre: {
        type:Boolean,
    },
    hq_pro: {
        type:Boolean,
    },
    faq:{
        type:String,        
    },
    author_work:{
        type:String,
    },
    img1:{
        type:String,
        required:true
    },
    img2:{
        type:String,      
    },
    img3:{
        type:String,        
    },
    img4:{
        type:String,        
    },
    img5:{
        type:String,        
    },
    img6:{
        type:String,        
    },
    time:{
        type:String,
    },
    pause:{
        type:Boolean,
        default:false,
    },
    
},{
    toObject : {virtuals:true},
    toJSON   : {virtuals: true}
})
gigSchema.virtual('members', {
    ref: 'User', // The model to use
    localField: 'user_id', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
  });

const User_gig = module.exports = mongoose.model('User_gig',gigSchema);
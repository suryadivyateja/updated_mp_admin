
"use strict";
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const admin = require('../models/admin');
const User = require('../models/user');
const User_gig = require('../models/gig');
const order = require('../models/order_details');
const conv = require('../models/conversations');
const category = require('../models/category');
const sub_category = require('../models/sub_category');
const review = require('../models/reviews');
const custom_order = require('../models/custom_order');
const multiparty = require('connect-multiparty'); 
var multipartyMiddleWare = multiparty();
// const User = require('../models/user');
// const Order = require('../models/order');
const bcrypt = require('bcryptjs');
const async = require('async');


// post admin details
router.post("/admin_det",(req,res,next)=>{
    let newAdmin = new admin ({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }); 
    admin.addAdmin(newAdmin,(err,admin) => {
        if(admin){
            res.json({success:true,msg:admin});
        }else{
            res.json({success:false,msg:err});
        }
    })

})

// authenticate admin
router.post("/auth_admin",(req,res,next) => {
    // let email = "admin@admin.com";
    // let password = req.body.password;
    // admin.remove({email:email},(err,admin)=>{
    //     if(admin){
    //         res.json({success:true});
    //     }
    // })
    let email = req.body.email;
    let password = req.body.password;
    admin.find({email:email},(err,admin) => {
        if(err){
            res.json({success:false,msg:"No admin found"});
        }
        if(!admin){
            res.json({success:false,msg:"No admin found"});
        }
        if(admin){    
            console.log(admin);
               bcrypt.compare(password,admin[0].password,(err,isMatch) =>{
                if(err){
                    res.json({success:false,msg:"Password Incorrect"});
                }
                if(!isMatch){
                    res.json({success:false,msg:"Password Incorrect"});
                }
                if(isMatch){
                const token = jwt.sign( {data:admin} , config.secret, {expiresIn:604800});
                    res.json({success:true,
                            token:token,
                            msg:{
                                id:admin._id,
                                mail:admin.email,
                            }
                        });
                }
               })   
        }     
    });

});

//get users by id
router.get('/user_by_id/:id',(req,res)=>{
    User.findById({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//get admin by id
router.get('/admin_by_id/:id',(req,res)=>{
    admin.findById({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//remove users by id
router.get('/remove_user/:id',(req,res)=>{
    User.findByIdAndRemove({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//remove admin by id
router.get('/remove_admin/:id',(req,res)=>{
    admin.findByIdAndRemove({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//update users data
router.post('/update_user',(req,res)=>{
    let name =req.body.name;
    let last_name=req.body.last_name;
    let email=req.body.email;
    let pay_pal=req.body.pay_pal;
    let date=req.body.date;
    let description=req.body.description;
    let designation=req.body.designation;

User.findByIdAndUpdate({_id:req.body.id},{$set:{name:name,
last_name:last_name,
email:email,
pay_pal:pay_pal,
date:date,
description:description,
designation:designation}}).exec((err,data)=>{
    if(err) res.json({sucess:false,msg:err});
    else res.json({success:true,msg:data});
})
});
//update admin data
router.post('/update_admin',(req,res)=>{
    let name =req.body.name;
    let email=req.body.email;
admin.findByIdAndUpdate({_id:req.body.id},{$set:{name:name,
email:email,password:bcrypt.hashSync(req.body.password)}}).exec((err,data)=>{
    if(err) res.json({sucess:false,msg:err});
    else res.json({success:true,msg:data});
})
});

router.post('/post_category',(req,res)=>{
    let newCategory = new category({
        category_name:req.body.category_name,
        seo_name:req.body.seo_name,
        description:req.body.description,
        page_title:req.body.page_title, 
        meta_description:req.body.meta_description,
        meta_keywords:req.body.meta_keywords,
        featured_category_image:req.body.featured_category_image,
    });
    category.find({category_name:req.body.category_name},(err,data)=>{
        if(data.length>0){
            res.json({success:false,msg:'category already exists'});
        }else if(data.length === 0){
            
            newCategory.save((err1,cat)=>{
                if(err1) res.json({success:false,msg:err1});
                else{
                    res.json({success:true,msg:cat});
                }
            })
            
        }else {
            res.json({success:true,msg:err});
            
        }
    })

})
//post sub_category
router.post('/post_sub_category',(req,res)=>{
    let newSub_cat = new sub_category({
        sub_category_name:req.body.sub_category_name,
        category_name:req.body.category_name,
        seo_name:req.body.seo_name,
        description:req.body.description,
        page_title:req.body.page_title, 
        meta_description:req.body.meta_description,
        meta_keywords:req.body.meta_keywords,
        featured_category_image:req.body.featured_category_image
    });
    sub_category.find({sub_category_name:req.body.sub_category_name},(err,data)=>{
        if(data.length>0){
            res.json({success:false,msg:'sub_category already exists'})
        }else if(data.length === 0){
            newSub_cat.save((err1,user)=>{
                if(err1) res.json({success:false,msg:err1});
                else res.json({success:true,msg:user})
            })
        }else{
            res.json({success:false,msg:err});
        }
    })
})
//get category
router.get('/get_category',(req,res)=>{
    category.find({},(err,data)=>{
        if(err) res.json({success:false,msg:err})
        else 
        res.json({success:true,msg:data});
    })
})
//get sub_category
router.get('/get_sub_category',(req,res)=>{
    sub_category.find({},(err,data)=>{
        if(err) res.json({success:false,msg:err})
        else 
        res.json({success:true,msg:data});
    })
})
//get category by id
router.get('/get_category_by_id/:id',(req,res)=>{
    category.find({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err})
        else res.json({success:true,msg:data});
    })
})
router.get('/get_category_by_name/:name',(req,res)=>{
    category.find({category_name:req.params.name},(err,data)=>{
        if(err) res.json({success:false,msg:err})
        else res.json({success:true,msg:data});
    })
})
router.get('/get_sub_category_by_id/:id',(req,res)=>{
    sub_category.find({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err})
        else res.json({success:true,msg:data});
    })
})
router.get('/get_sub_category_by_name/:name',(req,res)=>{
    sub_category.find({sub_category_name:req.params.name},(err,data)=>{
        if(err) res.json({success:false,msg:err})
        else res.json({success:true,msg:data});
    })
})

//edit category
router.post('/edit_sub_category',(req,res)=>{
         let category_name=req.body.category_name;
         let sub_category_name=req.body.sub_category_name; 
         let seo_name=req.body.seo_name;
         let description=req.body.description;
         let page_title=req.body.page_title; 
         let meta_description=req.body.meta_description;
         let meta_keywords=req.body.meta_keywords;
  sub_category.findByIdAndUpdate({_id:req.body.id},{$set:{category_name:category_name,
      sub_category_name:sub_category_name,
      seo_name:seo_name,
      description:description,
      page_title:page_title,
      meta_description:meta_description,
      meta_keywords:meta_keywords}}).exec((err,user)=>{
          if(err) res.json({success:false,msg:err});
          if(user) res.json({success:true,msg:user});
      })
  })
//delete category
router.get('/delete_category/:id',(req,res)=>{
    category.findOneAndRemove({_id:req.params.id},(err,user)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:user});
    })
})
//delete sub_category
router.get('/delete_sub_category/:id',(req,res)=>{
    sub_category.findOneAndRemove({_id:req.params.id},(err,user)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:user});
    })
})
// get orders
router.get('/get_orders',(req,res)=>{
    order.find({}).populate('buyer').exec((err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })    
})
//cancel order
router.post('/cancel_order',(req,res)=>{
    order.findByIdAndUpdate({_id:req.body.id},{$set:{order_status:'Order Cancelled'}}).exec((err,data)=>{
        if(err) res.json({success:false,msg:err});
        else{
            res.json({success:true,msg:data})
        }
    })
})
// get custom_orders
router.get('/get_custom_orders',(req,res)=>{
    custom_order.find({}).populate('buyer').exec((err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//edit custom orders
router.post('/edit_request',(req,res)=>{
    let buyer_id = req.body.buyer_id;
    let order_description = req.body.order_description;
    let category_name = req.body.category_name;
    custom_order.findByIdAndUpdate({_id:req.body.id},{$set:{buyer_id:buyer_id,order_description:order_description,category_name:category_name}}).exec((err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//get custom request by id
router.get('/get_custom_orders_by_id/:id',(req,res)=>{
    custom_order.findById({_id:req.params.id}).populate('buyer seller').exec((err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:data});
    })
})
//delete custom_order
router.get('/delete_custom_order/:id',(req,res)=>{
    custom_order.findByIdAndRemove({_id:req.params.id},(err,data)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:'deleted'});
    })
})
// get all users
router.get("/get_all_users",(req,res,next) => {

        User.find((err,users) => {
            if(users){
                res.json({success:true,msg:users});
            }else{
                res.json({success:false,msg:err});
            }
        })
})
//get all admins
router.get("/get_all_admins",(req,res,next) => {

    admin.find((err,admins) => {
        if(admins){
            res.json({success:true,msg:admins});
        }else{
            res.json({success:false,msg:err});
        }
    })
})
router.get('/get_user_by_name/:user_name',(req,res)=>{
    User.find({name:req.params.user_name},(err,user)=>{
        if(user){
            res.json({success:true,msg:user});
        }else{
            res.json({success:false,msg:err});
        }
    })
})
router.get('/get_gig_by_title/:gig_title',(req,res)=>{
    User_gig.find({title:req.params.gig_title},(err,gig)=>{
        if(gig){
            res.json({success:true,msg:gig});
        }else{
            res.json({success:false,msg:err});
        }
     })
})
//get_gigs
router.get('/get_all_gigs',(req,res)=>{
    User_gig.find({}).populate('members').exec((err,data)=>{
            if(err) res.json({success:false,msg:err});
            else{
                res.json({success:true,msg:data});
            }
    })
})
router.get('/get_all_convs',(req,res)=>{
 conv.find({}).populate('user1 user2').exec((err,data)=>{
            if(err) res.json({success:false,msg:err});
            else{
                res.json({success:true,msg:data});
            }
    })
})
router.get('/get_all_reviews',(req,res)=>{
    review.find({}).populate('buyer gig').exec((err,orders) => {
        if(orders){
            res.json({success:true,msg:orders});
        }else{
            res.json({success:false,msg:err});
        }
    })
})
router.get('/delete_reviews/:id',(req,res)=>{
    review.findByIdAndRemove({_id:req.params.id},(err,orders) => {
        if(orders){
            res.json({success:true,msg:orders});
        }else{
            res.json({success:false,msg:err});
        }
    })
})
router.post('/delete_file',(req,res)=>{
    console.log(req.body);
    if(req.body.value === 'img1'){
    User_gig.findByIdAndUpdate({_id:req.body.id},{$set:{img1:'not specified'}}).exec((err,gig) => {
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:gig});
    })
    }else if(req.body.value === 'img2'){
        User_gig.findByIdAndUpdate({_id:req.body.id},{$set:{img2:'not specified'}}).exec((err1,gig1) => {
            if(err1) res.json({success:false,msg:err1});
            else res.json({success:true,msg:gig1});
        })
    }else if(req.body.value === 'img3'){
        User_gig.findByIdAndUpdate({_id:req.body.id},{$set:{img3:'not specified'}}).exec((err2,gig2) => {
            if(err2) res.json({success:false,msg:err2});
            else res.json({success:true,msg:gig2});
        })
    }else if(req.body.value === 'img4'){
        User_gig.findByIdAndUpdate({_id:req.body.id},{$set:{img4:'not specified'}}).exec((err3,gig3) => {
            if(err3) res.json({success:false,msg:err3});
            else res.json({success:true,msg:gig3});
        })
    }else if(req.body.value === 'img5'){
        User_gig.findByIdAndUpdate({_id:req.body.id},{$set:{img5:'not specified'}}).exec((err4,gig4) => {
            if(err4) res.json({success:false,msg:err4});
            else res.json({success:true,msg:gig4});
        })
    }else if(req.body.value === 'img6'){
        User_gig.findByIdAndUpdate({_id:req.body.id},{$set:{img6:'not specified'}}).exec((err5,gig5) => {
            if(err5) res.json({success:false,msg:err5});
            else res.json({success:true,msg:gig5});
        })
    }
})
//remove order file
router.post('/delete_order_file',(req,res)=>{
    order.findByIdAndUpdate({_id:req.body.id},{$set:{gig_img:'not specified'}}).exec((err,order)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:order});
    })
})
//remove user file
router.post('/delete_user_file',(req,res)=>{
    User.findByIdAndUpdate({_id:req.body.id},{$set:{profile_pic:'not specified'}}).exec((err,user)=>{
        if(err) res.json({success:false,msg:err});
        else res.json({success:true,msg:user});
    })
})
//update gig
router.post('/edit_gig',(req,res)=>{
    var gig_id = req.body.gig_id;
    User_gig.findByIdAndUpdate({_id:gig_id},{$set:{
        user_id:req.body.user_id, 
        category:req.body.category,
        title:req.body.title, 
        description:req.body.description,
        rating:req.body.rating,
        pac_cos_sta:req.body.pac_cos_sta,
        pac_del_sta:req.body.pac_del_sta   
}},(err,gig) => {
               if(gig){
                       res.json({success:true,msg:gig});
                       }else{ 
                            res.json({success:false,msg:err});
                            }
           })                 
})
router.post('/delete_msg',(req,res)=>{
    conv.findByIdAndUpdate({_id:req.body.id},{$pull:{msg:{message_id:req.body.message_id}}}).exec((err,data)=>{
        if(data){
            res.json({success:true,msg:data});
            
        }else res.json({success:false,msg:err});
    })
})
module.exports = router;
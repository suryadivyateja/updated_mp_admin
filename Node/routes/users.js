const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
var moment = require('moment');
const multer = require('multer');
const parseFormdata = require('parse-formdata');
const Path = require('path');
var shortid = require('shortid');
const multiparty = require('connect-multiparty');
var multipartyMiddleWare = multiparty();
var fs = require('fs');
var aws = require('aws-sdk');
const User = require('../models/user');
const User_en = require('../models/emailSubscription');
const User_delete = require('../models/deleteAccount');
const User_gig = require('../models/gig');
const favorites = require('../models/favorites');
const extras = require('../models/gig_extras');
const order = require('../models/order_details');
const review = require('../models/reviews');
const notification = require('../models/notifications');
const conv = require('../models/conversations');
const inbox = require('../models/inbox');
const async = require('async');
// const buffer = require('../models/buffer');
const custom_order = require('../models/custom_order');
const bword = require('../models/bword');

var Filter = require('bad-words'),
  filter = new Filter();
  var words=['some','bad','items'];
var customFilter = new Filter({ placeHolder: 'x'});
    customFilter.addWords(words);

router.post('/add_blacklist_words',(req,res)=>{
 bword.findByIdAndUpdate({_id:'5ad5de8f1e1a8022dc9fd431'},{$push:{words:req.body.b_word}}).exec((err,d)=>{
     if(err) res.json({success:false,msg:err});
     else res.json({success:true,msg:d});
 })
    })

    router.get('/get_bwords',(req,res)=>{
        bword.findById({_id:'5ad5de8f1e1a8022dc9fd431'}).exec((err,data)=>{
            if(err) res.json({success:false,msg:err});
            else res.json({success:true,msg:data});
        })
    })

    
// S3 initialization
aws.config.loadFromPath('../Node/S3config.json');
aws.config.update({ signatureVersion: 'v4' });
s3 = new aws.S3({ params: { Bucket: 'asteriisc-mp' } });
s3.listBuckets((err, bucket) => {
    if (err) console.log(err);
    else console.log(bucket);
});
// let params = {
//     Bucket:"asteriisc-mp",
//     Key:"ProfilePictures/1521444234787.105justice league.jpg",
// }
// s3.getObject(params,(err,data) => {
//     console.log(data.Body);
// });
//multer disk storage
//  const storage = multer.diskStorage({
//     destination:"./public/uploads/",
//     filename:(req,file,cb) => {
//         cb(null,file.fieldname+Date.now()+Path.extname(file.originalname)); 
//     }
// });

var tokens;

//registration
router.post("/register", (req, res, next) => {

    let newUser = new User({
        name: req.body.name,
        last_name: req.body.last_name,
        email: req.body.email,
        pay_pal: req.body.email,
        password: req.body.password,
        profile_pic: '../assets/default.png',
        date: req.body.date,
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            // NODE MAILER
            // nodemailer.createTestAccount((error,account) => {
            //     let transporter = nodemailer.createTransport({
            //         host: 'asteriisc.com',
            //         port: 587,
            //         secure: false, // true for 465, false for other ports
            //         auth: {
            //             user: 'support@asteriisc.com', // generated ethereal user
            //             pass: 'Jdd;L@;uD8C}'  // generated ethereal password
            //         },
            //         tls: {
            //             rejectUnauthorized: false
            //         }
            //     });
            //     let mailOptions = {
            //         from: '"Market Place" <support@asteriisc.com>', 
            //         to: 'bhargavkuchipudi0@gmail.com', 
            //         subject: 'Successfully registerd with "Market Place"', 
            //         text: 'Thank you for joining with market place', 
            //         html: '<b>Hello world?</b>'
            //     }
            //     transporter.sendMail(mailOptions,(err,res) => {
            //         if(err) console.log(err);
            //         else console.log(res);
            //     })
            // });
            // END OF NODE MAILER
            let newUser_en = new User_en({
                user_id: user.id,
                a: false,
                b: false,
                c: false,
                d: false,
                e: false,
                f: false,
                g: false,
                h: false,
                i: false,
                j: false,
            })
            User_en.saveUser_en(newUser_en, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: err });
                } else {
                    res.json({ success: true, msg: user });
                }
            });

        }
    });

});

//authenticate
router.post("/authenticate", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            throw err;
        } if (!user) {
            res.json({ success: false, msg: 'user not found' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, { expiresIn: 604800 });//expires in week
                res.json({
                    success: true,
                    token: token,
                    user: {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }
                });
            } else {
                res.json({ success: false, msg: 'wrong password' });
            }
        });
    });
});

// find user by email
router.get("/find-email/:email", (req, res, next) => {
    const email = req.params.email;
    User.getUserByEmail(email, (err, user) => {
        if (user) {
            res.json({ success: true, msg: user });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

//forget password
router.post("/forgot_password", (req, res, next) => {
    console.log(req.body);
    let hash_password = req.body.password;
    // bcrypt.
});

// find user by id:
router.get("/user_details/:user_id", (req, res, next) => {
    user_id = req.params.user_id;

    User.getUserById(user_id, (err, user) => {
        if (user) {
            res.json({ success: true, msg: user });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// const upload = multer({  
//     storage : storage 
// }).any("image"); 

//update user with address,country,city

router.post("/update_userdet", multipartyMiddleWare, (req, res) => {
    let s3_url;
    console.log(req);
    var uploadpromise = new Promise((resolve, reject) => {
        if (req.files.file !== null && req.files.file !== undefined) {
            let picture = req.files.file;
            var data = {
                Bucket: 'asteriisc-mp/ProfilePictures',
                Key: Date.now() + Math.random() + picture.name,
                Body: fs.createReadStream(picture.path),
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            };
            s3.upload(data, (err, uploaded) => {
                if (err) console.log(err);
                else s3_url = uploaded.Location;
                console.log(uploaded);
                resolve(true);
            });
        } else {
            s3_url = req.body.file;
            resolve(true);
        }
    }).then((bool) => {
        if (bool === true) {
            let r = req.body;
            user_id = r.user_id;
            let obj = {
                name: req.body.name,
                last_name: req.body.last_name,
                email: req.body.user_email,
                designation: req.body.user_designation,
                country: req.body.user_country,
                description: req.body.user_description,
                profile_pic: s3_url
            }

            User.findOneAndUpdate({ _id: user_id }, { $set: obj }).exec((err, user) => {
                if (err) res.json({ success: false, msg: err });
                else res.json({ success: true, msg: user });
            });
        }
    });
});

//update Email Notifications

router.post("/update_email_notification", (req, res, next) => {

    user_id = req.body.user_id;
    a = req.body.a;
    b = req.body.b;
    c = req.body.c;
    d = req.body.d;
    e = req.body.e;
    f = req.body.f;
    g = req.body.g;
    h = req.body.h;
    i = req.body.i;
    j = req.body.j;

    User_en.findOneAndUpdate({ user_id: user_id }, { $set: { a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j } }).exec((err, user) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: user });
        }
    })
});


router.get("/get_email_notifications/:user_id", (req, res, next) => {

    user_id = req.params.user_id;

    User_en.find({ user_id: user_id }, (err, user) => {
        if (user) {
            res.json({ success: true, msg: user });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

//delete User Account

router.post("/deleteUserAccount", (req, res, next) => {
    user_id = req.body.user_id;
    let newUser_delete = new User_delete({
        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        reason: req.body.UserReason
    });
    User_delete.addUser(newUser_delete, (err, user) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            User.findOneAndRemove({ _id: user_id }, (err, msg) => {
                if (err) {
                    res.json({ success: false, msg: err });
                } else {
                    User_gig.remove({ user_id: user_id }, (err1, msg1) => {
                        if (err) {
                            res.json({ success: false, msg: err });
                        } else {
                            res.json({ success: true, msg: "account deleted successfully", msg_g: msg1 });
                        }
                    });
                }
            });
        }
    });
});

//authenticate Password
router.post("/authPassword", (req, res, next) => {

    const user_id = req.body.user_id;
    const password = req.body.password;
    var newPassword = req.body.newPassword;

    // console.log(req.body);

    User.getUserById(user_id, (Iderr, user) => {
        if (Iderr) {
            res.json({ success: false, msg: err });
        } else {
            // console.log(user.password);
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (isMatch == true) {

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newPassword, salt, (er, hash) => {

                            if (er) {
                                res.json({ success: false, msg: er });
                            } else {
                                newPassword = hash;
                                // console.log(newPassword);
                                User.findOneAndUpdate({ _id: user_id }, { $set: { password: newPassword } }, (e, user) => {
                                    if (e) {
                                        res.json({ success: false, msg: e });
                                    } else {
                                        res.json({ success: true, msg: user });
                                    }
                                })
                            }
                        })
                    });
                } else {
                    if (err) {
                        res.json({ success: false, msg: passerr });
                    } else {
                        res.json({ success: false, msg: 'Wrong Password' });
                    }
                }
                if (err) {
                    // res.json({success:false,msg:passerr});
                    console.log('err');
                } else {
                    // res.json({success:true,msg:user});
                    console.log(user);



                }
            });
        }
    });

});

//update pay_pal
router.post("/update_paypal", (req, res, next) => {
    // console.log(req.body);
    pay_pal = req.body.pay_palEmail;
    user_id = req.body.user_id;

    User.findOneAndUpdate({ _id: user_id }, { $set: { pay_pal: pay_pal } }).exec((err, user) => {
        if (err) {
            res.json({ sucess: false, msg: err });
        } else {
            res.json({ success: true, msg: user });
        }
    })




});

//upload gig details
router.post("/upload_gig_det", multipartyMiddleWare, (req, res, next) => {

    var image_one, image_two, image_three, image_four, image_five, image_six;
    let f = req.files;
    let data = req.body;
    // console.log(req);
    async.parallel([
        function (cb) {
            if (f.img1 !== null && f.img1 !== undefined) {
                let params_one = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + f.img1.name,
                    Body: fs.createReadStream(f.img1.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_one, (err_one, up_one) => {
                    if (err_one) console.log(err);
                    else image_one = up_one.Location;
                    cb(null, image_one);
                });
            }
        },
        function (cb) {
            if (f.img2 !== null && f.img2 !== undefined) {
                let params_two = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + f.img2.name,
                    Body: fs.createReadStream(f.img2.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_two, (err_three, up_two) => {
                    if (err_three) console.log(err_three);
                    else image_two = up_two.Location;
                    cb(null, image_two);
                });
            }
        },
        function (cb) {
            if (f.img3 !== null && f.img3 !== undefined) {
                let params_three = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + f.img3.name,
                    Body: fs.createReadStream(f.img3.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_three, (err_five, up_three) => {
                    if (err_five) console.log(err_five);
                    else image_three = up_three.Location;
                    cb(null, image_three);
                });
            }
        }, function (cb) {
            if (f.img4 !== null && f.img4 !== undefined) {
                let params_four = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + f.img4.name,
                    Body: fs.createReadStream(f.img4.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_four, (err_six, up_four) => {
                    if (err_six) console.log(err_five);
                    else image_four = up_four.Location;
                    cb(null, image_four);
                });
            } else {
                image_four = "not specified";
                sfour = "yes";
                cb(null, image_four);
            }
        },
        function (cb) {
            if (f.img5 !== null && f.img5 !== undefined) {
                let params_five = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + f.img5.name,
                    Body: fs.createReadStream(f.img5.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_five, (err_seven, up_five) => {
                    if (err_seven) console.log(err_seven);
                    else image_five = up_five.Location;
                    cb(null, image_five);
                });
            } else {
                image_five = "not specified";
                sfive = "yes";
                cb(null, image_five);
            }
        },
        function (cb) {
            if (f.img6 !== null && f.img6 !== undefined) {
                let params_six = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + f.img6.name,
                    Body: fs.createReadStream(f.img6.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_six, (err_eight, up_six) => {
                    if (err_eight) console.log(err_eight);
                    else image_six = up_six.Location;
                    cb(null, image_six);
                });
            } else {
                image_six = "not specified";
                ssix = "yes";
                cb(null, image_six);
            }
        }
    ], function (err, results) {
        let new_gig = new User_gig({
            user_id: data.user_id,
            category: data.category,
            sub_category: data.sub_category,
            title: data.title,
            description: data.description,
            email: data.email,
            profiles: data.profiles,
            sharing: data.sharing,
            social_login: data.social_login,
            rating: data.rating,
            mobile: data.mobile,
            dont_show_pre: data.dont_show_pre,
            dont_show_pro: data.dont_show_pro, pac_cos_sta: data.pac_cos_sta,
            pac_cos_pre: data.pac_cos_pre,
            pac_cos_pro: data.pac_cos_pro,
            pac_det_sta: data.pac_det_sta,
            pac_det_pre: data.pac_det_pre,
            pac_det_pro: data.pac_det_pro,
            pac_del_sta: data.pac_del_sta,
            pac_del_pre: data.pac_del_pre,
            pac_del_pro: data.pac_del_pro,
            rev_sta: data.rev_sta,
            rev_pre: data.rev_pre,
            rev_pro: data.rev_pro,
            words_sta: data.words_sta,
            words_pre: data.words_pre,
            words_pro: data.words_pro,
            sf_sta: data.sf_sta,
            sf_pre: data.sf_pre,
            sf_pro: data.sf_pro,
            hq_sta: data.hq_sta,
            hq_pre: data.hq_pre,
            hq_pro: data.hq_pro,
            faq: data.faq,
            author_work: data.author_work,
            img1: results[0],
            img2: results[1],
            img3: results[2],
            img4: results[3],
            img5: results[4],
            img6: results[5],
            time: moment().format('x'),
        });
        new_gig.save((err, gig) => {
            if (gig) {
                res.json({ success: true, msg: gig });
            } else {
                res.json({ success: false, msg: err });
            }
        });
    });
});

//post gig etras
router.post("/post_gig_extrs", (req, res, next) => {

    const gig_id = req.body.gig_id;
    const ext = req.body.extrs;

    for (var i = 0; i < ext.length; i++) {
        var element = ext[i];

        let newextras = new extras({
            gig_id: gig_id,
            e_description: element.description,
            price: element.cost,
            days: element.days
        })
        newextras.save((err, extras) => {
        })
    }
    res.json({ success: true, msg: extras });
})

// get gig extrs by ext id
router.get("/get_gig_extra_extid/:extras_id", (req, res, next) => {
    const extras_id = req.params.extras_id;
    extras.find({ _id: extras_id }, (err, extra) => {
        if (extra) {
            res.json({ success: true, msg: extra });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

// update gig
router.post("/update_gig", multipartyMiddleWare, (req, res, next) => {
    // console.log(req);
    var gig_id = req.body.gig_id;
    var up_imag_one;
    var up_imag_two;
    var up_imag_three;
    var up_image_four;
    var up_image_five;
    var up_image_six;
    var body = req.body;
    var files = req.files;
    // console.log(req);
    async.parallel([
        function (cb) {
            if (files.img1 !== undefined && files.img1 !== null) {
                let params_one = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + files.img1.name,
                    Body: fs.createReadStream(files.img1.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_one, (err_one, up_one) => {
                    if (err_one) console.log(err);
                    else up_imag_one = up_one.Location;
                    cb(null, up_imag_one);
                });
            } else {
                up_imag_one = body.img1;
                cb(null, up_imag_one);
            }
        },
        function (cb) {
            if (files.img2 !== null && files.img2 !== undefined) {
                let params_two = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + files.img2.name,
                    Body: fs.createReadStream(files.img2.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_two, (err2, upload2) => {
                    if (err2) console.log(err2);
                    else up_imag_two = upload2.Location;
                    cb(null, up_imag_two);
                });
            } else {
                up_imag_two = body.img2;
                cb(null, up_imag_two);
            }
        },
        function (cb) {
            if (files.img3 !== null && files.img3 !== undefined) {
                let params_three = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + files.img3.name,
                    Body: fs.createReadStream(files.img3.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_three, (err3, upload3) => {
                    if (err3) console.log(err3);
                    else up_imag_three = upload3.Location;
                    cb(null, up_imag_three);
                });
            } else {
                up_imag_three = body.img3;
                cb(null, up_imag_three);
            }
        },
        function (cb) {
            if (files.img4 !== null && files.img4 !== undefined) {
                let params_four = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + files.img4.name,
                    Body: fs.createReadStream(files.img4.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_four, (err4, upload4) => {
                    if (err4) console.log(err4);
                    else up_imag_four = upload4.Location;
                    cb(null, up_imag_four);
                });
            } else {
                if (body.img4 !== null && body.img4 !== undefined) {
                    up_image_four = body.img4;
                    cb(null, up_image_four);
                } else {
                    up_image_four = "not specified";
                    cb(null, up_image_four);
                }
            }
        },
        function (cb) {
            if (files.img5 !== null && files.img5 !== undefined) {
                let params_five = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + files.img5.name,
                    Body: fs.createReadStream(files.img5.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_five, (err5, upload5) => {
                    if (err5) console.log(err5);
                    else up_imag_five = upload5.Location;
                    cb(null, up_imag_five);
                });
            } else {
                if (body.img5 !== null && body.img5 !== undefined) {
                    up_image_five = body.img5;
                    cb(null, up_image_five);
                } else {
                    up_image_five = "not specified";
                    cb(null, up_image_five);
                }
            }
        },
        function (cb) {
            if (files.img6 !== null && files.img6 !== undefined) {
                let params_six = {
                    Bucket: "asteriisc-mp/GigImages",
                    Key: Date.now() + Math.random() + files.img6.name,
                    Body: fs.createReadStream(files.img6.path),
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                }
                s3.upload(params_six, (err6, upload6) => {
                    if (err6) console.log(err6);
                    else up_imag_six = upload6.Location;
                    cb(null, up_imag_six);
                });
            } else {
                if (body.img6 !== null && body.img6 !== undefined) {
                    up_image_six = body.img6
                    cb(null, up_image_six);
                } else {
                    up_image_six = "not specified";
                    cb(null, up_image_six);
                }
            }
        }
    ], function (err, results) {
        console.log(results);
        User_gig.findByIdAndUpdate({ _id: gig_id }, {
            $set: {
                user_id: body.user_id,
                category: body.category,
                sub_category: body.sub_category,
                title: body.title,
                description: body.description,
                email: body.email,
                profiles: body.profiles,
                sharing: body.sharing,
                social_login: body.social_login,
                rating: body.rating,
                mobile: body.mobile,
                dont_show_pre: body.dont_show_pre,
                dont_show_pro: body.dont_show_pro,
                pac_cos_sta: body.pac_cos_sta,
                pac_cos_pre: body.pac_cos_pre,
                pac_cos_pro: body.pac_cos_pro,
                pac_det_sta: body.pac_det_sta,
                pac_det_pre: body.pac_det_pre,
                pac_det_pro: body.pac_det_pro,
                pac_del_sta: body.pac_del_sta,
                pac_del_pre: body.pac_del_pre,
                pac_del_pro: body.pac_del_pro,
                rev_sta: body.rev_sta,
                rev_pre: body.rev_pre,
                rev_pro: body.rev_pro,
                words_sta: body.words_sta,
                words_pre: body.words_pre,
                words_pro: body.words_pro,
                sf_sta: body.sf_sta,
                sf_pre: body.sf_pre,
                sf_pro: body.sf_pro,
                hq_sta: body.hq_sta,
                hq_pre: body.hq_pre,
                faq: body.faq,
                author_work: body.author_work,
                img1: results[0],
                img2: results[1],
                img3: results[2],
                img4: results[3],
                img5: results[4],
                img6: results[5]
            }
        }, (err, gig) => {
            if (gig) {
                res.json({ success: true, msg: gig });
            } else {
                res.json({ success: false, msg: err });
            }
        });
    })
});

// update gig extras
router.post("/update_gig_extrs", (req, res, next) => {
    let gig_id = req.body.gig_id;
    const ext = req.body.extrs;
    // console.log(ext);
    extras.remove({ gig_id: gig_id }, (err, del) => {
        if (del) {
            let j = 0;
            ext.forEach(element => {
                let newextras = new extras({
                    gig_id: gig_id,
                    e_description: element.description,
                    price: element.cost,
                    // days:element.days
                });
                newextras.save((err, ext) => {
                });
                j++;
            });
            res.json({ success: true, msg: "extras updated successfully", num: j });
        }
    });
});

// pause gig

router.post("/pause_gig", (req, res, next) => {
    // console.log(req);
    let gig_id = req.body.gig_id;
    User_gig.findById({ _id: gig_id }, (err, gig) => {
        // console.log(gig);
        if (gig.pause) {
            User_gig.findByIdAndUpdate({ _id: gig_id }, { $set: { pause: false } }).exec((err2, gig2) => {
                if (err2) res.json({ success: false, msg: err2 });
                else res.json({ success: true, msg: gig2, pause: false });
            });
        } else {
            User_gig.findByIdAndUpdate({ _id: gig_id }, { $set: { pause: true } }).exec((err3, gig3) => {
                if (err3) res.json({ success: false, msg: err3 });
                else res.json({ success: true, msg: gig3, pause: true });
            });
        }
    });
});

//Getting gig details
router.get("/get_gig_det/:id", (req, res, next) => {
    const gig_id = req.params.id;
    // console.log(gig_id);
    User_gig.findById({ _id: gig_id }, (err, gig) => {
        if (gig) {
            // console.log(gig.length);
            res.json({ success: true, msg: gig });
        } else {
            res.json({ success: false, msg: err });
        }
    })
});


//get all gigs

router.get("/get_all_gigs", (req, res, next) => {
    User_gig.find((err, user) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            
            console.log(filter.clean("some bad rgrthtrjj"))
            res.json({ success: true, msg: user });
            // console.log(user);
        }
    })
    // User_gig.find().populate('user_details').populate('user_reviews').exec((err, user) => {
    //     if (err) {
    //         res.json({ success: false, msg: err });
    //     } else {
    //         res.json({ success: true, msg: user });
    //         // console.log(user);
    //     }
    // })
});

// get gigsby user_id
router.get("/get_gigsby_id/:user_id", (req, res, next) => {
    const user_id = req.params.user_id;
    User_gig.find({ user_id: user_id }, (err, user_gigs) => {
        if (user_gigs) {
            res.json({ success: true, msg: user_gigs });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// get gig by gig_id

router.get("/get_gig_byId/:gig_id", (req, res, next) => {
    let gig_id = req.params.gig_id;
    // console.log(gig_id);
    User_gig.findById({ _id: gig_id }, (err, gig) => {
        if (gig) {
            res.json({ success: true, msg: gig });
            // console.log(gig);
        } else {
            res.json({ success: false, msg: err });
        }
    })
})
// gig_by_cat

router.get("/gig_cat/:category/:user_id", (req, res, next) => {
    const cat = req.params.category;
    const user_id = req.params.user_id;
    User_gig.find({ user_id: user_id, category: cat }, (err, user) => {
        if (user) {
            // if(user.msg[].length<0){
            //     res.json({success:false,msg:"no data but user success"});
            // }else{
            res.json({ success: true, msg: user });
            // }
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// delete gig
router.get("/delete_gig/:gig_id", (req, res, next) => {
    let gig_id = req.params.gig_id;
    User_gig.remove({ _id: gig_id }, (err, success) => {
        if (success) {
            res.json({ success: true, msg: "Gig deleted successfully" });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// add gig to favorite

router.post("/add_to_fav", (req, res, next) => {

    const gig_id = req.body.gig_id;
    const user_id = req.body.user_id;
    // console.log(req.body);
    favorites.find({ gig_id: gig_id, user_id: user_id }, (err, fav_gig) => {
        console.log(fav_gig);
        if (fav_gig) {
            if (fav_gig.length > 0) {
                favorites.remove({ gig_id: gig_id }, (er, success) => {
                    if (success) {
                        res.json({ success: true, msg: "removed from favorites" });
                    }
                });
            } else if (fav_gig.length === 0) {
                let newFav = new favorites({
                    user_id: user_id,
                    gig_id: gig_id
                });
                newFav.save((e, saved_fav) => {
                    if (saved_fav) {
                        res.json({ success: true, msg1: "added to favorites", msg2: saved_fav });
                    } else {
                        res.json({ success: false, msg: e });
                    }
                });
            }
        } else {
            if (err) {
                res.json({ success: false, msg: err });
            } else {
                res.json({ success: false, msg: "something wrong" });
            }

        }
    });
});

// remove from fav
router.post("/remove_from_fav", (req, res) => {
    const gig_id = req.body.gig_id;
    const user_id = req.body.user_id;

    favorites.find({ gig_id: gig_id, user_id: user_id }, (err, fav_gig) => {
        if (err) {
            res.json({ success: false, msg: err });
        }
        if (fav_gig) {
            favorites.remove({ gig_id: gig_id, user_id: user_id }, (err1, rem) => {
                if (err) {
                    res.json({ success: false, msg: err1 });
                } else {
                    res.json({ success: true, msg: "removed from favorites" });
                }
            });
        }
    });
});
// get_favorites
router.get("/get_fav/:user_id", (req, res) => {
    uid = req.params.user_id;
    // console.log(uid);
    favorites.find({ user_id: uid }, (err, user) => {
        if (user) {
            res.json({ success: true, msg: user });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

// get fav gig
router.post("/get_fav_gig", (req, res) => {
    const gig_id = req.body.gig_id;
    const user_id = req.body.user_id;
    // console.log(req.body);
    favorites.find({ gig_id: gig_id, user_id: user_id }, (err, gig) => {
        if (gig) {
            if (gig.length == 0) {
                res.json({ success: false, msg: 'No gig' });
            } else {
                res.json({ success: true, msg: gig });
            }
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// get gig extrs
router.get("/get_gig_extrs/:gig_id", (req, res, next) => {

    const gig_id = req.params.gig_id;

    extras.find({ gig_id: gig_id }, (err, extrs) => {
        if (extrs) {
            if (extrs) {
                res.json({ success: true, msg: extrs });
                // console.log(extrs);
            }
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

router.get("/get_extrs", (req, res, next) => {
    extras.find((err, extrs) => {
        if (extrs) {
            if (extrs) {
                res.json({ success: true, msg: extrs });
            }
        } else {
            res.json({ success: false, msg: err });
        }
    });
});


// var uploadfun = function (files, callback) {
//     var filepath;
//     let params = {
//         Bucket: 'asteriisc-mp/checkout',
//         Key: Date.now() + Math.random() + files.resume.name,
//         Body: fs.createReadStream(files.resume.path),
//         ACL: 'public-read',
//     }
//     s3.upload(params, (err, uploaded) => {
//         if (err) {
//             console.log(err);
//         } else {
//             filepath = uploaded.Location;
//             callback(null, filepath);
//         }
//     });
// }
// post order details
router.post("/post_order_det", multipartyMiddleWare, (req, res, next) => {
    var now = new Date();
    var date = moment();
    var body = req.body;
    var files = req.files;
    var filepath;

    async.series([
        function (cb) {
            let params = {
                Bucket: 'asteriisc-mp/checkout',
                Key: Date.now() + Math.random() + files.resume.name,
                Body: fs.createReadStream(files.resume.path),
                ACL: 'public-read',
            }
            s3.upload(params, (err, uploaded) => {
                if (err) {
                    console.log(err);
                } else {
                    filepath = uploaded.Location;
                    cb(null, filepath);
                }
            });
        },

    ], function (err, result) {
        if (err) {
            filepath = "not specified";
        } else {
            filepath = result[0];
        }
        let newOrder = new order({
            seller_id: body.seller_id,
            buyer_id: body.buyer_id,
            gig_title: body.gig_title,
            gig_id: body.gig_id,
            order_id: shortid.generate(),
            gig_img: body.gig_img,
            gig_desc: body.gig_desc,
            selected_pac: body.selected_pac,
            selected_price: body.selected_price,
            assigned_days: body.assigned_days,
            total_ext_days: body.total_ext_days,
            total_amount: body.total_amount,
            selected_extras: body.extras,
            resume: filepath,
            description: body.order_description,
            date: date
        });
        newOrder.save((err, order) => {
            if (order) {
                res.json({ success: true, msg: order });
            } else {
                res.json({ success: false, msg: "order not placed" });
            }
        });
    });
});

// update order status
router.post("/update_order_status", (req, res, next) => {
    // let order_id = req.body.order_id;
    // let order_status = req.body.order_status;
    // let date = req.body.accepted_date;
    // order.findByIdAndUpdate({_id:order_id},{$set:{order_status:order_status,accepted_date:moment()}},(err,order) => {
    //     if(order){
    //         res.json({success:true,msg:order});
    //     }else{
    //         res.json({success:false,msg:err});
    //     }
    // });
    var a = req.body;
    switch (a.order_status) {
        case "Order Accepted":
            order.findByIdAndUpdate({ _id: a.order_id }, { $set: { order_status: a.order_status, accepted_date: moment().format('x') } }, (err, order) => {
                if (order) {
                    res.json({ success: true, msg: order });
                } else {
                    res.json({ success: false, msg: err });
                }
            });
            break;
        case "Order Cancelled":
            order.findByIdAndUpdate({ _id: a.order_id }, { $set: { order_status: a.order_status } }, (err, order) => {
                if (order) {
                    res.json({ success: true, msg: order });
                } else {
                    res.json({ success: false, msg: err });
                }
            });
            break;
        case "Order Delivered":
            order.findByIdAndUpdate({ _id: a.order_id }, { $set: { order_status: a.order_status } }, (err, order) => {
                if (order) {
                    res.json({ success: true, msg: order });
                } else {
                    res.json({ success: false, msg: err });
                }
            });
            break;

        default:
            break;
    }
})
// get order details(seller)
router.get("/get_seller_order_det/:seller_id", (req, res, next) => {
    const user_id = req.params.seller_id;
    order.find({ seller_id: user_id }, (err, order) => {
        if (order) {
            res.json({ success: true, msg: order });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})
// get order details(buyer)
router.get("/get_buyer_order_det/:buyer_id", (req, res, next) => {
    const user_id = req.params.buyer_id;
    order.find({ buyer_id: user_id }, (err, order) => {
        if (order) {
            res.json({ success: true, msg: order });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})
// get orderby order_id
router.get("/get_orderby_id/:order_id", (req, res, next) => {
    const order_id = req.params.order_id;
    order.find({ _id: order_id }, (err, order) => {
        if (order) {
            res.json({ success: true, msg: order });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});
// get orders by gig_id and buyer_id
router.post("/get_ordersby_gigid", (req, res, next) => {

    const gig_id = req.body.gig_id;
    const buyer_id = req.body.buyer_id;

    order.find({ gig_id: gig_id, buyer_id: buyer_id }, (err, order) => {
        if (order) {
            res.json({ success: true, msg: order });
        } else {
            res.json({ success: false, msg: err });
        }
    })
});

// get orderd by only gig_id
router.get("/get_orders_gigid/:gig_id", (req, res) => {
    const gig_id = req.params.gig_id;

    order.find({ gig_id: gig_id }, (err, gig) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: gig });
            console.log(gig);
        }
    });
});

// post review
router.post("/post_review", (req, res, next) => {
    let buyer_id = req.body.buyer_id;
    let seller_id = req.body.seller_id;
    let order_id = req.body.order_id;
    let gig_id = req.body.gig_id;
    let newReview = new review({
        buyer_id: req.body.buyer_id,
        seller_id: req.body.seller_id,
        order_id: req.body.order_id,
        gig_id: req.body.gig_id,
        score: req.body.score,
        review: req.body.review,
        date: moment(),
    });
    review.find({ order_id: order_id, gig_id: gig_id }, (err, rev) => {
        if (rev.length > 0) {
            review.findByIdAndUpdate({ _id: rev[0]._id }, { $set: { score: req.body.score, review: req.body.review, date: req.body.date } }).exec((err, rev1) => {
                if (rev1) {
                    res.json({ success: true, msg: rev1 });
                } else {
                    res.json({ success: false, msg: err });
                }
            });
        } else {
            newReview.save((err, review) => {
                if (review) {
                    res.json({ success: true, msg: review });
                } else {
                    res.json({ success: false, msg: err });
                }
            });
        }
    });
});

//  update review 
router.post("/update_review", (req, res) => {
    let rev_id = req.body.rev_id;
    let r = req.body;
    console.log(rev_id);
    review.findByIdAndUpdate({ _id: rev_id }, { $set: { review: r.review, score: r.score } }).exec((err, rev) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: rev });
        }
    });
});

// get reviews
router.get("/get_reviews/:user_id", (req, res, next) => {
    const user_id = req.params.user_id;
    review.find({ seller_id: user_id }, (err, rev) => {
        if (rev) {
            res.json({ success: true, msg: rev });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

// get reviews gig_id
router.get("/get_reviews_gigid/:gig_id", (req, res, next) => {
    const gig_id = req.params.gig_id;
    // console.log(gig_id);
    review.find({ gig_id: gig_id }, (err, rev) => {
        if (rev) {
            res.json({ success: true, msg: rev });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

// get reviews order_id
router.get("/get_reviews_order_id/:order_id", (req, res, next) => {
    const order_id = req.params.order_id;
    // console.log(gig_id);
    review.find({ order_id: order_id }, (err, rev) => {
        if (rev) {
            res.json({ success: true, msg: rev });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// post new notification
router.post("/post_not", (req, res, next) => {
    // console.log(req.body);
    const not = req.body;
    let new_not = new notification({
        user_id: not.user_id,
        notification_id: shortid.generate(),
        message: not.message,
        date: not.date,
        status: not.status,
        image: not.image,
        destination: not.destination,
        link: not.link
    });
    new_not.save((err, not) => {
        if (not) {
            res.json({ success: true, msg: not });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

// get notifications
router.get("/get_notby_id/:user_id", (req, res, next) => {
    const user_id = req.params.user_id;
    notification.find({ user_id: user_id }, (err, not) => {
        if (not) {
            res.json({ success: true, msg: not })
        } else {
            res.json({ success: false, msg: err });
        }
    })
})

// change notification status
router.post("/change_not_status", (req, res, next) => {
    const not_id = req.body.not_id;
    // console.log(not_id);
    notification.findOneAndUpdate({ _id: not_id }, { $set: { status: "seen" } }).exec((err, not) => {
        if (not) {
            res.json({ success: true, msg: not });
        } else {
            res.json({ success: false, msg: err });
        }
    });
})

// mark all read
router.post("/mark_all_read", (req, res, next) => {
    const user_id = req.body.user_id;
    notification.update({ user_id: user_id }, { $set: { status: "seen" } }, { multi: true }).exec((err, not) => {
        if (not) {
            res.json({ success: true, msg: not });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});
// get converstioan
router.get("/get_conv/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    // console.log(user_id); 
    conv.find({ users: { $all: [user_id] } }, (err, conv) => {
        if (conv) {
            res.json({ success: true, msg: conv });
        } else {
            res.json({ success: false, msg: err });
        }
    })
})
// check conversations
router.post("/check_conv", (req, res, next) => {
    conv.find({ users: [req.body.from, req.body.to] }, (err, ress) => {
        if (ress.length > 0) {
            res.json({ success: true, msg: ress });
        } else {
            conv.find({ users: [req.body.to, req.body.from] }, (err1, msg1) => {
                if (msg1.length > 0) {
                    res.json({ success: true, msg: msg1 });
                } else {
                    let con = new conv({
                        conv_id: shortid.generate(),
                        from_id:req.body.from,
                        to_id:req.body.to,
                        users: [req.body.from, req.body.to],
                        msg: [{ message_id:shortid.generate(),from: req.body.from, to: req.body.to, msg: "Hi greeting I would like to know some details about your GIG's", time: moment() }],
                        status: 'notSeen',
                        updatedon: moment().format('x')
                    });
                    con.save((err, saved) => {
                        if (saved) {
                            res.json({ success: true, msg: saved });
                        } else {
                            res.json({ success: false, msg: err });
                        }
                    });
                }
            });
        }
    });
});

router.post('/send_msg', (req, res, next) => {
    var customFilter = new Filter({ placeHolder: 'x'});
    // bword.
    customFilter.addWords(words);
    const con_id = req.body.conv_id;
    const from = req.body.from;
    const to = req.body.to;
    const msg = customFilter.clean(req.body.message);
    const time = req.body.time;

    // console.log(req.body);
    conv.find({ conv_id: con_id }, (err1, con) => {
        if (!err1) {
            if (con.length > 0) {
                let obj = {
                    message_id:shortid.generate(),
                    from: from,
                    to: to,
                    msg: msg,
                    time: time,
                };
                // console.log(obj);
                conv.update({ conv_id: con_id }, { $push: { msg: obj } }, (err, pushed) => {
                    if (pushed) {
                        conv.findOneAndUpdate({ conv_id: con_id }, { $set: { status: 'notSeen', updatedon: moment().format('x') } }).exec((err1, status) => {
                            if (status) {
                                res.json({ success: true, msg: pushed, verf: obj });
                            }
                        });
                    } else {
                        res.json({ success: false, msg: err });
                    }
                });
            }
        }
    });

});
// get conv with conv_id    
router.post("/get_conv_conv_id", (req, res) => {
    let conv_id = req.body.conv_id;
    var from_id = req.body.from;
    var display_msgs = [];
    var msgLength;
    conv.findOne({ conv_id: conv_id }, (err, conv) => {
        if (conv) {
            msgLength = conv.msg.length;
            async.waterfall([
                function (cb) {
                    // conv.msg.forEach((msg,index) => {
                    for (let i = 0; i < msgLength; i++) {
                        if (conv.msg[i].from === from_id) {
                            User.findOne({ _id: conv.msg[i].from }, (err, from) => {
                                if (from) {
                                    conv.msg[i]['status'] = true,
                                        conv.msg[i]['message'] = conv.msg[i].msg,
                                        conv.msg[i]['conv_id'] = conv_id,
                                        conv.msg[i]['pic'] = from.profile_pic,
                                        conv.msg[i]['time'] = moment(conv.msg[i].time).format('x')
                                }
                                if (i === msgLength - 1) {
                                    cb(null, conv.msg);
                                }
                            });
                        } else {
                            User.findOne({ _id: conv.msg[i].from }, (err, to) => {
                                if (to) {
                                    conv.msg[i]['status'] = false,
                                        conv.msg[i]['message'] = conv.msg[i].msg,
                                        conv.msg[i]['conv_id'] = conv_id,
                                        conv.msg[i]['pic'] = to.profile_pic,
                                        conv.msg[i]['time'] = moment(conv.msg[i].time).format('x')
                                }
                                if (i === msgLength - 1) {
                                    console.log(conv.msg);
                                    conv.msg.sort((a, b) => {
                                        console.log(a.time);
                                        return JSON.parse(a.time) - JSON.parse(b.time);
                                    });
                                    cb(null, conv.msg);
                                }
                            });
                        }
                    }
                    // }); 
                },
                function (arg1, cb) {
                    if (arg1) {
                        res.json({ success: true, msg: arg1 });
                    }
                }
            ]);
        } else {
            res.json({ success: false, msg: err });
        }
    });
});

// get conv with convId
router.get("/get_conv_with_convid/:conv_id", (req, res) => {
    let conv_id = req.params.conv_id;
    conv.find({ conv_id: conv_id }, (err, conv) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: conv });
        }
    });
});
// get messages
router.post("/get_messages", (req, res, next) => {
    let from_id = req.body.from_id;
    let to_id = req.body.to_id;
    conv.find({ users: [req.body.to_id, req.body.from_id] }, (err, msg) => {
        if (msg.length > 0) {
            //    console.log(msg);
            res.json({ success: true, msg: msg });
        } else {
            //    res.json({success:false,msg:err});
            conv.find({ users: [req.body.from_id, req.body.to_id] }, (errr, msgg) => {
                if (msgg.length > 0) {
                    res.json({ success: true, msg: msgg });
                } else {
                    res.json({ success: false, msg: errr });
                }
            })
        }
    })
});
// change status
router.get("/change_status/:conv_id", (req, res) => {
    let conv_id = req.params.conv_id;
    conv.findOneAndUpdate({ conv_id: conv_id }, { $set: { status: 'Seen' } }).exec((err, seen) => {
        if (res) {
            res.json({ success: true, msg: seen });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});
// change status to notseen
router.get("/change_status_to_not_seen/:conv_id", (req, res) => {
    let conv_id = req.params.conv_id;
    conv.findOneAndUpdate({ conv_id: conv_id }, { $set: { status: 'notSeen' } }).exec((err, seen) => {
        if (res) {
            res.json({ success: true, msg: seen });
        } else {
            res.json({ success: false, msg: err });
        }
    });
});
// place custom order
router.post("/place_cus_order", multipartyMiddleWare, (req, res, next) => {
    var files = req.files;
    var path;
    console.log(req.body);


    var upload_cus = function (callback) {
        if (files.order_image !== null && files.order_image !== undefined) {
            var params = {
                Bucket: 'asteriisc-mp/Custom-order',
                Key: Date.now() + Math.random() + files.order_image.name,
                Body: fs.createReadStream(files.order_image.path),
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            }
            s3.upload(params, (err, uploaded) => {
                if (err) console.log(err);
                else path = uploaded.Location;
                if (typeof (callback) === "function") {
                    callback();
                }
            });
        } else {
            path = "not enclosed";
            if (typeof (callback) === "function") {
                callback();
            }
        }
    }
    var post_order = function () {
        let newcustom_order = new custom_order({
            order_description: req.body.order_description,
            image: path,
            orderd_date: req.body.orderd_date,
            delivery_date: req.body.delivery_date,
            order_id: shortid.generate(),
            buyer_id: req.body.buyer_id,
            seller_id: req.body.seller_id
        });
        newcustom_order.save((err, cus_order) => {
            if (cus_order) {
                console.log(cus_order)

                res.json({ success: true, msg: cus_order });
            } else {
                
                res.json({ success: false, msg: err });
            }
        });
    }

    upload_cus(function () { post_order() });
});

// get not msgs
router.get("/get_not_msgs/:user_id", (req, res) => {
    let user_id = req.params.user_id;
    conv.find({ users: user_id }, (err, msgs) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: msgs });
            // console.log(msgs);
        }
    });
});

// get my feedbacks
router.get('/get_my_feedbacks/:order_id', (req, res) => {
    let order_id = req.params.order_id;
    review.find({ order_id: order_id }, (err, rev) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, msg: rev });
        }
    });
});

console.log(words);
module.exports = router; 
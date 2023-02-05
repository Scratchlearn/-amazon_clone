//include library
const router = require('express').Router();
const bcrypt = require('bcryptjs');
//const bcrypt = require('body-parser');
const bodyParser = require('body-parser');
const {User , validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const moment = require('moment')
const user = require('./../models/usermodel');
const token_key = process.env.TOKEN_KEY;

const storage = require('./storage');

const verifyToken = require('./../middleware/verify_token');
const { Router } = require('express');

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
//default router
//method:get
router.get(
    '/',
(req,res)=>{
   return res.status(200).json(
        {
            "status":true,
            "message":"User default route."
        }
    )
}
)


// user register route 
// access:public
// url: http://loca......
//method:post
router.post(
    '/register',   
  
  (req,res)=>{
      const errors = validationResult(req.body);
      // check error is empty or not 
      if(!errors.isEmpty()){
        return res.status(400).json({
            "status":false,
            "errors":errors.array() 
        })
      }
       
    
    
      user.findOne({email:req.body.email}).then((user)=>{
          //check email exist or not
          if(user){
              return res.status(409).json({
                  "status":false,
                  "message":"user email already exists"
              })
          }else{
              const salt =  bcrypt.genSaltSync(10);//generate a string
              let hashedPassword = bcrypt.hashSync(req.body.password,salt);  //hashing using bcrypt.

              const newUser=new User({
                  email:req.body.email,
                  username:req.body.username,
                  password:hashedPassword
              })
              newUser.save().then(result =>{
                  return res.status(200).json({
                      "status":true,
                      "user":result
                  })
              }).catch(error =>  {
                  return res.status(501).json({
                      "status":false,
                      "error":error
                  })
              })
          }
      }).catch(error =>{
          return res.status(500).json({
              "status":false,
              "error":error
          })
      })
    }
);


//access:public
//method:post
//http://localhost:400/api/users/uploadProfilePic

router.post(
    '/uploadProfilePic',
    varifyToken,
    (req,res)=>{
        let upload = storage.getProfilePicUpload();

        upload(req,res,(error)=>{

         // if profile pic not uploaded   
            if(!req.file){
                return res.status(400).json({
                    "status":false,
                    
                    "message":"File Upload Fail..."
            
        });
    }
        //if profile pic upload has error    
            if(error){
                return res.status(400).json({
                    "status":false,
                    "error":error,
                    "message":"File Upload Fail..."
                });
            }
            let temp={
                profile_pic: req.file.filename,
                updatedAt:moment().format("DD/MM/YYYY")+";"+moment().format("hh:mm:ss")
            };
            //stoe new profile pic name to user document 
            User.findOneAndUpdate({_id:req.user.id},{$set:temp})
            .then(user=>{
                return res.status(200).json({
                    "status":true,
                    "message":"File upload success",
                    "profile_pic":"http://localhost:400/profile_pic/"+user.profile_pic
                });
            })
            .catch(error=>{
            return res.status(502).json({
                "status":true,
                "message":"Database Error..."
            });
        });
    });
}
)
 


//user login route.
//access:public
//url:http://localhost:400/api/users/login
//method:post
router.post(
    '/login',
     [
           //check empty fields
           check('req.body.password').not().isEmpty().trim().escape(),

          // check email
          check('req.body.email').isEmail().normalizeEmail()
 ],
    (req,res)=>{
       // let email = req.body.email
      //  let password = req.body.password
       const errors = validationResult(req);

       // check errors is not empty
       if(!errors.isEmpty()){ 
           let error = {}
           for(let index=0;index<errors.array().length;index++){
               error={
                   ...error,
                   [errors.array()[index].param] : errors.array()[index].msg
               }
           }
                 return res.status(400).json({
                    "status": false,
                    "errors":errors.array()
               })

      }
      User.findOne({email:req.body.email})
         
          .then((user)=>{
                      // if check not exist
                      if(!user){
                          
                    return res.status(404).json({
                        "status": false,
                        "message":"user don't exist..."
                    });
                }else{
                // match user password
                    let isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);
                 console.log(isPasswordMatch);

                 //check password is not  match.
                 if(!isPasswordMatch){
                     return res.status(401).json({
                         "status":false,
                         "message":"Password dont match..."
                     })
                 }


            



                 // json web token generate
                 let token = jwt.sign(
                     {
                         id:user_.id,
                         email:user.email
                     },
                     token_key,
                     {
                         expiresIn:3600
                     }
                 )
                // if login success
                    return res.status(200).json({
                        "status":true,
                        "message":"login success...",
                        "token":token,
                        "user":user
                    });
                }


        }).catch((error)=>{
               return res.status(502).json({
                   "status":false, 
                   "message":"databse error..."
               })
           })

     }

);
module.exports=router

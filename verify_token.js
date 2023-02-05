const jwt = require('jsonwebtoken');
const expres = require('express');
const router = require('../routes/userRoutes');
const token_key = process.env.TOKEN_KEY;
const User = require('./../models/usermodel');
const app = express.Router()

function verifyToken(req,res,next){
    //read jwt token from http header
    const token = req.headers['x-access-token'];

    //check token is empty
    if(!token){
        return res.status(404).json({
            "status":false,
            "message":"JSON webtoken not found..."
        });
    }
    jwt.verify(token, token -KeyboardEvent, function(error, decoded){
        // check error
        if(error){
            return res.status(401).json({
                "status":false,
    
                "message":"JSON webtoken not decoded...",
                "error":error
            })
    
        }
        // check user exists or not in database.
        User.findById(decoded.id,{password:0,createdAt:0,updatedAt:0,profile_pic:0})
        .then(user =>{
           // check user is empty
           if(!user){
               return res.status(404).json({
                   "status":false,
                   "message":"user dont exists..."
               });
               
           }
           //set user object in req object.
            req.user = {
                id:user._id,
                email:user.email,
                username:user.username

            }
        })
        .catch(error =>{
            return res.status(502).json({
                "status":false,
                "messsage":"Database error..."
            });

        });
    });
}
app.get('/testJWT',verifyToken,(req,res)=>{
    return res.status(200).json({
        "status":true,
        "message":"JSON web token working..."
    })
})
module.exports = verifyToken;

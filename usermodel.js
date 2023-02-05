const mongoose = require('mongoose')
const Schema  = mongoose.Schema
const moment = require('moment')
const joi = require('joi')
const Joi = require('joi')

const UserSchema = new Schema({
    username: {
        type: String,
        required:true,
         minlength:5,
        maxlength:100

    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:100
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:100
    },
    profile_pic:{
        type:String,
        default:"empty-avatar.jpg"
    },
    createdAt:{
        type:String,
        default:moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss")
    
    }, updatedAt:{
        type:String,
        default:moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss")
    
    }


})
function validateUser(user){
    const schema={
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(user,schema)
}

//create user model
mongoose.model("users",UserSchema);

//export user model
module.exports = mongoose.model("users");
exports.validateUser=validateUser
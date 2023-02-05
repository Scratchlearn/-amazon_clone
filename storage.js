const multer = require('multer');
const randomstring = require('randomstring')
const path = require('path');
const { check } = require('express-validator');
// validate image file types
function checkFileType(file,cb) {
        

// allowed file extension
const allowedType = /lpeg|png|jpg|gif/;



// match file extension
const isMatchExt = allowedType.test((path.extname(file.originalname)).toLowerCase());



//match mine type
const isMIMEMatch = allowedType.test(file.mimetype);

if(isMatchExt && isMIMEMatch){
    cb(null,true);
}else{
    cb("Error:File type not supported");
}
}

function getProfilePicUpload(){
    let storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,'./public/profile_pic');
        },
        filename: function(req,file,cb){
            let p1 = randomstring.generatet(5);
            let p2 = randomstring.generatet(5);
            let ext = (path.extname(file.originalname)).toLowerCase();

            cb(null, p1 + "_" + p2);

        }
    });

    return multer({
       storage:storage,
       limits: {
           fileSize: 1000000
       },
       fileFilter: function(req,file,cb){
           checkFileType(file,cb)
       }
    }).single('profile_pic');
}



module.exports = {
      getProfilePicUpload
}
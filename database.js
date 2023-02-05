// include library
const mongoose = require("mongoose")
const assert = require('assert')
const db_url = process.env.DB_URL


mongoose.connect(
   db_url ,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    },
    err=>{
        if(err) throw err
        console.log('Connected to mongodb')
        //check database connect error
     //assert.strictEqual(error,null,"DB connection fail...")
      //console.log(err)
        //success
      //  console.log(link)
    }
)
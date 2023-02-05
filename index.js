//library include
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const port =process.env.port
const database= require('./database')
//user route
const userRoutes = require('./routes/userRoutes')



//middleware
app.use(cors())
app.use(morgan('dev'))
app.use("/api/users",userRoutes);
app.use(express.static('public'));



//route
app.get('/',(req,res)=>{
    return res.status(200).json({
        "status":true,
        "message":"Amazon Clone REST API homepage."
    })
})

app.listen(port,()=>{
    console.log("Server running at port: " + port)
})
const express=require('express')
const { connection } = require('./db')
const { router } = require('./route/user.route')
const cors=require('cors')
const { auth } = require('./middleware/auth.middleware')
const { emiRoute } = require('./route/emi.route')
require("dotenv").config()
const app=express()

app.use(cors())
app.use(express.json())
app.use("/users",router)

app.get('/',(req,res)=>{
    res.status(200).send({"msg":"Welcome To Home Page -server working"})
})
app.use(auth)
app.use("/emi",emiRoute)
app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Server connected")
    } catch (error) {
        console.log(error)
        console.log("Server not connected")
    }
    console.log(`Server is running on port ${process.env.port}`)
})
const dbConfig = require('./configs/db.config')
const mongoose = require('mongoose')
const authController = require('./controllers/auth.controller')
const express = require('express')
const app = express()
const User = require('./models/user.model')
const bcrypt = require("bcryptjs")
const constants = require("./utils/constants")
mongoose.connect(dbConfig.DB_URL)
const db = mongoose.connection
db.on("error", ()=> console.log("Can't connect to DB"))
db.once("open", ()=>{
    console.log("Connected to Mongo DB")
    init()
} )
app.use(express.json())

let authRouter = require('./routes/auth.routes')
let userRouter = require('./routes/user.routes')

authRouter(app)
userRouter(app)
async function init(){
    let user = await User.findOne({userId: 'admin'})
    
    if(user){
        console.log("Admin user already present")
        return
    }

    try{
        user = await User.create({
            name: "akim",
            userId: "admin",
            email:"admin@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("fakePassword", 8),
            userStatus: constants.userStatus.approved
        })
        console.log(user)
    }
    catch(err){
        console.log(err.message)
    }
}

app.listen(3000, ()=>{
    console.log("server started")
})
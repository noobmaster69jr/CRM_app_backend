const dbConfig = require('./configs/db.config')
const mongoose = require('mongoose')
const authController = require('./controllers/auth.controller')
const express = require('express')
const app = express()

mongoose.connect(dbConfig.DB_URL)
const db = mongoose.connection
db.on("error", ()=> console.log("Can't connect to DB"))
db.once("open", ()=> console.log("Connected to Mongo DB"))

app.use(express.json())
app.post('/crm/api/auth/signup', authController.signup)

app.listen(3000, ()=>{
    console.log("server started")
})
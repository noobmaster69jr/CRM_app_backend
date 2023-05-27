require("./crons/cron")
const dbConfig = require('./configs/db.config')
const mongoose = require("mongoose")
const express = require('express')

const app = express()
app.use(express.json())

 mongoose.connect(dbConfig.DB_URL)
const db = mongoose.connection
db.on("error",()=>console.log("Can't connect to DB"))
db.once("open",()=> console.log("Connected successfully to MongoDB"))

require("./routes/ticketNotification.route")(app);

app.listen(3030, ()=>{
    console.log("Application started on the port num 3030")
})
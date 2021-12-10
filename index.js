const express = require("express")
const app = express()

const dbUrl = 'mongodb://127.0.0.1:27017/CNPM'

const mongoose = require('mongoose')
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("CONNECTED!!!")
    })
    .catch((err)=>{
        console.log("CONNECTION FAILED!!!")
        console.log(err)
    })

const User = require("./models/user")

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

app.get("/login",(req,res)=>{
    res.render("auth/login")
})
 
app.post("/login",async(req,res)=>{
    const foundUser = await User.findOne({"username" : req.body["username"]});
    let message = "We can not find any profile with that username or password"
    if(foundUser){
        message = "Welcome back"
    }
    res.send(message)
})

app.get("*", (req,res)=>{
    res.send("Invalid url")
})

app.listen("8080", (req,res)=>{
    console.log("Listening on port 8080")
})
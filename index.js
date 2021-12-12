const express = require("express")
const app = express()
const Accountant = require("./models/accountant")

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

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

app.get('/home',(req,res)=>{
    res.render('auth/home')
})

app.get("/login",(req,res)=>{
    res.render("auth/login")
})
 
app.post("/accountant/login",async(req,res)=>{
    // const foundAccountant = await Accountant.findOne({"username" : req.body["username"]});
    // let message = "We can not find any profile with that username or password"
    // console.log(foundAccountant)
    // if(foundAccountant){
    //     if(foundAccountant['password'] === req.body['password']){
    //         message = "Welcome back"
    //     }
    // }
    // else{
    //     message = "We can not find any profile with that username or password"
    // }
    res.send('Login in as accountant')
})

app.post("/retailer/login", async(req,res)=>{
    res.send("Login as retailer")
})

app.get("/register", (req,res)=>{
    res.render("auth/register")
})

app.post("/accountant/register", async (req,res)=>{
    // const newAccountant = await new Accountant(req.body)
    // await newAccountant.save()
    // res.redirect('/accountant/login');
    res.send('Registering accountant')
})

app.post('/retailer/register', async(req,res)=>{
    res.send('Registering retailer')
})

app.get("*", (req,res)=>{
    res.redirect('/home')
})

app.listen("8080", (req,res)=>{
    console.log("Listening on port 8080")
})
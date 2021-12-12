const express = require("express")
const app = express()
const session = require('express-session')
const Accountant = require("./models/accountant")
const Retailer = require('./models/retailer')

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
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(session({secret:'thisisarobbery', resave : false, saveUninitialized:true}))


app.get("/login",(req,res)=>{
    res.render("auth/login")
})
 
app.post("/accountant/login",async(req,res)=>{
    const foundAccountant = await Accountant.findOne({"username" : req.body["username"]});
    console.log(foundAccountant)
    message = "We can not find any profile with that username or password"
    if(foundAccountant){
        if(foundAccountant['password'] === req.body['password']){
            req.session.accountant_id = foundAccountant._id
            res.redirect('/isaccountant')
        }
    }
    else{
        message = "We can not find any profile with that username or password"
        res.send(message)
    }
})

app.post("/retailer/login", async(req,res)=>{
    const foundRetailer = await Retailer.findOne({"username" : req.body["username"]});
    console.log(foundRetailer)
    message = "We can not find any retailer profile with that username or password"
    if(foundRetailer){
        if(foundRetailer['password'] === req.body['password']){
            req.session.retailer_id = foundRetailer._id
            res.redirect('/isretailer')
        }
    }
    else{
        message = "We can not find any retailer profile with that username or password"
        res.send(message)
    }
})

app.get("/register", (req,res)=>{
    res.render("auth/register")
})

app.post("/accountant/register", async (req,res)=>{
    const foundAccountant = await Accountant.findOne({username : req.body['username']})
    if(!foundAccountant){
        const newAccountant = await new Accountant(req.body)
        await newAccountant.save()
        console.log('SUCCESSFULLY CREATED A NEW ACCOUNTANT')
        req.session.accountant_id = newAccountant._id
        res.redirect('/isaccountant')
    }
    else{
        console.log("The account with this username has alrady been created")
        res.redirect('/login');
    }
})

app.post('/retailer/register', async(req,res)=>{
    const foundRetailer = await Retailer.findOne({username : req.body['username']})
    if(!foundRetailer){
        const newRetailer = await new Retailer(req.body)
        await newRetailer.save()
        console.log('SUCCESSFULLY CREATED A NEW RETAILER')
        req.session.retailer_id = newRetailer._id
        res.redirect('/isretailer')
    }
    else{
        console.log("The account with this username has alrady been created")
        res.redirect('/login');
    }
})

app.get('/isaccountant',(req,res)=>{
    if(req.session.accountant_id)
        res.send('Thispageisonlymadeforaccountant')
    else
        res.redirect('/login')
})

app.get('/isretailer', (req,res)=>{
    if(req.session.retailer_id)
        res.render('ordering/products')
    else
        res.redirect('/login')
})

app.get("*", (req,res)=>{
    res.redirect('/login')
})

app.listen("8080", (req,res)=>{
    console.log("Listening on port 8080")
})
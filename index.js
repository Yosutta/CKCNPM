const express = require("express")
const app = express()

app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

app.get("/login",(req,res)=>{
    res.render("auth/login")
})

app.post("/login",(req,res)=>{
    console.log(req.body)
    res.send(req.body)
})

app.get("*", (req,res)=>{
    res.send("Invalid url")
})

app.listen("8080", (req,res)=>{
    console.log("Listening on port 8080")
})
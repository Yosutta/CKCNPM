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

const Warehouse = require('../../models/warehouse')
const {products} = require('./drugs.js')

const seeddb = async()=>{
    await Warehouse.deleteMany()
    for(let i=0; i<products.length;i++){
        const quantityRand = Math.floor(Math.random()*101) *10
        const priceRand = Math.floor(Math.random()*8) + Math.floor(Math.random()*10)*0.1 + 0.09 + 3
        const productName = products[i]['generic_name']
        if(!productName) continue
        const productManufacturer = products[i]['labeler_name']

        const newProduct = new Warehouse({
            name: productName,
            quantity: quantityRand,
            price: priceRand,
            manufacturer: productManufacturer
        })
        await newProduct.save()
    }
}

seeddb().then(()=>{
    mongoose.disconnect()
})

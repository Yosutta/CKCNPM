const dbUrl = 'mongodb://127.0.0.1:27017/CNPM'
const mongoose = require('mongoose')
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTED!!!")
    })
    .catch((err) => {
        console.log("CONNECTION FAILED!!!")
        console.log(err)
    })

const Warehouse = require('../../models/warehouse')
const Import = require('../../models/import')
const Order = require('../../models/order')

const { products } = require('./drugs.js')

const seeddb = async () => {
    await Warehouse.deleteMany()
    await Order.deleteMany()
    await Import.deleteMany()

    let count = 0
    for (let i = 0; i < products.length; i++) {
        const quantityRand = Math.floor(Math.random() * 101) * 10
        const priceRand = (Math.floor(Math.random() * 8) + Math.floor(Math.random() * 10) * 0.1 + 0.09 + 3).toFixed(2)
        const productManufacturer = products[i]['labeler_name']
        const productName = products[i]['brand_name']

        const test = ``
        const foundProduct = await Warehouse.find({ 'name': { $regex: new RegExp(productName, "i") } })
        if (foundProduct.length === 0) {
            const newProduct = await new Warehouse({
                name: productName,
                quantity: quantityRand,
                price: priceRand,
                manufacturer: productManufacturer
            })
            count += 1
            console.log(count)
            await newProduct.save()
        }
        console.log(i)
    }
}

seeddb().then(() => {
    mongoose.disconnect()
})

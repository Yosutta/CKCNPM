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
const Retailer = require('../../models/retailer')
const Export = require('../../models/export')

const { products } = require('./drugs.js')

const seeddb = async () => {
    // await Warehouse.deleteMany()
    await Order.deleteMany()
    // await Import.deleteMany()
    await Export.deleteMany()

    //SEEDING WAREHOUSE
    // let count = 0
    // for (let i = 0; i < products.length; i++) {
    //     const quantityRand = Math.floor(Math.random() * 101) * 10
    //     const priceRand = (Math.floor(Math.random() * 8) + Math.floor(Math.random() * 10) * 0.1 + 0.09 + 3).toFixed(2)
    //     const productManufacturer = products[i]['labeler_name']
    //     const productName = products[i]['brand_name']

    //     const test = ``
    //     const foundProduct = await Warehouse.find({ 'name': { $regex: new RegExp(productName, "i") } })
    //     if (foundProduct.length === 0) {
    //         const newProduct = await new Warehouse({
    //             name: productName,
    //             quantity: quantityRand,
    //             price: priceRand,
    //             manufacturer: productManufacturer
    //         })
    //         count += 1
    //         console.log(count)
    //         await newProduct.save()
    //     }
    //     console.log(i)
    // }

    const allProducts = await Warehouse.find()
    const allRetailers = await Retailer.find()

    //SEEDING ORDERS
    // for (let i = 0; i < 50; i++) {
    //     let randProducts = Math.floor(Math.random() * 10) + 7
    //     let randRetailer = Math.floor(Math.random() * allRetailers.length)
    //     let total = 0

    //     let arr = []
    //     let orderNumbers = []
    //     for (let j = 0; j < randProducts; j++) {
    //         arr.push(Math.floor(Math.random() * allProducts.length) + 1)
    //         orderNumbers.push(Math.floor(Math.random() * 101) * 5)
    //     }

    //     let products = []
    //     for (let j = 0; j < arr.length; j++) {
    //         products[j] = {}
    //         products[j].item = allProducts[arr[j]]
    //         products[j].orderedQuantity = orderNumbers[j]
    //         console.log(products[j].item)
    //         total = products[j].orderedQuantity * products[j].item.price
    //     }

    //     const payment = {
    //         method: 'cash',
    //         amount: total.toFixed(2),
    //         status: false
    //     }
    //     const min = 111111111
    //     const max = 999999999
    //     const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

    //     const delivery = {
    //         address: allRetailers[randRetailer].fullname,
    //         phonenumber: random(min, max),
    //         status: 'Awaiting for confirmation'
    //     }


    //     const orderRetailer_id = allRetailers[randRetailer]._id
    //     const orderOrderDate = randomDate(new Date(2021, 0, 1), new Date());
    //     const orderProducts = products
    //     const orderPayment = payment
    //     const orderDelivery = delivery

    //     const newOrder = new Order({
    //         retailer_id: orderRetailer_id,
    //         orderDate: orderOrderDate,
    //         product: orderProducts,
    //         payment: orderPayment,
    //         delivery: orderDelivery
    //     })
    //     console.log(newOrder)

    //     await newOrder.save()
    // }


    //SEEDING IMPORTS
    // for (let i = 0; i < 50; i++) {
    //     let randProducts = Math.floor(Math.random() * 5) + 5

    //     let arr = []
    //     let importNumbers = []
    //     for (let j = 0; j < randProducts; j++) {
    //         arr.push(Math.floor(Math.random() * allProducts.length) + 1)
    //         importNumbers.push(Math.floor(Math.random() * 101) * 10)
    //     }

    //     let products = []
    //     for (let j = 0; j < arr.length; j++) {
    //         products[j] = {}
    //         products[j].item = allProducts[arr[j]]
    //         products[j].importQuantity = importNumbers[j]
    //     }
    //     const importDate = randomDate(new Date(2021, 0, 1), new Date());

    //     const newImport = new Import({ importDate, products })
    //     await newImport.save()
    // }
}

seeddb().then(() => {
    mongoose.disconnect()
})

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

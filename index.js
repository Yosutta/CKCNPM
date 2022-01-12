const express = require("express")
const app = express()
const session = require('express-session')
const Accountant = require("./models/accountant")
const Retailer = require('./models/retailer')
const Warehouse = require('./models/warehouse')
const Order = require('./models/order')
const Import = require("./models/import")
const Export = require('./models/export')


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

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'thisisarobbery', resave: false, saveUninitialized: true }))

app.get("/login", (req, res) => {
    res.render("auth/login")
})

app.post("/accountant/login", async (req, res) => {
    const foundAccountant = await Accountant.findOne({ "username": req.body["username"] });
    console.log(foundAccountant)
    message = "We can not find any profile with that username or password"
    if (foundAccountant) {
        if (foundAccountant['password'] === req.body['password']) {
            req.session.accountant_id = foundAccountant._id
            res.redirect('/isaccountant')
        }
    }
    else {
        message = "We can not find any profile with that username or password"
        res.send(message)
    }
})

app.post("/retailer/login", async (req, res) => {
    const foundRetailer = await Retailer.findOne({ "username": req.body["username"] });
    console.log(foundRetailer)
    message = "We can not find any retailer profile with that username or password"
    if (foundRetailer) {
        if (foundRetailer['password'] === req.body['password']) {
            req.session.retailer_id = foundRetailer._id
            res.redirect('/isretailer')
        }
    }
    else {
        message = "We can not find any retailer profile with that username or password"
        res.send(message)
    }
})

app.get("/accountant/logout", (req, res) => {
    console.log("LOGGED OUT")
    delete req.session.accountant_id;
    res.redirect('/login')
})

app.get("/retailer/logout", (req, res) => {
    console.log("LOGGED OUT")
    delete req.session.retailer_id;
    res.redirect('/login')
})

app.get("/register", (req, res) => {
    res.render("auth/register")
})

app.post("/accountant/register", async (req, res) => {
    const foundAccountant = await Accountant.findOne({ username: req.body['username'] })
    if (!foundAccountant) {
        const newAccountant = await new Accountant(req.body)
        await newAccountant.save()
        console.log('SUCCESSFULLY CREATED A NEW ACCOUNTANT')
        req.session.accountant_id = newAccountant._id
        res.redirect('/isaccountant')
    }
    else {
        console.log("The account with this username has alrady been created")
        res.redirect('/login');
    }
})

app.post('/retailer/register', async (req, res) => {
    const foundRetailer = await Retailer.findOne({ username: req.body['username'] })
    if (!foundRetailer) {
        const newRetailer = await new Retailer(req.body)
        await newRetailer.save()
        console.log('SUCCESSFULLY CREATED A NEW RETAILER')
        req.session.retailer_id = newRetailer._id
        res.redirect('/isretailer')
    }
    else {
        console.log("The account with this username has alrady been created")
        res.redirect('/login');
    }
})

app.get('/isaccountant', (req, res) => {
    if (req.session.accountant_id)
        res.redirect('/accountant/warehouse')
    else
        res.redirect('/login')
})

app.get('/accountant/warehouse', async (req, res) => {
    if (req.session.accountant_id) {
        const orders = await Order.find().populate('retailer_id');
        res.render('accountant/warehouse', { orders })
    }
    else
        res.redirect('/login')
})

app.post('/accountant/warehouse/import', async (req, res) => {
    if (req.session.accountant_id) {
        const list = req.body.list

        for (let i = 0; i < list.length; i++) {
            if (!list[i]._id) {
                const { name, importQuantity, price, manufacturer } = list[i]
                const newProduct = new Warehouse({
                    name,
                    quantity: importQuantity,
                    price,
                    manufacturer
                })
                await newProduct.save()
            }
            else {
                const product = await Warehouse.findById(list[i]['_id'])
                const totalAfterImport = await product['quantity'] + parseInt(list[i]['importQuantity'])
                // console.log(totalAfterImport)
                await Warehouse.findByIdAndUpdate(list[i]['_id'], { quantity: totalAfterImport })
            }
        }

        const importDate = Date.now()

        const newImportRequest = new Import({
            importDate,
            products: list
        })

        await newImportRequest.save()
    }
    else
        res.redirect('/login')
})

app.post('/accountant/warehouse/export', async (req, res) => {
    if (req.session.accountant_id) {
        const exportDate = Date.now()
        const orderID = req.body.exportList._id
        const orderProducts = req.body.exportList.product

        const newExportRequest = new Export({
            exportDate,
            order_id: orderID,
            products: orderProducts
        })
        await newExportRequest.save()
        // console.log(newExportRequest._id)

        let updatedOrder = await Order.findByIdAndUpdate(orderID, { export_id: newExportRequest._id })
        updatedOrder = await Order.findByIdAndUpdate(orderID, { "delivery.status": "Confirmed and Delivering" })
        // console.log(updatedOrder)

        //UPDATE WAREHOUSE QUANTITY
        for (let i = 0; i < orderProducts.length; i++) {
            const orderedQuantity = orderProducts[i].orderedQuantity
            const product = orderProducts[i]._id
            const total = parseInt(orderProducts[i].item.quantity) - parseInt(orderedQuantity)
            await Warehouse.findByIdAndUpdate(product, { quantity: total })
        }
    }
    else
        res.redirect('/login')
})

app.get('/accountant/orders/view', async (req, res) => {
    if (req.session.accountant_id) {
        const orders = await Order.find().populate('retailer_id');
        res.render('accountant/ordermanage', { orders })
    }
    else
        res.redirect('/login')
})

app.post('/accountant/orders/edit', async (req, res) => {
    if (req.session.accountant_id) {
        let payment = false;
        if (req.body.payment == 1) {
            payment = true
        }

        let delivery = 'Confirmed and Delivering'
        if (req.body.delivery == 1) {
            delivery = 'Order has been delivered'
        }
        await Order.findByIdAndUpdate(req.body.id, { $set: { 'payment.status': payment } })
        await Order.findByIdAndUpdate(req.body.id, { $set: { 'delivery.status': delivery } })
    }
    else
        res.redirect('/login')
})

app.get('/accountant/revenue', async (req, res) => {
    res.redirect("/accountant/revenue/imports")
})

app.get('/accountant/revenue/imports', (req, res) => {
    res.render("accountant/importhistory")
})

app.get('/accountant/revenue/imports/get', async (req, res) => {
    // const allImports = await Import.find().populate('products.item')
    const month = parseInt(req.query.month)
    let foundImports;
    if (month === 0) {
        foundImports = await Import.find().populate('products.item')
    }
    else {
        foundImports = await Import.aggregate([
            { $addFields: { "month": { $month: '$importDate' } } },
            { $match: { month: month } }
        ])
        await Import.populate(foundImports, 'products.item')
    }
    return res.status(200).json({ result: foundImports })
})

app.get('/accountant/revenue/exports', (req, res) => {
    res.render("accountant/exporthistory")
})

app.get('/accountant/revenue/exports/get', async (req, res) => {
    // const foundExports = await Export.find().populate('products.item')
    const month = parseInt(req.query.month)
    let foundExports;
    if (month === 0) {
        foundExports = await Export.find().populate('products.item')
        console.log(foundExports)
    }
    else {
        foundExports = await Export.aggregate([
            { $addFields: { "month": { $month: '$exportDate' } } },
            { $match: { month: month } }
        ])
        await Export.populate(foundExports, 'products.item')
        await Export.populate(foundExports, 'order_id')
        await Export.populate(foundExports, 'order_id.retailer_id')
    }
    return res.status(200).json({ result: foundExports })
})

app.get('/isretailer', (req, res) => {
    if (req.session.retailer_id)
        res.redirect('/retailer/order')
    else
        res.redirect('/login')
})

app.get('/retailer/order', (req, res) => {
    if (req.session.retailer_id)
        res.render('ordering/order')
    else
        res.redirect('/login')
})

app.get('/retailer/order/detail', async (req, res) => {
    const order = await Order.findById(req.query.id).populate('retailer_id').populate({
        path: 'product.item',
        model: 'Warehouse'
    })
    return res.status(200).json({ order })
})

app.post('/retailer/order/checkout', async (req, res) => {
    if (req.session.retailer_id) {
        const { paymentList, deliveryList, creditCardInfo } = { ...req.body }
        const productList = req.body.list
        const orderDate = Date.now();

        let paymentStatus = false
        if (paymentList['orderPaymentMethod'] === 'transaction') {
            paymentStatus = true
        }

        //PAYMENT
        const payment = {
            method: paymentList['orderPaymentMethod'],
            status: paymentStatus,
            amount: paymentList['orderAmount']
        }

        //DELIVERY
        const delivery = {
            address: deliveryList['orderAddress'],
            phonenumber: deliveryList['orderPhoneNumber'],
            status: 'Awaiting for confirmation'
        }

        let creditcard = {}
        if (creditCardInfo) {
            creditcard = {
                name: creditCardInfo['creditcardname'],
                cardnumber: creditCardInfo['creditcardnumber'],
                expireddate: creditCardInfo['creditcarddate'],
                zipcode: creditCardInfo['creditcardzip']
            }
        }

        const newOrder = new Order({
            retailer_id: req.session.retailer_id,
            orderDate,
            product: productList,
            payment,
            delivery,
            creditcard
        })
        await newOrder.save()
    }
    else
        res.redirect('/login')
})

app.get('/product/search', async (req, res) => {
    const search = req.query['search'] || ''
    const query = search.replace(/\\/g, "\\\\");
    const foundProducts = await Warehouse.find({ name: { '$regex': new RegExp(query, "i") } }).limit(10)
    return res.status(200).json({ result: foundProducts })
})

app.get('/product/detail', async (req, res) => {
    const query = req.query['detail'].replace(/\\/g, "\\\\");
    const productDetail = await Warehouse.findOne({ name: { '$regex': new RegExp(query, "i") } })
    return res.status(200).json({ result: productDetail })
})

app.get("*", (req, res) => {
    res.redirect('/login')
})

app.listen("8080", (req, res) => {
    console.log("Listening on port 8080")
})
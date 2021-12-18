const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    retailer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    export_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    product: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse'
        },
        ordered: {
            type: Number,
            required: true
        }
    }],
    payment: {
        method: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        }
    },
    delivery: {
        address: {
            type: String,
            required: true
        },
        phonenumber: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enums: ['Awaiting for confirmation', 'Confirmed and Delivering', "Order has been delivered"],
            required: true
        }
    }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
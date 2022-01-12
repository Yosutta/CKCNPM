const mongoose = require('mongoose')

const exportSchema = mongoose.Schema({
    exportDate: {
        type: Date,
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    products: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse'
        },
        orderedQuantity: {
            type: Number,
            required: true
        }
    }]
})

const Export = mongoose.model('Export', exportSchema)
module.exports = Export
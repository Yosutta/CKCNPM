const mongoose = require('mongoose')

const importSchema = mongoose.Schema({
    importDate: {
        type: Date,
        required: true
    },
    products: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse'
        },
        importQuantity: {
            type: Number,
            required: true
        }
    }]
})

const Import = mongoose.model('Import', importSchema)
module.exports = Import
const mongoose = require('mongoose')

const importSchema = mongoose.Schema({
    importDate: {
        type: Date,
        required: true
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    }
})

const Import = mongoose.model('Import', importSchema)
module.exports = Import
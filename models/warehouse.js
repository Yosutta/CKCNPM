const mongoose = require("mongoose")

const warehouseSchema = mongoose.Schema({
    name :{
        type: String,
        required :true
    },
    quantity:{
        type: Number, 
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    manufacturer:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('Imports', warehouseSchema)
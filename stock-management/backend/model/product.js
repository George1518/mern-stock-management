const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name: {
        type: String,
        unique:true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
      price: {
        type: Number,
        required: true,
          min: 0
    },
    quantity: {
        type: Number,
        required: true,
          min: 0
    },
    minStock: {
        type: Number,
        required: true,
        min: 0
    },
})

const Product = mongoose.model("Product",productSchema);

module.exports = Product
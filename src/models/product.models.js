
import { Double } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

// "title": "Sample Product",
// "price": 29.99,
// "size": "M",
// "color": "Red",
// "category": "Clothing",
// "product_details": "High-quality cotton shirt",
// "ratings": 5

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  
  title: {
    type:String,
    required: true

  },
  price: {
    type:String,
    required: true

  },
  size: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        const validsizes = ['XS', 'S', 'M', 'L', 'XL',"36","37","38","39","40","41"];
        return v.every(s => validsizes.includes(s));
      },
      message: 'Invalid value'
    }

  },
  color: {
    type:String,
    required: true

  },
  category: {
    type:String,
    required: true

  },
  product_details: {
    type:String,
    required: true

  },
  product_image: {
    type:[String],
    required: true,
  },
  rating: {
    type:Number,
    required: true

  },

}, { timestamps: true });


export const product = mongoose.model("product",productSchema)



import { Double } from 'mongodb';
import mongoose, { Schema } from 'mongoose';



const productSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    custom_size: {
        type: String,
        required: true
      },
    quantity: {
        type: Number,
        required: true
      },
    price: {
        type:Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
          }
      },

  }, { _id: false }); 



const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  
  customer_id: {
    type:String,
    required: true

  },
  customer_name: {
    type:String,
    required: true

  },
 
  product_cart:{
    type:[productSchema],
    required:true
  },

  subtotal: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
   

  },
  customer_email: {
    type:String,
    required: true

  },
  address: {
    type:String,
    required: true

  },
  city: {
    type:String,
    required: true

  },
  postal_code: {
    type:String,
    required: true

  },
  phone: {
    type:Number,
    required: true

  },
  card_no:{
    type:Number,
    required: true
  },
  expiry:{
    type:Number,
    required: true
  },
  cvc:{
    type:Number,
    required: true
  },
  total:{
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }

}, { timestamps: true });


export const order = mongoose.model("order",orderSchema)


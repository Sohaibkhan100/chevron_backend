
import { Double } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

const customsizeSchema = new mongoose.Schema({
    length: {
        type: Number,
        required: true,
      },

    shoulder: {           
        type: Number,
        required: true,
      }, 

    chest: {
        type: Number,
        required: true,
      }, 

    front_border: {
        type: Number,
        required: true,
      }, 

    back_border: {
        type: Number,
        required: true,
      },  
    arm_hole: {
        type: Number,
        required: true,
      }, 

    sleeve_length: {
        type: Number,
        required: true,
      },

  }, { _id: false }); 

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
    },
    custom_size: {
        type: [customsizeSchema],
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


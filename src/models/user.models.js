
import mongoose, { Schema } from 'mongoose';



const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  
  first_name: {
    type:String,
    required: true

  },
  last_name: {
    type:String,
    required: true

  },
  email: {
    type:String,
    required: true

  },
  password: {
    type:String,
    required: true

  },
  number: {
    type:Number,
    required: true

  },
  favorites: [
    {
       type: mongoose.Schema.Types.ObjectId,
        ref:'product'
       }
  ]

  

}, { timestamps: true });


export const user = mongoose.model("user",userSchema)


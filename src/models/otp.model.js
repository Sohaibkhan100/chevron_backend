
import { Timestamp } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

const OtpCodeSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
},  { timestamps: true }
);

export const OtpCode = mongoose.model('OtpCode', OtpCodeSchema);


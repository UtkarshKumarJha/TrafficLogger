import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    vehicle_type: {
        type: String,
        required: true,
        enum: ['Light Vehicle', 'Heavy Vehicle', 'Two Wheeler'],
    },
    timestamp:{
        type: Date,
        default: () => new Date(Math.floor(Date.now() / 1000) * 1000)
    },
    location: {
        type:String,
        required: true
    }
}, { collection: 'CarDetection' })

export const CarDetection = mongoose.model('CarDetection', logSchema);
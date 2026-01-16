const mongoose = require('mongoose');

const thumbnailSchema = new mongoose.Schema({
    version: {
        type: String,
    },
    videoName: {
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paid:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Thumbnail', thumbnailSchema);
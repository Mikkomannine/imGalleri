const mongoose = require('mongoose');
const { use, post } = require('../app');


const mediaSchema = new mongoose.Schema({
    title: {'type': String, 'required': false},
    description: {'type': String, 'required': false},
    imageKey: {'type': String, 'required': false},
    imageUrl: {'type': String, 'required': false},
    user_id: {'type': String, 'required': true},
    comments: [{
        text: { type: String, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Fruit', mediaSchema);


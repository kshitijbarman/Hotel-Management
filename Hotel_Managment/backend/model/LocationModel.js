const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { type: Date, default: Date.now },
}
);

module.exports = mongoose.model('Location', LocationSchema);

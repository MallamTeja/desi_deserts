const mongoose = require('mongoose');

const dessertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dessert', dessertSchema);

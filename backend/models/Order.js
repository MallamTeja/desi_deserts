const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    dessert_id: { type: String, required: true },
    dessert_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    transaction_id: { type: String, required: true },
    transaction_status: { type: String, default: 'pending', enum: ['pending', 'verified', 'failed'] },
    serving_status: { type: String, default: 'pending', enum: ['pending', 'preparing', 'served'] },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    subTotal: { type: Number, required: true }
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;

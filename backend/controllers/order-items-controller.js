const OrderItem = require('../models/order-items-model');

const addOrderItem = (req, res) => {
    const newOrderItem = {
        orderID: req.body.orderID,
        productID: req.body.productID,
        quantity: req.body.quantity,
        price: req.body.price
    };

    OrderItem.addOrderItem(newOrderItem, (err, result) => {
        if (err) {
            return res.status(500).send('Error adding order item');
        }
        res.status(201).send('Order item added successfully');
    });
};

const getOrderItemsByOrderID = (req, res) => {
    const orderID = req.params.orderID;

    OrderItem.getOrderItemsByOrderID(orderID, (err, items) => {
        if (err) {
            return res.status(500).send('Error fetching order items');
        }
        res.status(200).send(items);
    });
};

module.exports = {
    addOrderItem,
    getOrderItemsByOrderID
};
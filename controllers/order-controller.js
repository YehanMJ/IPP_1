const Order = require ('../models/orders-model');
const { get } = require('../routes/user-route');

const createOrder = (req, res) => {
    const newOrder = {
        userID: req.body.userID,
        totalAmount: req.body.totalAmount,
        status: req.body.status
    };
    Order.createOrder(newOrder, (err, orderId) => {
        if (err) {
            return res.status(500).send('Error creating order');
        }
        res.status(201).send({ orderId });
    });
}

const getOrders = (req, res) => {
    const userId = req.params.id;
    Order.getOrders(userId, (err, order) => {
        if (err) {
            return res.status(500).send('Error fetching orders');
        }
        res.status(200).send(order);
    });
}

const getOrderById = (req, res) => {
    const orderId = req.params.id;
    Order.getOrderById(orderId, (err, order) => {
        if (err) {
            return res.status(500).send('Error fetching order');
        }
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send(order);
    });
}

const updateOrder = (req, res) => {
    const orderId = req.params.id;
    const updatedOrder = {
        userID: req.body.userID,
        totalAmount: req.body.totalAmount,
        status: req.body.status
    };
    Order.updateOrder(orderId, updatedOrder, (err, result) => {
        if (err) {
            return res.status(500).send('Error updating order');
        }
        if (!result) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('Order updated successfully');
    });
}

const deleteOrder = (req, res) => {
    const orderId = req.params.id;
    Order.deleteOrder(orderId, (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting order');
        }
        if (!result) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('Order deleted successfully');
    });
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
}
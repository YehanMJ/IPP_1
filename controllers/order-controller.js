const Order = require ('../models/orders-model');
const { get } = require('../routes/user-route');

const createOrder = (req, res) => {
    const newOrder = {
        userID: req.body.userID,
        totalAmount: req.body.totalAmount,
        status: req.body.status
    };

    const orderItems = req.body.orderItems; // Array of order items

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).send('Order items are required');
    }

    Order.createOrder(newOrder, orderItems, (err, orderId) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).send('Error creating order');
        }
        res.status(201).send({ message: 'Order created successfully', orderId });
    });
};


const getAllOrders = (req, res) => {
    Order.getAllOrders((err, orders) => {
        if (err) {
            return res.status(500).send('Error fetching orders');
        }
        res.status(200).send(orders);
    });
}

const getOrders = (req, res) => {
    const userId = req.params.userId;
    Order.getOrders(userId, (err, order) => {
        if (err) {
            return res.status(500).send('Error fetching orders');
        }
        res.status(200).send(order);
    });
}

// const getOrderById = (req, res) => {
//     const orderId = req.params.orderId;
//     Order.getOrderById(orderId, (err, order) => {
//         if (err) {
//             return res.status(500).send('Error fetching order');
//         }
//         if (!order) {
//             return res.status(404).send('Order not found');
//         }
//         res.status(200).send(order);
//     });
// }

const updateOrder = (req, res) => {
    const orderId = req.params.orderId;
    const updatedOrder = {
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
    const orderId = req.params.orderId;
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
    getAllOrders,
    getOrders,
    updateOrder,
    deleteOrder
}
const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/order-controller');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/', verifyJWT, createOrder); // Create a new order
router.get('/:userId', verifyJWT, getOrders); // Get all orders for a user
router.get('/:orderId', verifyJWT, getOrderById); // Get a specific order by ID
router.put('/:orderId', verifyJWT, updateOrder); // Update an order
router.delete('/:orderId', verifyJWT, deleteOrder); // Delete an order

module.exports = router;
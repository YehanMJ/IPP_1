const express = require('express');
const router = express.Router();
const { addOrderItem, getOrderItemsByOrderID } = require('../controllers/order-items-controller');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/', verifyJWT, addOrderItem); // Add an order item
router.get('/:orderID', verifyJWT, getOrderItemsByOrderID); // Get order items by orderID

module.exports = router;
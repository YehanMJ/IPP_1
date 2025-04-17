const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/product-controller');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/', verifyJWT, addProduct); // Create a new product
router.get('/', verifyJWT, getAllProducts); // Get all products
router.put('/:productId', verifyJWT, updateProduct); // Update a product
router.delete('/:productId', verifyJWT, deleteProduct); // Delete a product

module.exports = router;
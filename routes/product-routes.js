const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, getAllProductsWithoutStatusCheck, getProductById, updateProduct, enableProduct, deleteProduct } = require('../controllers/product-controller');
const verifyJWT = require('../middleware/verifyJWT');
const upload = require('../middleware/multer-middleware');

router.post('/', verifyJWT,upload.single('image'), addProduct); // Create a new product
router.get('/', verifyJWT, getAllProducts); // Get all products
router.get('/all', verifyJWT, getAllProductsWithoutStatusCheck); // Get all products without status check
router.get('/:productId', verifyJWT, getProductById); // Get a specific product by ID
router.put('/:productId', verifyJWT,upload.single('image'), updateProduct); // Update a product
router.put('/enable/:productId', verifyJWT, enableProduct); // Enable a product
router.delete('/:productId', verifyJWT, deleteProduct); // Delete a product

module.exports = router;
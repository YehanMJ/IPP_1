const Product = require('../models/products-model');

const addProduct = (req, res) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    Product.addProduct(newProduct, (err, productId) => {
        if (err) {
            return res.status(500).send('Error creating product');
        }
        res.status(201).send({ productId });
    });
}

const getAllProducts = (req, res) => {
    Product.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).send('Error fetching products');
        }
        res.status(200).send(products);
    });
}

const updateProduct = (req, res) => {
    const productId = req.params.productId;
    const updatedProduct = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    Product.updateProduct(productId, updatedProduct, (err, result) => {
        if (err) {
            return res.status(500).send('Error updating product');
        }
        if (!result) {
            return res.status(404).send('Product not found');
        }
        res.status(200).send('Product updated successfully');
    });
}

const deleteProduct = (req, res) => {
    const productId = req.params.productId;
    Product.deleteProduct(productId, (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting product');
        }
        if (!result) {
            return res.status(404).send('Product not found');
        }
        res.status(200).send('Product deleted successfully');
    });
}

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}
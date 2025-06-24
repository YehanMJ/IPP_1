const Product = require('../models/products-model');
const upload = require('../middleware/multer-middleware');

const addProduct = (req, res) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        stock: req.body.stock,
        image: req.file ? req.file.filename : null, // Store the filename of the uploaded image
        category: req.body.category,
        Status: req.body.Status || 1 // Default to 1 if not provided
    };

    Product.addProduct(newProduct, (err, productId) => {
        if (err) {
            return res.status(500).send('Error creating product');
        }
        res.status(201).send({ productId });
    });
};

const getAllProducts = (req, res) => {
    Product.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).send('Error fetching products');
        }
        res.status(200).send(products);
    });
}

const getAllProductsWithoutStatusCheck = (req, res) => {
    Product.getAllProductsWithoutStatusCheck((err, products) => {
        if (err) {
            return res.status(500).send('Error fetching products');
        }
        res.status(200).send(products);
    });
};

const getProductById = (req, res) => {
    const productId = req.params.productId;
    Product.getProductById(productId, (err, product) => {
        if (err) {
            return res.status(500).send('Error fetching product');
        }
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.status(200).send(product);
    });
}

const updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const { name, price, description, stock, category, Status } = req.body;

    // Default to the existing image if no new image is uploaded
    const image = req.file ? req.file.filename : req.body.image;

    const updatedProduct = {
        name,
        price,
        description,
        stock,
        category,
        image,
        Status
    };

    try {
        const result = await Product.updateProduct(productId, updatedProduct);
        if (!result) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send({ message: 'Failed to update product' });
    }
};

const enableProduct = (req, res) => {
    console.log('Enable product called with ID:', req.params.productId); // Debug log
    const productId = req.params.productId;

    Product.updateProduct(productId, { Status: 1 })
        .then((result) => {
            if (!result) {
                console.log('Product not found'); // Debug log
                return res.status(404).send({ message: 'Product not found' });
            }
            console.log('Product enabled successfully'); // Debug log
            res.status(200).send({ message: 'Product enabled successfully' });
        })
        .catch((error) => {
            console.error('Error enabling product:', error);
            res.status(500).send({ message: 'Failed to enable product' });
        });
};

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
    getAllProductsWithoutStatusCheck,
    getProductById,
    updateProduct,
    enableProduct,
    deleteProduct
}
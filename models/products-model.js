const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
});

const addProduct = (productData, callback) => {
    // Validate the input data
    if (!productData.name || !productData.price || !productData.category) {
        return callback(new Error('Invalid product data'));
    }

    // Proceed with product creation
    const query = 'INSERT INTO products (name, price, description, stock, image, category, Status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [
        productData.name,
        productData.price,
        productData.description,
        productData.stock,
        productData.image,
        productData.category,
        productData.Status || 1 // Default to 1 if not provided
    ], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.insertId); // Return the inserted ID
    });
};

const getAllProducts = (callback) => {
    const query = 'SELECT * FROM products WHERE Status = 1'; // Fetch only active products
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
};

const getAllProductsWithoutStatusCheck = (callback) => {
    const query = 'SELECT * FROM products'; // Fetch all products without checking Status
    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
};

const getProductById = (productId, callback) => {
    const query = 'SELECT * FROM products WHERE ID = ?';
    connection.query(query, [productId], (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        if (rows.length === 0) {
            return callback(new Error('Product not found'));
        }
        callback(null, rows[0]);
    });
}

const updateProduct = (productId, productData) => {
    return new Promise((resolve, reject) => {
        const fields = Object.keys(productData).map((key) => `${key} = ?`).join(', ');
        const values = [...Object.values(productData), productId];

        const query = `UPDATE products SET ${fields} WHERE ID = ?`;
        connection.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(result.affectedRows > 0); // Return true if the product was updated
        });
    });
};

const deleteProduct = (productId, callback) => {
    const query = 'UPDATE products SET Status = 0 WHERE ID = ?'; // Soft delete by setting Status to 0
    connection.query(query, [productId], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.affectedRows > 0); // Return true if the product was soft-deleted
    });
};

module.exports = {
    addProduct,
    getAllProducts,
    getAllProductsWithoutStatusCheck,
    getProductById,
    updateProduct,
    deleteProduct
}
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
    const query = 'INSERT INTO products (name, price, category) VALUES (?, ?, ?)';
    connection.query(query, [productData.name, productData.price, productData.category], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.insertId); // Return the inserted ID
    });
}

const getAllProducts = (callback) => {
    connection.query('SELECT * FROM products', (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
}

const updateProduct = (productId, productData, callback) => {
    // Validate the input data
    if (!productData.name || !productData.price || !productData.category) {
        return callback(new Error('Invalid product data'));
    }

    // Proceed with product update
    const query = 'UPDATE products SET name = ?, price = ?, category = ? WHERE ID = ?';
    connection.query(query, [productData.name, productData.price, productData.category, productId], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.affectedRows > 0); // Return true if the product was updated
    });
}

const deleteProduct = (productId, callback) => {
    const query = 'DELETE FROM products WHERE ID = ?';
    connection.query(query, [productId], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.affectedRows > 0); // Return true if the product was deleted
    });
}

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}
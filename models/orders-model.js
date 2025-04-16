const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
});

const createOrder = (orderData, callback) => {
    const query = 'INSERT INTO Orders (userID, totalAmount, status) VALUES (?, ?, ?)';
    connection.query(query, [orderData.userID, orderData.totalAmount, orderData.status], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.insertId);
    });
}

const getOrders = (id, callback) => {
    const query = 'SELECT * FROM Orders WHERE userID = ?';
    connection.query(query, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
}

const getOrderById = (orderId, callback) => {
    const query = 'SELECT * FROM Orders WHERE ID = ?';
    connection.query(query, [orderId], (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows[0]);
    });
}

const updateOrder = (orderId, orderData, callback) => {
    const query = 'UPDATE Orders SET userID = ?, totalAmount = ?, status = ? WHERE id = ?';
    connection.query(query, [orderData.userId, orderData.totalAmount, orderData.status, orderId], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.affectedRows > 0);
    });
}

const deleteOrder = (orderId, callback) => {
    const query = 'DELETE FROM Orders WHERE id = ?';
    connection.query(query, [orderId], (err, result) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, result.affectedRows > 0);
    });
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
}
const mysql = require('mysql2');
const { get } = require('../routes/user-route');
require('dotenv').config();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
});

const createOrder = (orderData, callback) => {
    // Validate the input data
    if (!orderData.userID || !orderData.totalAmount || !orderData.status) {
        return callback(new Error('Invalid order data'));
    }

    // Check if the user exists (example validation)
    const userQuery = 'SELECT * FROM Users WHERE ID = ?';
    connection.query(userQuery, [orderData.userID], (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        if (rows.length === 0) {
            return callback(new Error('User does not exist'));
        }

        // Proceed with order creation
        connection.beginTransaction((err) => {
            if (err) {
                console.error(err);
                return callback(err);
            }

            const query = 'INSERT INTO orders (userID, totalAmount, status) VALUES (?, ?, ?)';
            connection.query(query, [orderData.userID, orderData.totalAmount, orderData.status], (err, result) => {
                if (err) {
                    console.error(err);
                    return connection.rollback(() => callback(err)); // Rollback on error
                }

                connection.commit((err) => {
                    if (err) {
                        console.error(err);
                        return connection.rollback(() => callback(err)); // Rollback on commit error
                    }
                    callback(null, result.insertId); // Return the inserted ID
                });
            });
        });
    });
};

const getAllOrders = (callback) => {
    connection.query('SELECT * FROM orders', (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
}

const getOrders = (id, callback) => {
    const query = 'SELECT * FROM orders WHERE userID = ?';
    connection.query(query, [id], (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
}

// const getOrderById = (orderId, callback) => {
//     const query = 'SELECT * FROM orders WHERE ID = ?';
//     connection.query(query, [orderId], (err, rows) => {
//         if (err) {
//             console.error(err);
//             return callback(err);
//         }
//         callback(null, rows[0]);
//     });
// }

const updateOrder = (orderId, orderData, callback) => {
    const query = 'UPDATE Orders SET totalAmount = ?, status = ? WHERE id = ?';
    // Validate the input data
    if (!orderData.totalAmount || !orderData.status) {
        return callback(new Error('Invalid order data'));
    }
    connection.query(query, [orderData.totalAmount, orderData.status, orderId], (err, result) => {
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
    getAllOrders,
    getOrders,
    updateOrder,
    deleteOrder
}
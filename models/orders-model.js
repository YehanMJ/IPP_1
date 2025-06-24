const mysql = require('mysql2');
const { get } = require('../routes/user-route');
require('dotenv').config();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
});

const createOrder = (orderData, orderItems, callback) => {
    // Validate the input data
    if (!orderData.userID || !orderData.totalAmount || !orderData.status || !Array.isArray(orderItems) || orderItems.length === 0) {
        return callback(new Error('Invalid order data or order items'));
    }

    connection.beginTransaction((err) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        // Step 1: Insert the order into the Orders table
        const orderQuery = 'INSERT INTO orders (userID, totalAmount, status) VALUES (?, ?, ?)';
        connection.query(orderQuery, [orderData.userID, orderData.totalAmount, orderData.status], (err, result) => {
            if (err) {
                console.error(err);
                return connection.rollback(() => callback(err)); // Rollback on error
            }

            const orderId = result.insertId; // Get the inserted order ID

            // Step 2: Insert each item into the OrderItems table
            const orderItemsQuery = 'INSERT INTO OrderItems (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)';
            const updateStockQuery = 'UPDATE Products SET stock = stock - ? WHERE ID = ?';

            const processOrderItems = (index) => {
                if (index >= orderItems.length) {
                    // All items processed, commit the transaction
                    return connection.commit((err) => {
                        if (err) {
                            console.error(err);
                            return connection.rollback(() => callback(err)); // Rollback on commit error
                        }
                        callback(null, orderId); // Return the order ID
                    });
                }

                const item = orderItems[index];
                if (!item.productID || !item.quantity || !item.price) {
                    return connection.rollback(() => callback(new Error('Invalid order item data')));
                }

                // Insert the item into OrderItems
                connection.query(orderItemsQuery, [orderId, item.productID, item.quantity, item.price], (err) => {
                    if (err) {
                        console.error(err);
                        return connection.rollback(() => callback(err)); // Rollback on error
                    }

                    // Update the stock in the Products table
                    connection.query(updateStockQuery, [item.quantity, item.productID], (err, result) => {
                        if (err) {
                            console.error(err);
                            return connection.rollback(() => callback(err)); // Rollback on error
                        }

                        if (result.affectedRows === 0) {
                            return connection.rollback(() => callback(new Error('Product not found or insufficient stock')));
                        }

                        // Process the next item
                        processOrderItems(index + 1);
                    });
                });
            };

            processOrderItems(0); // Start processing items
        });
    });
};

const getAllOrders = (callback) => {
    const query = `
        SELECT 
            Orders.ID, 
            Orders.totalAmount, 
            Orders.status, 
            Orders.created_at, 
            Users.name AS userName 
        FROM Orders 
        INNER JOIN Users ON Orders.userID = Users.ID`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
};

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
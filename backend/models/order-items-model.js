const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
});

const addOrderItem = (orderItemData, callback) => {
    const query = 'INSERT INTO orderitems (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)';
    connection.query(query, [
        orderItemData.orderID,
        orderItemData.productID,
        orderItemData.quantity,
        orderItemData.price
    ], callback);
};

const getOrderItemsByOrderID = (orderID, callback) => {
    const query = 'SELECT * FROM orderitems WHERE orderID = ?';
    connection.query(query, [orderID], callback);
};

module.exports = {
    addOrderItem,
    getOrderItemsByOrderID
};
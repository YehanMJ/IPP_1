const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
});

const addReview = (reviewData, callback) => {
    const query = 'INSERT INTO reviews (userID, productID, rating, comment) VALUES (?, ?, ?, ?)';
    connection.query(query, [
        reviewData.userID,
        reviewData.productID,
        reviewData.rating,
        reviewData.comment
    ], callback);
};

const getReviewsByProductID = (productID, callback) => {
    const query = `
        SELECT 
            reviews.rating, 
            reviews.comment, 
            users.name AS userName 
        FROM reviews 
        INNER JOIN users ON reviews.userID = users.ID 
        WHERE reviews.productID = ?`;

    connection.query(query, [productID], (err, rows) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(null, rows);
    });
};

module.exports = {
    addReview,
    getReviewsByProductID
};
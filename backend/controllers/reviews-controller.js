const Review = require('../models/reviews-model');

const addReview = (req, res) => {
    const newReview = {
        userID: req.body.userID,
        productID: req.body.productID,
        rating: req.body.rating,
        comment: req.body.comment
    };

    Review.addReview(newReview, (err, result) => {
        if (err) {
            return res.status(500).send('Error adding review');
        }
        res.status(201).send('Review added successfully');
    });
};

const getReviewsByProductID = (req, res) => {
    const productID = req.params.productID;

    Review.getReviewsByProductID(productID, (err, reviews) => {
        if (err) {
            return res.status(500).send('Error fetching reviews');
        }
        res.status(200).send(reviews);
    });
};

module.exports = {
    addReview,
    getReviewsByProductID
};
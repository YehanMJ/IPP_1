const express = require('express');
const router = express.Router();
const { addReview, getReviewsByProductID } = require('../controllers/reviews-controller');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/', verifyJWT, addReview); // Add a review
router.get('/:productID', verifyJWT, getReviewsByProductID); // Get reviews by productID

module.exports = router;
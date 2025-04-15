const express = require('express');
const router = express.Router();
const {login, register} = require('../controllers/user-controller');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/login',login);
router.post('/register',register);

module.exports = router;
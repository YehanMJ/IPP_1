const express = require('express');
const router = express.Router();
const {login, register, userAuth, getAllUsers} = require('../controllers/user-controller');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/login',login);
router.post('/register',register);
router.get('/auth', verifyJWT, userAuth);
router.get('/users', verifyJWT, getAllUsers);

module.exports = router;
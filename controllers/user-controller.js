const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'IPP_1'
})

const login = (req, res) => {
    connection.query(
        'select * from Users where email = ?',
        [req.body.email],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            if (rows.length === 0) {
                return res.status(401).send('Invalid email or password');
            }
            const user = rows[0];
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error comparing passwords');
                }
                if (result) {
                    const accessToken = jwt.sign({ "email": req.body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                    res.send({userID: user.ID, accessToken: accessToken, userRole: user.role});
                } else {
                    return res.status(401).send('Invalid email or password');
                }
            });
        }
    );

}

const register = (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error hashing password');
        }

        connection.query(
            'insert into Users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [req.body.name, req.body.email, hash, req.body.role],
            (err, rows) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error');
                }
                res.send('User registered successfully');
            }
        );
    });
};

const userAuth = (req, res) => {
    const email = req.user.email; // Extract email from the JWT token (set by verifyJWT middleware)

    connection.query(
        'SELECT ID, name, email, role FROM users WHERE email = ?',
        [email],
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error fetching user details');
            }
            if (rows.length === 0) {
                return res.status(404).send('User not found');
            }
            res.status(200).send(rows[0]); // Return user details
        }
    );
};

const getAllUsers = (req, res) => {
    connection.query(
        'SELECT ID AS userID, name FROM Users',
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error fetching users');
            }
            res.status(200).send(rows); // Return all user names and IDs
        }
    );
};

module.exports = {
    login,
    register,
    userAuth,
    getAllUsers
}
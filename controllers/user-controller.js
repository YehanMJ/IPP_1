const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require('mysql2')

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
                    res.send('Login successful');
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

module.exports = {
    login,
    register
}
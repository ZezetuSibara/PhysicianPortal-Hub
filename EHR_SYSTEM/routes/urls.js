const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const mysql = require('mysql');
const db = require('../database_connect');
const jsonwtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/login', (req, res) => {
    res.render('admin', {message: ''});
});

router.get('/register', (req, res) => {
    res.render('create', {message: ''});
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, practice_id, id_number, password, confirm_password } = req.body;
    const table_name = 'DR_' + last_name + practice_id.toString();

    // SQL query to create the table with the provided columns
    const createTableQuery = `CREATE TABLE ${db.escapeId(table_name)} (
        First_name VARCHAR(255),
        Last_name VARCHAR(255),
        ward_no INT,
        date DATE
        )
    `;

    db.query('SELECT * FROM sa_doctors_list WHERE First_name = ? AND Last_name = ? AND Practice_id = ? AND ID_number= ?', [first_name, last_name, practice_id, id_number], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length > 0) {
            db.query('SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name = ?', [process.env.DATABASE, table_name], async (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Internal Server Error");
                }
                if (results.length > 0) {
                    return res.render('create', { message: 'User already exists' });
                } else if (password !== confirm_password) {
                    return res.render('create', { message: 'Passwords do not match' });
                } else {
                    db.query(createTableQuery, (error, results, fields) => {
                        if (error) {
                            console.log('Error creating table');
                        } else {
                            console.log('Table created successfully.');
                        }
                    });

                    const hashedPassword = await bcrypt.hash(password, 10);

                    db.query('INSERT INTO users (practice_id, password) VALUES (?, ?)', [practice_id, hashedPassword], (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                    });

                    return res.redirect('/login');
                }
            });
        } else {
            // No matching user found
            return res.render('create', { message: 'User not found' });
        }
    });
});

router.post('/login', (req, res) => {
    const { practice_id, password } = req.body;

    db.query('SELECT practice_id, password FROM users WHERE practice_id = ?', [practice_id], async (err, results) => {
        if (err) {
            throw err;
        }

        if (!results[0] || !await bcrypt.compare(password, results[0].password)) {
            return res.render('admin', { message: 'Incorrect practice_id or password' });
        } else {
            const token = jsonwtoken.sign({ id: results[0].id }, process.env.SECRET_KEY, {
                expiresIn: process.env.DAYS_EXPIRES,
                httpOnly: true
            });

            const cookieOP = {
                expiresIn: new Date(Date.now() + process.env.COOKIE_ESP * 24 * 3600 * 1000),
                httpOnly: true
            }
            res.cookie('userLoged', token, cookieOP);
            return res.render('logged');
        }

        //return res.redirect('/login', { message: 'Incorrect practice_id or password' });
    });
});

module.exports = router;
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

/*const app_list = [
    ['George', 'Dupris', 129034, 8808145904080],
    ['Edwin', 'Fourie', 998765, 8703145904080]
];

db.query('INSERT INTO sa_doctors_list (First_name, Last_name, Practice_id, ID_number) VALUES ?', [app_list], (err, res) => {
    if (err) {
        console.log(err);
    }
});*/

/*db.query('DELETE FROM users', (error, results) => {
    if (error) {
      console.error('Error deleting rows:', error);
    }
  });*/
  

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

                    return res.render('admin', { message: 'Account successfully created'});
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

    if (!practice_id || !password) {
        return res.render('admin', { message: 'No practice_id or password provided' });
    }

    db.query('SELECT * FROM users WHERE practice_id = ?', [practice_id], async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length === 0) {
            return res.render('admin', { message: 'Incorrect practice_id or password' });
        }

        const isMatch = await bcrypt.compare(password, results[0].password);
        if (isMatch) {
            return res.render('admin', { message: 'Incorrect practice_id or password' });
        }

        const token = jsonwtoken.sign({ id: results[0].id }, process.env.SECRET_KEY, {
            expiresIn: process.env.DAYS_EXPIRES
        });

        const cookieOP = {
            expiresIn: new Date(Date.now() + process.env.COOKIE_ESP * 24 * 3600 * 1000)
        };
        res.cookie('userLoged', token, cookieOP);

        db.query('SELECT Last_name FROM sa_doctors_list WHERE practice_id = ?', [practice_id], (error, results) => {
            if (error) {
                return res.status(500).send('Internal Server Error');
            }
            
            const username = `DR ${results[0].Last_name}`;
            const last_name = results[0].Last_name.toLowerCase();
            const table_name = `dr_${last_name}${practice_id}`;
            
            db.query(`SELECT * FROM ${table_name}`, (q_error, appointments) => {
                if (q_error) {
                    return res.status(500).send('Internal Server Error');
                }

                appointments.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                });
                
                return res.render('logged', { appointments: appointments, username: username });
            });
        });
    });
});    

module.exports = router;
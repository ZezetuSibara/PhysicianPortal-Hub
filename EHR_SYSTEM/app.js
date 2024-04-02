const express = require('express');
const db = require('./database_connect');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
//const falsh = require('express-flash');
//const session = require('express-flash');
//const passport = require('passport');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
//app.use(flash());
//app.use(session({secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false}));
//app.use(passport.initialize());
//app.use(passport.session());

db.connect( (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('MySQL connected...');
    }
});

app.use('/', require('./routes/urls'));
app.use('/login', require('./routes/urls'));
app.use('/register', require('./routes/urls'));
//app.use('/auth', require('./routes/auth'));

app.listen(3000);
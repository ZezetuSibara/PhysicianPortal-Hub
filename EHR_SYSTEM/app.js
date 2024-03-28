const express = require('express');
const db = require('./database_connect');
const mysql = require('mysql');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

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
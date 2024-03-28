const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', (req, res) =>{
    console.log(req.body);
});

module.exports = router;
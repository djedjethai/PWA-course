const express = require('express');
const { check, body } = require('express-validator');

const signup = require('../controllers/authCt');
const login = require('../controllers/authCt');

const router = express.Router();

router.post('/authSignup', signup.postSignup);
router.post('/authLogin', login.postLogin);


module.exports = router;

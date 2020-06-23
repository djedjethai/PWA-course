const express = require('express');
const { check, body } = require('express-validator');

const signup = require('../controllers/authCt');

const router = express.Router();

router.post('/authSignup', signup.postSignup);

module.exports = router;

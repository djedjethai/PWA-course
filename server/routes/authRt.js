const express = require('express');
const { check, body } = require('express-validator');

// ok// const { postSignup, postLogin } = require('../controllers/authCt');
const authCt = require('../controllers/authCt');


const router = express.Router();

router.post('/authSignup', authCt.postSignup);
router.post('/authLogin', authCt.postLogin);

module.exports = router;

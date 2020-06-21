const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

router.post('/authSignup', (req, res, next) => {
	console.log('we are in router auth signup');
	console.log(req.body);
})

module.exports = router;

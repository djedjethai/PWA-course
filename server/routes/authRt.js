const express = require('express');
const { check, body } = require('express-validator');

// ok// const { postSignup, postLogin } = require('../controllers/authCt');
const authCt = require('../controllers/authCt');
const User = require('../models/authMd');


const router = express.Router();

let password = '';

router.post('/authSignup', [
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email.')
		.custom((value, { req }) => {
			console.log('IN_VALIDATOR_COSTUM');
			return User.findOne({email: value})
				.then(resp => {
					if (resp) {
						return Promise.reject('This email exist already');
					}
				})
		})
		.normalizeEmail(),
	body('password')
		.trim().isLength({min: 2})
		.custom((value, {req}) => {
			return password = value;		
		}),
	body('confirmPassword')
		.trim().isLength({min: 2})
		.custom((value, {req}) => {
			if (value !== password) {
				return Promise.reject('The confirm password do not match the password');
			}
		})
	], authCt.postSignup);

router.post('/authLogin', authCt.postLogin);

module.exports = router;

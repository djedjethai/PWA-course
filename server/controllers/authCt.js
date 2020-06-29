const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Auth = require('../models/authMd');

exports.postSignup = (req, res, next) => {
	
	// const errors = validationResult(req);
	// if (!errors.isEmpty) {
	//	const error = new Error('credential validation error');
	//	error.statusCode = 422;
	//	error.data = errors.array();
	//	throw error;
	// } 


	var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
   	if (regex.test(req.body.email)
	&& req.body.password.length > 2 && req.body.password.length < 25
	&& req.body.password === req.body.confirmPassword){

			console.log(req.body);
	} else {
		// bloque registration res.err
		return;
	}

	 
	bcrypt.hash(req.body.password, 12)
		.then(hashedPw => {
			const signUp = new Auth({
				email: req.body.email,
				password: hashedPw
			});
			return signUp;
		})
		.then(userCdl => {
			return Auth.findOne({email: userCdl.email})
				.then(user => {
					console.log(user);
					if (!user) {
						return userCdl.save() 
					} else {
						let message = 'accountExist';
						return message;
					}
				})
				.catch(e => console.log(e));

		})
		.then(response => {
			console.log('retour de db')
			console.log(response);
			if (response === 'accountExist') {
				res.status(200).json({
					message: 'Your account already exist'
				});

			} else {

				const token = jwt.sign(
					{ _id: response._id },
					"ThisSecretShouldBeLongeur",
					{ expiresIn: '1h' }
				);

				res.status(200).json({
					_id: response._id,
					email: response.email,
					token: token,
					message: 'Your account has been successfully created'
				});
			}

		})
		.catch(e => console.log(e));
}




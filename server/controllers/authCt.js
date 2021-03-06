const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Auth = require('../models/authMd');

exports.postSignup = (req, res, next) => {
	
	console.log('the error');
	 const errors = validationResult(req);

	console.log(errors);
	 if (!errors.isEmpty()) {
		console.log('IN_ERR_VALIDATOR');
		// const errMessage = Result.errors[0].msg ? Result.errors[0].msg : 'credential validation error';
		const error = new Error('credential validation error');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	 } 

	console.log('WE_R_IN_CONTROLLER');
	var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
   	if (regex.test(req.body.email)
	&& req.body.password.length > 2 && req.body.password.length < 25
	&& req.body.password === req.body.confirmPassword){
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
			if (response === 'accountExist') {
				const error = new Error('This account already exist');
				error.statusCode = 401;
				error.data = errors.array();
				throw error;
			} else {
				const token = jwt.sign(
					{ _id: response._id },
					"thisSecretShouldBeLongueur",
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
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
	} else {
		const error = new Error('An error occur during the process');
		error.statusCode = 401;
		error.data = errors.array();
		throw error;

	}
}


exports.postLogin = async (req, res, next) => {
	
	// const errors = validationResult(req);
	// if (!errors.isEmpty) {
	//	const error = new Error('credential validation error');
	//	error.statusCode = 422;
	//	error.data = errors.array();
	//	throw error;
	// } 


	var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
   	if (regex.test(req.body.email)
	&& req.body.password.length > 2 && req.body.password.length < 25)
	{
		try { 
			const user = await Auth.findOne({email: req.body.email})
				if (!user) {
					const error = new Error('Unfound account');
					error.statusCode = 401;
					error.data = errors.array();
					throw error;
				} else {
					const match = await bcrypt.compare(req.body.password, user.password);
						if (!match) {
							const error = new Error('Password incorrect');
							error.statusCode = 401;
							error.data = errors.array();
							throw error;
						} 
							        
						const token = jwt.sign(
							 {_id: user._id},
							 "thisSecretShouldBeLongueur",
							 { expiresIn: '1h' }
						)
							
						res.status(200).json({
							 email: user.email,
							 _id: user._id,
							 token: token
						})  
				}		
		} catch(err) {
			if (!err.statusCode) {
			err.statusCode = 500;
			}   
			next(err);
		}   

	} else {
		const error = new Error('Unfound account');
		error.statusCode = 401;
		error.data = errors.array();
		throw error;
	}
}








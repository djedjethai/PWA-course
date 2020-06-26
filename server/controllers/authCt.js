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

			console.log(signUp);
	} else {
		// bloque registration res.err
		return;
	}

		

	// bcrypt pw 
	bcrypt.hash(req.body.password, 12)
		.then(hashedPw => {
			const signUp = new Auth({
				email: req.body.email,
				password: hashedPw
			});
			return signUp;
		})
		.then(userCdl => {
			return userCdl.save()
		})
		.then(response => {
			console.log('retour de db')
			console.log(response);
			/* response
			_id: 5ef09da63a29aa1560aff579,
  			email: 'jerome@jerome.com'			  
			password: 'ddd',
			confirmPassword: 'ddd',
			createdAt: 2020-06-22T12:01:42.385Z,
			 updatedAt: 2020-06-22T12:01:42.385Z,
			 __v: 0
			*/
		

			// jsonwebtoken
			// create token and send back to front
			// then save in local storage of the browser(voir ex apiUdemy)
		})
		.catch(e => console.log(e));
}




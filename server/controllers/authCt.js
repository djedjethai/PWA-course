const express = require('express');

const Auth = require('../models/authMd');

exports.postSignup = (req, res, next) => {
//	console.log('welcome in controller');
//	console.log(req.body);

	const signUp = new Auth({
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword
	});

	console.log(signUp);

	signUp.save()
		.then(response => {
			console.log('retour de db')
			console.log(response);
			/* response
			  _id: 5ef09da63a29aa1560aff579,
  			  email: 'jerome@jerome.com',
			  password: 'ddd',
			  confirmPassword: 'ddd',
			  createdAt: 2020-06-22T12:01:42.385Z,
			  updatedAt: 2020-06-22T12:01:42.385Z,
			  __v: 0
			*/

			// integre bcryptejs
			// on crypte et save en bdd

			// jsonwebtoken
			// create token and send back to front
			// then save in local storage of the browser(voir ex apiUdemy)
		})
		.catch(e => console.log(e));
}

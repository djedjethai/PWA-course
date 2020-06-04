const { validationResult } = require('express-validator');
const fs = require('fs');
const path =require('path');

const Subscription = require('../models/SubMd');

// exports.getSubscriptions((req, res, next) => {

// })

exports.postSubscription = async (req, res, next) => {
    // console.log('dans post subscription');
    // console.log(req.body.endpoint);
    const newSubscription = new Subscription({
        endpoint: req.body.endpoint,
        keys: req.body.keys
    })
   
    try {
        const response = await newSubscription.save()
            
            // message de retour useless, just for fun 
            console.log('RETOUR SUBSCRIPTION');
            console.log(response);
            
            // pas utile pour l'instant, a voir.....
            res.status(201).json({
                message: 'subscription saved',
                id: response._id
            })
    } catch(err) {
        if (err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
      
}
const express = require('express');
const { check, body } = require('express-validator');

const subscriptionsController = require('../controllers/subscriptionsCt');

const router = express.Router();

// post subscriptions --'https://pwapp-2e65c.firebaseio.com/subscriptions.json'
router.post("/subscriptionPost", subscriptionsController.postSubscription);





// une get(), to get the subsciptions keys a venir

module.exports = router;
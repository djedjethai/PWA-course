const express = require('express');
const { check, body } = require('express-validator'); 

const feedsController = require('../controllers/feedsCt');

const router = express.Router();

// get data --https://pwapp-2e65c.firebaseio.com/posts.json
// 
router.get('/feeds', feedsController.getFeeds);

// send Data --https://us-central1-pwapp-2e65c.cloudfunctions.net/storePostData
router.post('/feed', feedsController.registerFeed);



module.exports = router;
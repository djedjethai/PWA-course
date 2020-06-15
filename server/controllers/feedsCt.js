const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const Feed = require('../models/FeedMd');
const Subscription = require('../models/SubMd');

require('dotenv').config();

exports.getFeeds = async (req, res, next) => {
    try{
        console.log('salut de downloads les gros');
        const feeds = await Feed.find();
            console.log('retour de db');
            console.log(feeds);
            res.status(200).json({
                message: 'feeds fetched successfully',
                feeds: feeds
            })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.registerFeed = (req, res, next) => {

    const title = req.body.title;
    const location = req.body.location;
    const image = !req.file ? 'image url' : req.file.path ;

    const feed = new Feed({
        title: title,
        location: location,
        image: image
    })
 
    feed.save()
        .then(resultFeedSave => {

        Feed.find()
            .then(feeds => {
            // just for fun, we send back the posts to be store in the indexedDB's browser
            // console.log('feeds');
            // console.log(feeds);
            let newFeeds = [];
            for (let key in feeds) {
                let idString = (feeds[key]._id).toString();
                let newFeed = new Feed({
                   id: idString,
                   title: feeds[key].title,
                   location: feeds[key].location,
                   image: feeds[key].image,
                   createdAt: feeds[key].createdAt,
                   updatedAt: feeds[key].updatedAt
                })
                newFeeds.push(newFeed);  
            }

            // send notification to all subscription (in our case: that new message comes in)
            webpush.setVapidDetails(
                'mailto:djedjethai@gmail.com', 
                // public key, not transformed by the function
                process.env.PUBLIC_KEY,
                // private key
                process.env.PRIVATE_KEY
            )
                
            // get all subscription
            Subscription.find({}).then(subs => {
                if (subs.length > 1) {
                    // iterate and set them to send the push notification
                    subs.forEach((sub) => {
                        let pushConfig = {
                            endpoint: sub.endpoint,
                            keys: {
                                auth: sub.keys.auth,
                                p256dh: sub.keys.p256dh
                            } 
                        };
                        // the second arg is simply the meaage we want to display(could be a simple string)
                        webpush.sendNotification(pushConfig, JSON.stringify({
                                title: 'New post',
                                content: 'New post added !'
                            })
                        )
                        .then(response => {
                            res.status(200).json({
                                message: 'feeds fetched successfully',
                                feeds: newFeeds
                            });
                        })
                        .catch(err => console.log(err));
                    });
                } else {
                    res.status(200).json({
                        message: 'feeds fetched successfully',
                        feeds: newFeeds
                    });
                }
            })
    
        })
        .catch(e => console.log(e));
    });      
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}    
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
        endpoint: String, 
        keys: Schema.Types.Mixed, 
        createDate: 
        { 
            type: Date, 
            default: Date.now 
        } 
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
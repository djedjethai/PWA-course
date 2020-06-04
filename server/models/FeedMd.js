const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedSchema = new Schema({
    id: {
        type: String,
        require: false
    },
    title: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: false
    }
},
{ timestamps: true });

module.exports = mongoose.model('Feed', feedSchema);
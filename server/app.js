const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const feedsRouter = require('./routes/feedsRt');
const subscriptionsRouter = require('./routes/subscriptionsRt');

require('dotenv').config();

// dotenv.config();
const app = express();

// const MONGODB_URI = 'mongodb+srv://djedjethai:rootroot@cluster0-w0ew7.mongodb.net/test?retryWrites=true&w=majority';

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        //the 1st arg is an err, so if it s 'null', we tell multer where to store the file
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        //again, the null inform multer that, if there is no err, then the name of the file will be
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

//to validate the file extenssion
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        //si pas d'err => true on accepte le file
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// app.use(express.static(path.join(__dirname, 'public')));// a quoi ca sert ???

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // create the cors err if no token.
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // create a cors err if have token.
    next();    
})

//'image' car in the view it's the name we gave 
//we have to add {dest: 'images'} for the buffer storage to add it on our server, in the file 'images', 
//but still the extenssion is missing. so we don t use that.
//app.use(multer({dest: 'images'}).single('image'))
//we use 
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
//si on ne mets pa '/image au depart, express serve the file image as it s a root file. 
//but we register the path of our pics as '/images/namePic.....jpg'. so we need to add '/images'
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/feed', feedsRouter);
app.use('/subscription', subscriptionsRouter);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

mongoose.connect(
    process.env.MONGODB_URI
)
.then(result => {
    console.log('connection succeed');
    app.listen(3000);
})
.catch(err => console.log(err))

// Public Key:
// BERSfN8w1o_6561QYSHLODi2uPv5ZMaZTGbQTskh7DLRqGptDAMdv_9Oxtzw6MPqTEK5kMC38eZh-JEzx6oSv30

// Private Key:
// AL_1GGPVzm9M-p-oCFQfYqB9vedWBAh9BwWp02sbyJk
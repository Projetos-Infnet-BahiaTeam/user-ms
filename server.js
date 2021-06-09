
const connection = require("./app/database/mongoose");
const express = require('express');
const app = express();

connection();
app.use(express.json())

const authentication = require('./app/security/authentication');
const verifyToken = require('./app/security/verifyToken');

require('dotenv').config();

const PORT = process.env.SERVER_PORT || 6000;
const router = express.Router();

router.use(verifyToken, function(req, res, next){
    console.log('Calling ms-user... ');
    next();
});

//helth check
router.get('/online', function(req, res){
    res.json({message:'MS-USER IS UP'});
});

router.use('/auth/', authentication);

//use before any request
app.use('/user/v1', router);

// application start
app.listen(PORT, () => {
    console.log("Starting on port: " + PORT);
});
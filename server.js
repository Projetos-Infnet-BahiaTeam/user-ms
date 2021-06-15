
const connection = require("./app/database/mongoose");
const express = require('express');
const app = express();

connection();
app.use(express.json())

const authentication = require('./app/security/authentication');

require('dotenv').config();

const PORT = process.env.SERVER_PORT || 6000;
const router = express.Router();

router.use(function(req, res, next){
    console.log('Calling ms-user... ');
    next();
});

//helth check
router.get('/online', function(req, res){
    res.status(200).send({message:'MS-USER IS UP'});
});

router.use('/auth/', authentication);

//use before any request
app.use('/api/user/v1', router);

// application start
app.listen(PORT, () => {
    console.log("Starting on port: " + PORT);
});
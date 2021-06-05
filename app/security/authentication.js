const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('./verifyToken');
require('dotenv').config();

const KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;

router.post('/registrar', function(req, res) {
  
    //generating hash with password
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    Usuario.create({
      nome : req.body.nome,
      email : req.body.email,
      password : hashedPassword
    },
    function (err, Usuario) {
      if (err) return res.status(500).send("An error occurred while registering the user.")
      
      //creating the token
      const token = jwt.sign({ id: Usuario._id }, KEY, {
        expiresIn: EXPIRES_IN
      });
      res.status(200).send({ auth: true, token: token });
    }); 
});

//Resource used to validate token
router.get('/validartoken', verifyToken, function(req, res, next) {     
    
    Usuario.findById(req.userId,{ password: 0 }, function (err, user) {
        if (err) {
          return res.status(500).send('An unexpected server error has occurred.');
        }
        if (!user){ 
          return res.status(404).send('User not found.');
        }
        
        res.status(200).send(user);
    });
});

router.post('/login', function(req, res) {
    Usuario.findOne({ email: req.body.email }, function (err, user) {
      if (err){ 
        return res.status(500).send('An unexpected server error has occurred.');
      }
      if (!user){ 
        return res.status(404).send('User not found.');
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid){ 
        return res.status(401).send({ auth: false, token: null });
      }

      const token = jwt.sign({ id: user._id }, KEY, {
        expiresIn: EXPIRES_IN
      });
      res.status(200).send({ auth: true, token: token });
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();

router.use(express.json());

const { User, registerValidation, loginValidation} = require('../models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const KEY = process.env.SECRET_KEY;
const EXPIRES_IN = process.env.EXPIRES_IN;

const generateToken = (userId) => {
    const token = jwt.sign({ _id: userId }, KEY, {expiresIn: EXPIRES_IN});
    return token;
}

router.post('/registrar', function(req, res) {

    try {

    const { error } = registerValidation(req.body);
    if (error){
      return res.status(400).send(error.details[0].message);
    }

    //generating hash with password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new User(req.body);
    user.password = hashedPassword;

      //creating the token
      const token = generateToken(user._id);

      User.create(user).then((data) => {
          console.log(data);
        }).catch((err) => {
          console.error(err.message);
        });

      res.status(200).send({ auth: true });
    }
    catch (error) {
      console.log(error.message);
      return res.status(500).send("An error occurred while registering the user: "+error.message)
  }
 
});

/*Resource used to validate token
router.get('/validartoken', verifyToken, function(req, res, next) {     

    User.findById(req.userId,{ password: 0 }, function (err, user) {
        
      if (err) {
          return res.status(500).send('An unexpected server error has occurred.');
        }
        if (!user){ 
          return res.status(404).send('User not found.');
        }
        
        res.status(200).send(user);
    });
});*/

router.post('/login', async function(req, res) {

  try {

    //verify invalid requisition
    const { error } = loginValidation(req.body);

    if (error){
      return res.status(400).send(error.details[0].message);
    }


    //verify if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid email or password");
    }


    //password validation
    const validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
    );
    if (!validPassword){
        return res.status(401).send({ auth: false, token: null , message: 'Invalid email or password'});
    }

    // all right
    const token = generateToken(user._id);
    res.status(200).send({ auth: true, token: token });
    } 
    
  catch (error) {
      console.log(error.message);
      res.status(500).send('An error occured: '+ error.message);
  }
});

module.exports = router;
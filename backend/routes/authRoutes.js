const express = require('express');
const { signup, login, logout, validateToken } = require('../controllers/authController.js');


const authRouter = express.Router();

// Route for signing up a new user
authRouter.post('/signup', signup);

// Route for logging in
authRouter.post('/login', login);

// Route for logging out
authRouter.post('/logout', logout);

// Route for token validation
authRouter.get('/validate-token', validateToken);

 
module.exports = authRouter;
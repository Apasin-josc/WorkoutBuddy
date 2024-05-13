const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//_id because mongodb uses like this this field
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'});
}

//login user
const loginUser = async (req, res) => {
    //to compare the passwords we're going to use bcrypt to compare the passwords from the user / db to login
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password)
        //create token, if there's any error
        const token = createToken(user._id);
        res.status(200).json({email, token});
    } catch ( error){
        res.status(400).json({error: error.message});
    }
}

//signup user
//the await is linking with the userModel.js file, the async await, return :)
//everything between the model and the controller :)
const signupUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.signup(email, password)

        //create token
        const token = createToken(user._id);

        res.status(200).json({email, token});
    } catch ( error){
        //if it doesn't throw a error we create a salt, hash the password and create the document
        res.status(400).json({error: error.message});
    }
}

module.exports = { signupUser, loginUser};
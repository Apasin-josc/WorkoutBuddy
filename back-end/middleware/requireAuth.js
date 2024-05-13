const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // verify user is authenticated 🐟
  //using authorization from the headers of the request object
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required ❌'});
  }

  //splitting the token and then getting the right part of the Bearer token
  const token = authorization.split(' ')[1];

  try {
    //checking if the jsonwebtoken is correct
    const { _id } = jwt.verify(token, process.env.SECRET);

    //using the model to find the user by its id
    req.user = await User.findOne({ _id }).select('_id');

    //goes into the next handler function
    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({error: 'Request is not authorized'});
  }
}

module.exports = requireAuth;
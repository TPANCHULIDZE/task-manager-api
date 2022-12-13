const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    
    const {username}= jwt.decode(token, 'SecretKeyForToken')
    const user = await User.findOne({username, 'tokens.token': token})
    
    if(!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    
    next();
  }catch(error) {
    res.status(401).send({error: 'Authorization is failed'});
  }
  
  
}

module.exports = auth;
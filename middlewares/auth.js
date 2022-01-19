var jwt = require('jsonwebtoken');
const { secret } = require('../serverConfig');
const User = require('../models/User')

const auth = async (req,res,next)=>{
    const token = req.headers.token
    try {

        const decodedPayload = jwt.verify(token, secret);
        const user = await User.findById(decodedPayload.id)
        req.user = user;
        return next()
        
      } catch(err) {
          next({status:401, message:"Authentication error"})
      }
}


module.exports = {
    auth
}
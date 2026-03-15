const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Authorization header must use Bearer token'})
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)

    req.user = await User.findOne({ _id }).select('_id imageKey')
    if (!req.user) {
      return res.status(401).json({error: 'Request is not authorized'})
    }

    next()

  } catch (error) {
    console.log('Auth middleware error:', error.message)
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = requireAuth
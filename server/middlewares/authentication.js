const jwt = require('jsonwebtoken')

const ENV = require('dotenv')
ENV.config()
module.exports = (req, res, next) => {
  if (req.headers.hasOwnProperty('token')) {
    try {
      var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
      next()
    } catch(e) {
      res.status(400).json({
        message: 'INVALID TOKEN'
      })
    }
} else {
    res.status(400).json({
      message: 'PLEASE LOGIN AND GET TOKEN'
    })
  }
}
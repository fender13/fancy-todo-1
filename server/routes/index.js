const router = require('express').Router()
const controller = require('../controllers/userControllers')
const jwt = require('jsonwebtoken')
const ENV = require('dotenv')
ENV.config()

const authentication = require('../middlewares/authentication')

// register a user
router.post('/register', controller.userRegister)

// login a user
router.post('/login', controller.userLogin)

// google sign in
router.post('/google', controller.googleSignIn)

// verify a user and token already exist
router.get('/verify', authentication, (req, res) => {
  let decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET)
  res.status(200).json({
      message: 'User is verified',
      username: decoded.username
  })
})

module.exports = router
const model = require('../models/user')
const jwt = require('jsonwebtoken')
const ENV = require('dotenv')
ENV.config()

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

const comparePassword = require('../helpers/comparePassword')

class UserController {
  static userRegister(req, res) {
    const { firstName, lastName, email, username, password } = req.body

    model.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password
    })
    .then(function(data) {
      res.status(201).json(data)
    })
    .catch(function(e) {
      // let error = {}
      if (e.errors.firstName) {
        // error.firstName=e.errors.firstName.message
        res.status(400).json({
          firstName: e.errors.firstName.message
        })
      } else if (e.errors.lastName) {
        res.status(400).json({
          lastName: e.errors.lastName.message
        })
      } else if (e.errors.username) {
        res.status(400).json({
          username: e.errors.username.message
        })
      } else if (e.errors.email) {
        res.status(400).json({
          email: e.errors.email.message
        })
      } else {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      }
    })
  }

  static userLogin(req, res) {
    const { username, password } = req. body
    let dataUser

    model.findOne({
      username: username
    })
    .then(function(user) {
      dataUser = user
      if (!user) {
        // throw new Error({
        //   status: 400,
        //   message: 'EMAIL'
        // })
        res.status(400).json({
          message: 'EMAIL ATAU PASSWORD ANDA SALAH'
        })
      } else {
        return comparePassword(password, dataUser.password)
      }
    })
    .then(function(result) {
      if (!result) {
        res.status(400).json({
          message: 'EMAIL ATAU PASSWORD ANDA SALAH'
        })
      } else {
        const payload = {
          id: dataUser._id,
          username: dataUser.username
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        res.status(200).json({
          token: token,
          id: dataUser._id,
          username: dataUser.username
        })
      }
    })
    .catch(function(e) {
      res.status(500).json({
        message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
      })
    })
  }

  static googleSignIn(req, res) {
    let logged = ""

    client.verifyIdToken({
      idToken : req.body.id_token,
      audience : process.env.CLIENT_ID 
    })

      .then((response) => {
        logged = response.payload
        return model.findOne({ email: logged.email })
      })

      .then((data) => {
        if (data) {
          const payload = {
            id: data._id,
            email: data.email,
            username: data.username
          }

          const token = jwt.sign(payload, process.env.JWT_SECRET)

          res.status(200).json({
            token: token
          })
        } else {
          model.create({
            firstName: logged.given_name,
            lastName: logged.family_name,
            email: logged.email,
            username: logged.email,
            password: '12345689'
          })

          .then((data) => {
            res.status(201).json({
              message: 'user created',
              token: jwt.sign({
                id: logged.id,
                email: logged.email,
                username: logged.email
              }, process.env.JWT_SECRET), 
              data: data
            })
          })
        }
      })

      .catch((err) => {
        res.status(500).json({
          message: err.message
        })
      })
  }
}

module.exports = UserController
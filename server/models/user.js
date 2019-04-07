const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const ENV = require('dotenv')
ENV.config()

const saltrounds = Number(process.env.SALTROUNDS) || 10

const db_name = process.env.DB_NAME
mongoose.connect(`mongodb://localhost/${db_name}`, { useNewUrlParser: true })

const schema = mongoose.Schema

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const UserSchema = new schema({
  firstName: {
    type: String,
    required: [true, 'First Name field must not empty']
  },
  lastName: {
    type: String,
    required: [true, 'Last Name field must not empty']
  },
  username: {
    type: String,
    required: [true, 'Username field must not empty']
  },
  email: {
    type: String,
    required: [true, 'Email field must not empty'],
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  }, 
  password: {
    type: String,
    required: true
  }
})

UserSchema.pre('save', function(next) {
  var user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(saltrounds, function(err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.path('username').validate(function (value, respond) {
  return mongoose
    .model('Users')
    .collection
    .countDocuments({ username: value })
    .then(function (count) {
      if (count > 0) {
        return false
      }
    })
    .catch(function (err) {
      throw err
    })
}, 'Username already exists!!')

UserSchema.path('email').validate(function (value, respond) {
  return mongoose
    .model('Users')
    .collection
    .countDocuments({ email: value })
    .then(function (count) {
      if (count > 0) {
        return false
      }
    })
    .catch(function (err) {
      throw err
    })
}, 'Email already exists!!')

var Users = mongoose.model('Users', UserSchema)

module.exports = Users
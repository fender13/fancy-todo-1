const bcrypt = require('bcrypt')
module.exports = (password, hash) => {
  return bcrypt.compare(password, hash)
}
const model = require('../models/task')
const jwt = require('jsonwebtoken')
const ENV = require('dotenv')
ENV.config()

module.exports = (req, res, next) => {
  const id = { _id: req.body.id }
  const getUserId = req.headers.token
  const decoded = jwt.decode(getUserId, process.env.JWT_SECRET)

  model.findOne(id)
    .populate('project')
    .then((data) => {
      if (data.project == null) {
        if (data.UserId == decoded.id) {
          next()
        } else {
          res.status(400).json({
            message: 'DILARANG UPDATE JIKA BUKAN PEMILIK TODO'
          })
        }
      } else {
        let members = data.project.members
        let cek = false

        for (let i = 0; i < members.length; i++) {
          if (members[i] == decoded.id) {
            cek = true
          }
        }
        
        if (cek == true) {
          next()
        } else {
          res.status(400).json({
            message: 'DILARANG UPDATE JIKA BUKAN PEMILIK TODO'
          })
        }
      }
    })
}
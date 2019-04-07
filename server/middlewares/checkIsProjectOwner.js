const model = require('../models/project')
const jwt = require('jsonwebtoken')
const ENV = require('dotenv')
ENV.config()

// authorization - check if user is project owner
module.exports = (req, res, next) => {
  const id = { _id: req.body.id }
  const getUserId = req.headers.token
  const decoded = jwt.decode(getUserId, process.env.JWT_SECRET)

  model.findOne(id)
    .populate('ProjectOwner', 'username')
    .then((data) => {
      if (data) {
        if (data.ProjectOwner._id == decoded.id) {
          next()
        } else {
          res.status(400).json({
            message: 'BUKAN PROJECT OWNER DILARANG UPDATE DATA'
          })
        }
      }
      else {
        res.status(404).json({
          message: 'PROJECT TIDAK DITEMUKAN'
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message
      })
    })
}
const model = require('../models/user')

module.exports = (req, res, next) => {
  const username = req.body.username

  model.findOne({
    username
  })
    .then((data) => {
      if (data) {
        req.dataUser = data
        next()
      }
      else {
        res.status(404).json({
          message: 'USER TIDAK DITEMUKAN'
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message
      })
    })
}
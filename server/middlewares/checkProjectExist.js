const model = require('../models/project')

module.exports = (req, res, next) => {
  const id = { _id: req.body.id }

  model.findOne(id)
    .populate('ProjectOwner', 'username')
    .then((data) => {
      if (data) {
        req.dataProject = data
        next()
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
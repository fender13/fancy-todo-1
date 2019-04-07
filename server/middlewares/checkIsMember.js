const model = require('../models/user')
const project = require('../models/project')

module.exports = (req, res, next) => {
  const username = req.body.username
  const id = { _id: req.body.id }
  let user

  model.findOne({
    username
  })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message: 'USER TIDAK DITEMUKAN'
        })
        
      }
      else {
        user = data
        req.userData = data
        project.findOne(id)
          .then((data) => {
            let members = data.members
            const str = user._id.toString()
            let count = 0
      
            for (let i = 0; i < members.length; i++) {
              if (members[i] == str) {
                count++
              }
            }
      
            if (count > 0) {
              next()
            } else {
              res.status(404).json({
                message: 'USER TIDAK DITEMUKAn'
              })
            }
          })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message
      })
    })
}
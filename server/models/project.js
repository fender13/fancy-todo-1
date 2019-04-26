const mongoose = require('mongoose')
const ENV = require('dotenv')
ENV.config()

// const db_name = process.env.DB_NAME
// mongoose.connect(`mongodb://localhost/${db_name}`, { useNewUrlParser: true })

mongoose.set('useFindAndModify', false)

const schema = mongoose.Schema

const ProjectSchema = new schema ({
  projectName: {
    type: String,
    required: true
  },
  members: [{
    type: schema.Types.ObjectId,
    ref: 'Users'
  }],
  ProjectOwner: {
    type: schema.Types.ObjectId,
    ref: 'Users',
    require: true
  }
})

ProjectSchema.path('projectName').validate(function (value, respond) {
  return mongoose
    .model('Projects')
    .collection
    .countDocuments({ projectName: value })
    .then(function (count) {
      if (count > 0) {
        return false
      }
    })
    .catch(function (err) {
      throw err
    })
}, 'Project already exists!!')

var Projects = mongoose.model('Projects', ProjectSchema)

module.exports = Projects
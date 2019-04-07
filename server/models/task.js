const mongoose = require('mongoose')
const ENV = require('dotenv')
ENV.config()

const db_name = process.env.DB_NAME
mongoose.connect(`mongodb://localhost/${db_name}`, { useNewUrlParser: true })

const schema = mongoose.Schema

const TaskSchema = new schema({
  taskName: {
    type: String,
    required: true
  },
  project: {
    type: schema.Types.ObjectId,
    ref: 'Projects'
  },
  assignee: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  status: String,
  UserId: {
    type: schema.Types.ObjectId,
    ref: 'Users',
    require: true
  }
})

var Tasks = mongoose.model('Tasks', TaskSchema)

module.exports = Tasks
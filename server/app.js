const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const ENV = require('dotenv')
ENV.config()

const port = Number(process.env.PORT)

const db_name = process.env.DB_URL
mongoose.connect(`${db_name}`, { useNewUrlParser: true })

const index = require('./routes/index')
const taskRouters = require('./routes/task')
const projectRouters = require('./routes/project')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/', index)
app.use('/tasks', taskRouters)
app.use('/projects', projectRouters)

app.listen(port, () => {
  console.log('SERVER IS ON AND LISTEN TO', port)
})

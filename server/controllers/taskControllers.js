const model = require('../models/task')
const project = require('../models/project')
const user = require('../models/user')
const jwt = require('jsonwebtoken')
const ENV = require('dotenv')
ENV.config()

class TaskController {
  static findAllTask(req, res) {
    const token = req.headers.token
    const decode = jwt.decode(token, process.env.JWT_SECRET)
    let userData

    model.find()
      .populate({ path: 'project'})
      .then((data) => {
        userData = data
        return project.find()
      })
      .then((data) => {
        let arrProject = []
        for (let i = 0; i < data.length; i++) {
          let dataMember = data[i].members
          for (let j = 0; j < dataMember.length; j++) {
            if (dataMember[j] == decode.id) {
              arrProject.push(data[i])
            }
          }
        }
        
        let showData = []
        for (let i = 0; i < userData.length; i++) {
          if (userData[i].UserId == decode.id && userData[i].project == null) {
            showData.push(userData[i])
          }
          for (let j = 0; j < arrProject.length; j ++) {
            let strProjectID = arrProject[j]._id.toString()
            let userProject = userData[i].project
            if (userProject != null) {
              if (userProject._id == strProjectID) {
                showData.push(userData[i])
              }
            }
          } 
        }
        res.status(200).json(showData)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static addNewTask(req, res) {
    const { taskName, dueDate, priority } = req.body
    let decode = jwt.decode(req.headers.token) 

    model.create({
      taskName: taskName,
      project: null,
      assignee: null,
      dueDate: new Date(dueDate),
      priority: priority,
      status: 'back-log',
      UserId: decode.id
    })
      .then((data) => {
        res.status(201).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static updateTaskDetail(req, res) {
    const { id, taskName, dueDate, priority, status } = req.body
    const getId = { _id: id }

    model.findByIdAndUpdate(getId, {
      taskName,
      dueDate,
      priority, 
      status
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static updateTaskProject(req, res) {
    const { id, project } = req.body
    const getId = { _id: id }

    model.findOneAndUpdate(getId, {
      project
    })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static updateAssignee(req, res) {
    const { id, username } = req.body
    const getId = { _id: id }
    let dataTask

    model.findOne(getId)
      .populate('project')
      .then((data) => {
        dataTask = data
        return user.findOne({
          username
        })
      })
      .then((data) => {
        let userId = data._id.toString()
        let project = dataTask.project
        let members = project.members

        let cek = false

        for (let i = 0; i < members.length; i++) {
          if (members[i] == userId) {
            cek = true
          } 
        }

        if (cek == false) {
          res.status(400).json({
            message: `USERNAME BUKAN MEMBERS DARI PROJECT ${project.projectName}`
          })
        } else {
          return model.findByIdAndUpdate(getId, {
            assignee: data.username
          })
        }
      })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static deleteTask(req, res) {
    const id = req.params.id
    const getId = { _id: id }

    model.findByIdAndDelete(getId)
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }
}

module.exports = TaskController
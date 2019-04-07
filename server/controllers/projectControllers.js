const model = require('../models/project')
const jwt = require('jsonwebtoken')
const ENV = require('dotenv')
ENV.config()

class ProjectController {
  static createNewProject(req, res) {
    const projectName = req.body.projectName
    const decode = jwt.decode(req.headers.token)
    
    model.create({
      projectName: projectName,
      ProjectOwner: decode.id
    })
      .then((data) => {
        const getId = { _id: data._id }
        return model.findByIdAndUpdate(getId, 
          { "$push": { "members": decode.id } },
          { "new": true, "upsert": true }
        )
      })
      .then((dataOne) => {
        res.status(201).json(dataOne)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static getAllProjects(req, res) {
    const token = req.headers.token
    const decode = jwt.decode(token, process.env.JWT_SECRET)

    model.find()
      .then((data) => {
        let arr = []
        for (let i = 0; i < data.length;i++) {
          let dataMember = data[i].members
          for (let j = 0; j < dataMember.length; j++) {
            if (dataMember[j] == decode.id) {
              arr.push(data[i])
            }
          }
        }
        res.status(200).json(arr)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static getProject(req, res) {
    const getId = { _id: req.params.id }
    
    model.findOne(getId)
      .populate('ProjectOwner', 'username')
      .populate('members', 'username')
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static updateAddMember(req, res) {
    const projectId = req.params.projectID
    const userId = req.params.userID
    const getId = { _id: projectId }

    model.findByIdAndUpdate(getId, 
      { "$push": { "members": userId } },
      { "new": true, "upsert": true }
    )
      .then((data) => {
        res.redirect('http://localhost:8080')
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static updateRemoveMember(req, res) {
    const id = req.body.id
    const user = req.userData
    const getId = { _id: id }
    const userID = user._id.toString()

    model.findByIdAndUpdate(getId,
      { "$pull": { "members": userID } },
      { "new": true, "upsert": true }
    )
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Terjadi kesalahan pada server. Cobalah beberapa saat lagi..'
        })
      })
  }

  static deleteProject(req, res) {
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

module.exports = ProjectController
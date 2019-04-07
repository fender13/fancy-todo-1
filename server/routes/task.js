const router = require('express').Router()
const controller = require('../controllers/taskControllers')
const authentication = require('../middlewares/authentication')
const taskAuthorization = require('../middlewares/taskAuthorization')

// get all task
router.get('/', authentication, controller.findAllTask)

// create new task
router.post('/', authentication, controller.addNewTask)

// edit task
router.put('/', authentication, taskAuthorization, controller.updateTaskDetail)

// edit task project
router.put('/editproject', authentication, taskAuthorization, controller.updateTaskProject)

// edit task assignee
router.put('/editassignee', authentication, taskAuthorization, controller.updateAssignee)

// router delete task
router.delete('/:id', authentication, taskAuthorization, controller.deleteTask)

module.exports = router
const router = require('express').Router()
const controller = require('../controllers/projectControllers')

// middleware token authentication
const authentication = require('../middlewares/authentication')

// middleware check user if exist before send email to add member
const checkUserExist = require('../middlewares/checkUserExist')

// middleware check project if exist before send mail to add member
const checkProjectExist = require('../middlewares/checkProjectExist')

// if user and project exist send email confirmation
const sendEmailAddMemberNotification = require('../middlewares/sendAddMemberNotification')

// if updates is done only from ProjectOwner - authorization
const checkIsProjectOwner = require('../middlewares/checkIsProjectOwner')

// check if project owner request is a member
const checkIsMember = require('../middlewares/checkIsMember')

// create a project
router.post('/', authentication, controller.createNewProject)

// get all projects
router.get('/', controller.getAllProjects)

// get a projects
router.get('/:id', controller.getProject)

// send email confirmation to add a member
router.post('/confirmation', authentication, checkUserExist, checkProjectExist, checkIsProjectOwner, sendEmailAddMemberNotification)

// update add members
router.get('/:projectID/:userID', controller.updateAddMember)

// remove members
router.put('/', authentication, checkIsMember, checkIsProjectOwner, controller.updateRemoveMember)

// remove projects
router.delete('/:id', authentication, checkIsProjectOwner, controller.deleteProject)

module.exports = router
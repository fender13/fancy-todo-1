const axi = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {'token': localStorage.getItem('token')}
})

const baseurl = 'http://localhost:3000'

// verify if has token
$(document).ready(function() {
  if (localStorage.hasOwnProperty('token')) {
    axi
      .get('/verify')
      .then(({ data }) => {
        getAllTask()
        getAllProject()
        $('.page').hide()
        $('.page.dashboard').show()
        $('.dashboard-button').show()
        $('.sign-in-button').hide()
        $('.logout-button').show()
        $('.project-list').hide()
      })
      .catch(({ response }) => {
        console.log(response)
      })
  } else  {
    $('.page').hide()
    $('.page.home').show()

    $('.dashboard-button').hide()
    $('.logout-button').hide()
    $('.sign-in-button').show()
    
    $('.register-form').hide()

    $('.log-button').hide()

    $('.footer').hide()
  }
})

// get all task
function getAllTask() {
  $.ajax({
    url: `${baseurl}/tasks`,
    type: 'GET',
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      if (data.length == 0) {
        $('.table-todo').hide()
        $('.project-list').hide()
        $('.list-todo-empty').show()
      } else {
        console.log(data)
        $('.table-todo').show()
        $('.list-todo-empty').hide()
        $('.body-todo').html('')
        let html = ''
        for (let i = 0; i < data.length; i++) {
          let strDueDate = new Date(data[i].dueDate).toLocaleDateString()

          let projectName
          if (data[i].project != null) {
            projectName = data[i].project.projectName
          } else {
            projectName = '--'
          }

          let today = new Date()
          let dueDate = new Date(data[i].dueDate)
          let calculate = Math.abs(dueDate - today)
          let sisa = Math.ceil(calculate / (1000 * 3600 * 24))
          
          let showSisaHari = ''
          if (sisa < 0) {
            showSisaHari = 'TOO LATE'
          } else {
            showSisaHari = `${strDueDate} <br> in ${sisa} Days`
          }

          let assigneeUsername = ''
          if (data[i].assignee == null) {
            assigneeUsername = '--'
          } else {
            assigneeUsername = data[i].assignee
          }

          html += `
          <tr class="row100">
              <td class="column100 column1" data-column="column1">${data[i].taskName}</td>
              <td class="column100 column2" data-column="column2">${projectName}</td>
              <td class="column100 column3" data-column="column3">${assigneeUsername}</td>
              <td class="column100 column4" data-column="column4">${showSisaHari}</td>
              <td class="column100 column5" data-column="column5">${data[i].priority}</td>
              <td class="column100 column7" data-column="column6">${data[i].status}</td>
              <td class="column100 column7" data-column="column7">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Options
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="#" data-toggle="modal" data-target="#edit-task" onclick="editTask('${data[i]._id}','${data[i].taskName}', '${data[i].dueDate}', '${data[i].priority}', '${data[i].status}')">Edit Task</a>
                  <a class="dropdown-item" href="#" data-toggle="modal" data-target="#edit-task-project" onclick="getProject('${data[i]._id}', '${projectName}')">Add to Project</a>
                  <a class="dropdown-item add-assignee-edit-task" href="#" data-toggle="modal" data-target="#edit-task-assignee" onclick="getAssignee('${data[i]._id}', '${projectName}')">Add Assignee</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" onclick="deleteTask('${data[i]._id}')">Delete Task</a>
                </div>
              </td>
          </tr>
          `
        }
        $('.body-todo').append(html)
      }
    })
    .fail((response) => {
      console.log(response)
    })
}

// add new task
$('#new-task').on('click', function(event) {
  const taskName = $("#input-new-task").val()
  const dueDate = $("#input-task-due-date").val()
  const priority = $("#input-select-priority").val()
  
  $.ajax({
    url: `${baseurl}/tasks`,
    type: 'POST',
    data: {
      taskName: taskName,
      dueDate: dueDate,
      priority: priority
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllTask()
      $("#input-new-task").val('')
      $("#input-task-due-date").val('')
      $("#input-select-priority").val('')
      $('#form-todo').modal('hide') 
    })
    .fail((err) => {
      console.log(err)
    })
})

// modal edit task detail
function editTask(id, name, dueDate, priority, status) {
  let split = dueDate.split('').slice(0, 10).join('')

  $('.task-id-edit').html('')
  $('.task-name-edit').html('')
  $('.task-dueDate-edit').html('')
  $('.task-priority-edit').html('')
  $('.task-status-edit').html('')

  let htmlTaskid = ''
  let htmlTaskName = ''
  let htmlDueDate = ''
  let htmlPriority = ''
  let htmlStatus = ''

  
  htmlTaskid += `
  <label for="recipient-name" class="col-form-label">Task ID:</label>
  <input class="form-control" id="input-Task-ID-edit" type="text" placeholder="Enter Task ID Here" value="${id}" disabled>
  `

  htmlTaskName += `
  <label for="recipient-name" class="col-form-label">Task Name:</label>
  <input class="form-control" id="input-task-name-edit" type="text" placeholder="Enter Task Here" value="${name}">
  `
  
  htmlDueDate +=`
  <label for="message-text" class="col-form-label">Due Date:</label>
  <input class="form-control date-form" id="input-task-due-date-edit" type="date" placeholder="Enter ToDo Here" name="setTodaysDate" value="${split}">
  `
  
  htmlPriority += `
  <label for="message-text" class="col-form-label">Priority:</label>
  <select class="custom-select" id="input-select-priority-edit">
    <option value="low">Low Priority</option>
    <option value="medium">Medium Priority</option>
    <option value="high">High Priority</option>
    <option value="critical">Critical Priority</option>
  </select>
  `
  
  htmlStatus += `
  <label for="message-text" class="col-form-label">Status:</label>
  <select class="custom-select" id="input-select-status-edit">
    <option value="back-log">back-log</option>
    <option value="todo">ToDo</option>
    <option value="ongoing">On Going</option>
    <option value="done">Done</option>
  </select>
  `
  
  $('.task-id-edit').append(htmlTaskid)
  $('.task-name-edit').append(htmlTaskName)
  $('.task-dueDate-edit').append(htmlDueDate)
  $('.task-priority-edit').append(htmlPriority)
  $('.task-status-edit').append(htmlStatus)

  document.getElementById('input-select-priority-edit').value = priority
  document.getElementById('input-select-status-edit').value = status
}

// edit task
$('#edit-task-details').on('click', function() {
  const id = $("#input-Task-ID-edit").val()
  const taskName = $("#input-task-name-edit").val()
  const dueDate = $("#input-task-due-date-edit").val()
  const priority = $("#input-select-priority-edit").val()
  const status = $("#input-select-status-edit").val()

  $.ajax({
    url: `${baseurl}/tasks`,
    type: 'PUT',
    data: {
      id,
      taskName,
      dueDate,
      priority,
      status
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllTask()
      $('#edit-task').modal('hide') 
    })
    .fail((err) => {
      console.log(err)
    })
})

// form project to task
function getProject(id, project) {
  $('.task-id-project-edit').html('')
  $('#input-select-Project-edit').html('')

  $.ajax({
    url: `${baseurl}/projects`,
    type: 'GET',
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      if (data.length == 0) {
        console.log('PROJECT TIDAK DITEMUKAN')
      } else {
        let htmlTaskid = ''
        let htmlProject = ''

        for (let i = 0; i < data.length; i++) {
          htmlProject +=`
          <option value="${data[i]._id}">${data[i].projectName}</option>
          `
        }

        htmlTaskid = `
        <label for="recipient-name" class="col-form-label">Task ID:</label>
        <input class="form-control" id="input-Task-ID-edit" type="text" placeholder="Enter Task ID Here" value="${id}" disabled>
        `

        $('.task-id-project-edit').append(htmlTaskid)
        $('#input-select-Project-edit').append(htmlProject)

        if (project != null) {
          let id = ''
          for (let i = 0; i < data.length; i++) {
            if (data[i].projectName == project) {
              id = data[i]._id
            }
          }
          document.getElementById('input-select-Project-edit').value = id
        }
      }
    })
    .fail((response) => {
      console.log(response)
    })
}

// add project to task
$('#edit-task-project-details').on('click', function() {
  const id = $('#input-Task-ID-edit').val()
  const project = $('#input-select-Project-edit').val()

  $.ajax({
    url: `${baseurl}/tasks/editproject`,
    type: 'PUT',
    data: {
      id,
      project
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllTask()
      $('#edit-task-project').modal('hide') 
    })
    .fail((err) => {
      console.log(err)
    })
})

//  from assignee to task
function getAssignee(id, project) {
  $('.task-id-assignee-edit').html('')
  $('.task-assignee-edit').html('')

  $.ajax({
    url: `${baseurl}/projects`,
    type: 'GET',
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      if (data.length == 0) {
        console.log('PROJECT TIDAK DITEMUKAN')
      } else {
        if (project == '--') {
          console.log('PROJECT TIDAK DITEMUKAN')
        } else {
          let htmlTaskid = ''
          let htmlAddAsignee = ''

          htmlTaskid = `
          <label for="recipient-name" class="col-form-label">Task ID:</label>
          <input class="form-control" id="input-Task-ID-edit-assignee" type="text" placeholder="Enter Task ID Here" value="${id}" disabled>
          `

          htmlAddAsignee = `
          <label for="recipient-name" class="col-form-label">Task Name:</label>
          <input class="form-control" id="input-task-assignee-edit" type="text" placeholder="Enter Assignee Username Here">
          `

          $('.task-id-assignee-edit').append(htmlTaskid)
          $('.task-assignee-edit').append(htmlAddAsignee)
        }
      }
    })
    .fail((response) => {
      console.log(response)
    })
}

// add assignee to task
$('#edit-task-assignee-details').on('click', function() {
  const id = $('#input-Task-ID-edit-assignee').val()
  const username = $('#input-task-assignee-edit').val()

  $.ajax({
    url: `${baseurl}/tasks/editassignee`,
    type: 'PUT',
    data: {
      id,
      username
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllTask()
      $('#edit-task-assignee').modal('hide') 
    })
    .fail((response) => {
      console.log(response)
    })
})

// delete task
function deleteTask(id) {
  swal("Are you sure you want to do this?", {
    buttons: ["Oh no!", true],
  })
    .then((data) => {
      if (data == true) {
        $.ajax({
          url: `${baseurl}/tasks/${id}`,
          type: 'DELETE',
          data: {
            id: id
          },
          headers: { 'token': localStorage.getItem('token') }
        })
          .done((data) => {
            getAllTask()
          })
          .fail((err) => {
            console.log(err)
          })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

// logout
$('.logout-button').on('click', function(event) {
  event.preventDefault()
  var auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function () {
    console.log('User signed out.')
  })
  localStorage.clear()
  window.location = "http://localhost:8080"
  
})

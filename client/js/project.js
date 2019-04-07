// add new project
$('#new-project').on('click', function(event) {
  const newProjectName = $("#input-new-project-name").val()
  
  $.ajax({
    url: `${baseurl}/projects`,
    type: 'POST',
    data: {
      projectName: newProjectName
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllProject()
      $("#input-new-project-name").val('')
      $('#form-project').modal('hide') 
    })
    .fail((err) => {
      console.log(err)
    })
})

// get all project
function getAllProject() {
  $.ajax({
    url: `${baseurl}/projects`,
    type: 'GET',
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      if (data.length == 0) {
        $('.empty-project').show()
        $('.get-project').hide()
      } else {
        $('.get-project').show()
        $('.empty-project').hide()
        $('.project-cards').html('')
        
        let html = ''

        for (let i = 0; i < data.length; i++) {
          html += `
          <div class="col-3">
            <div class="card border-success mb-3 project-card mt-5" style="max-width: 18rem;">
              <div class="card-header">${data[i].projectName}</div>
                <div class="card-body text-success">
                    <div class="card-details">
                      <a href="#" data-toggle="modal" data-target="#project-details" onclick="getProjectDetails('${data[i]._id}')">See Details</a>
                    </div>
                    <div class="card-details">
                      <a href="#" data-toggle="modal" data-target="#project-add-member" onclick="addNewMember('${data[i]._id}')">Add Members</a>
                    </div>
                    <div class="card-details">
                      <a href="#" data-toggle="modal" data-target="#project-remove-member" onclick="removeMember('${data[i]._id}')">Remove Members</a>
                    </div>
                    <div class="card-details">
                      <a href="#" onclick="deleteProject('${data[i]._id}')">Delete</a>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          `
          
        }
        $('.project-cards').append(html)        
      }
    })
    .fail((err) => {
      console.log(err)
    })
}

// get project details
function getProjectDetails(id) {
  $.ajax({
    url: `${baseurl}/projects/${id}`,
    type: "GET"
  })
    .done((data) => {
      $('.modal-project-details').html('')
      let allMember = data.members
      let members = ''

      for (let i = 0; i < allMember.length; i++) {
        members += `
          <li class="member-username">${allMember[i].username}</li>
        `
      }

      let html = `
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${data.projectName}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div>
          <div class="row">
            <label for="staticEmail" class="ml-3 form-label">Project Owner:</label>
          </div>
          <div class="member-username">
            ${data.ProjectOwner.username}
          </div>
        </div>
        <div>
          <div class="row">
            <label for="staticEmail" class="ml-3 form-label">Members:</label>
          </div>
          <div>
            <ul>
              ${members}
            </ul>
          </div>
        </div>
      </div>
      `

      $('.modal-project-details').append(html)
    })
    .fail((err) => {
      console.log(err)
    })
}

// new member form details
function addNewMember(id) {
  $('.project-id-add').html('')

  let htmlModal = ''

  htmlModal += `
  <label for="recipient-name" class="col-form-label">Project ID:</label>
  <input class="form-control" id="input-new-project-id" type="text" placeholder="Enter Project Name Here" value="${id}" disabled>
  `

  $('.project-id-add').append(htmlModal)
}

// add new member for project
$('#new-project-member').on('click', function() {
  let projectid = $('#input-new-project-id').val()
  let username = $('#input-new-project-member').val()

  $.ajax({
    url: `${baseurl}/projects/confirmation`,
    type: 'POST',
    data: {
      id: projectid,
      username: username
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllProject()
      $("#input-new-project-member").val('')
      $('#project-add-member').modal('hide') 
    })
    .fail((err) => {
      console.log(err)
    })
})

// remove member details
function removeMember(id) {
  $('.project-id-remove').html('')

  let htmlModal = ''

  htmlModal += `
  <label for="recipient-name" class="col-form-label">Project ID:</label>
  <input class="form-control" id="input-project-id" type="text" placeholder="Enter Project Name Here" value="${id}" disabled>
  `

  $('.project-id-remove').append(htmlModal)
}

// remove a member if exist
$('#remove-project-member').on('click', function() {
  let projectid = $('#input-project-id').val()
  let username = $('#input-remove-project-member').val()
  
  $.ajax({
    url: `${baseurl}/projects`,
    type: 'PUT',
    data: {
      id: projectid,
      username: username
    },
    headers: { 'token': localStorage.getItem('token') }
  })
    .done((data) => {
      getAllProject()
      $("#input-remove-project-member").val('')
      $('#project-remove-member').modal('hide') 
    })
    .fail((err) => {
      console.log(err)
    })
})

// delete a project
function deleteProject(id) {
  swal("Are you sure you want to do this?", {
    buttons: ["Oh no!", true],
  })
    .then((data) => {
      if (data == true) {
        $.ajax({
          url: `${baseurl}/projects/${id}`,
          type: 'DELETE',
          data: {
            id: id
          },
          headers: { 'token': localStorage.getItem('token') }
        })
          .done((data) => {
            getAllProject()
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
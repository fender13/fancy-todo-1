$('.onRegister-button').on('click', function(event) {
  $('.log-button').show()
  $('.reg-button').hide()
  $('.login-form').hide()
  $('.register-form').show()
})

$('.onLogin-button').on('click', function(event) {
  $('.log-button').hide()
  $('.reg-button').show()
  $('.login-form').show()
  $('.register-form').hide()
})

// user register
$('#submit-register').on('click', function(event) {
  const firstName = $("#firstName").val()
  const lastName = $("#lastName").val()
  const email = $("#email").val()
  const username = $("#username-register").val()
  const password = $("#password-register").val()

  axi
    .post('/register', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password
    })
    .then(({ data }) => {
      $("#firstName").val('')
      $("#lastName").val('')
      $("#email").val('')
      $("#username-register").val('')
      $("#password-register").val('')
      $('input[type=checkbox]').prop('checked', false)

      $('.login-form').show()
      $('.log-button').hide()
      $('.register-form').hide()
      $('.reg-button').show()

      event.preventDefault()
      $('.page').hide()
      $('.home').show()
    })
    .catch(({ response }) => {
      console.log(response)
    })
})

// user login
$('#submit-login').on('click', function(event) {
  const username = $("#username-login").val()
  const password = $("#password-login").val()

  axi
    .post('/login', {
      username: username,
      password: password
    })
    .then(({ data }) => {
      localStorage.setItem('token', data.token)
      $("#username-login").val('')
      $("#password-login").val('')
      $('.page.dashboard').show()
      $('.dashboard-button').show()
      $('.logout-button').show()
      $('.sign-in-button').hide()
      
      event.preventDefault()
      $('.page').hide()
      
      $('.dashboard').show()
      getAllTask()
      getAllProject()
    })
    .catch(({ response }) => {
      console.log(response)
    })
})

// google login
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token

  $.ajax({
    method: 'POST',
    url: `${baseurl}/google`,
    data: {
      id_token: id_token
    }
  })
    .done((response) => {
      localStorage.setItem('token', response.token)
      $('.page').hide()
      $('.page.dashboard').show()
      $('.dashboard-button').show()
      $('.sign-in-button').hide()
      $('.logout-button').show()
      $('.project-list').hide()
      getAllTask()
      getAllProject()
    })
    .fail((err) => {
      console.log(err)
    })
}
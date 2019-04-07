$('.page-connect').on('click', function(event) {
  event.preventDefault()
  const name = this.dataset.page
  if (name == 'home') {
    $('.footer').hide()
  } else {
    $('.footer').show()
  }
  $('.page').hide()
  $('.main-menu').show()
  $('.' + name).show()
})
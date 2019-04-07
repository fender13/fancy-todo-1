function dashboardMenu(menu) {
  let dashboardTitle = '<h5>Projects</h5>'
  if (menu.value == 'project') {
    $('.dashboard-title').html(dashboardTitle)
    getAllProject()
    $('.main-dashboard').hide()
    $('.todo-list').hide()
    $('.project-list').show()
  } else {
    dashboardTitle = '<h5>Tasks</h5>'
    getAllTask()
    $('.dashboard-title').html(dashboardTitle)
    $('.main-dashboard').hide()
    $('.todo-list').show()
    $('.project-list').hide()
  }
}

var today = new Date().toISOString().split('T')[0]
document.getElementsByName("setTodaysDate")[0].setAttribute('min', today)

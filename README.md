# fancy-todo

---

**Additional Features**\
NodeMailer

---

**User Table**\
firstName: REQUIRED\
lastName: REQUIRED\
username: REQUIRED\
email: REQUIRED\
password: REQUIRED

**User Routes**
No | HTTP | Routes | Header | body | Description | Success | error
--- | --- | --- | --- | --- | --- | --- | ---
1 | POST | /register | | firstName, lastName, username, email, password | Manual Registration | Object { _id, firstName, lastName, username, email, password } | Object { message: ... } 500 (Internal Server Error)
2 | POST | /login | | username, password | Manual Login | 200 (token) | Object { message: ... } 500 (Internal Server Error)
3 | POST | /google || Google Id_Token | Google Sign In | 200 (token) | Object { message: ... } 500 (Internal Server Error)

---

**Task Table**\
taskName: required\
project: not required\
assignee: not reqired\
dueDate: required\
priority: required\
status: back-log (automatic for first time register new task)\
UserId: required

**Task Routes**
No | HTTP | Routes | Header | body | Description | Success | error
--- | --- | --- | --- | --- | --- | --- | ---
1 | GET | /tasks | token | | Get ALl Tasks | View All Task or View Rocket | Object { message: ... } 500 (Internal Server Error)
2 | POST | /tasks | token | taskName, dueDate, priority | Add New Task | 201 Object{ _id, taskName, project, assignee, dueDate, priority, status, UserId } | Object { message: ... } 500 (Internal Server Error)
3 | PUT | /tasks | token | id, taskName, dueDate, priority, status | Update Task Details | 200 Object { _id, taskName, project, assignee, dueDate, priority, status, UserId } | Object { message: ... } 500 (Internal Server Error)
4 | PUT | /tasks/editproject | token | id, project | Add Project to Task | 200 Object { _id, taskName, project, assignee, dueDate, priority, status, UserId } | Object { message: ... } 500 (Internal Server Error)
5 | PUT | /tasks/editassignee | token | id, username | Add Assignee to Task | 200 Object { _id, taskName, project, assignee, dueDate, priority, status, UserId } | Object { message: ... } 500 (Internal Server Error)
6 | DELETE | /tasks/:id | token | id | Delete a Task by ID Task | 200 - Sukses Delete | Object { message: ... } 500 (Internal Server Error)

---

**Project Table**\
projectName: required\
members: Array, not required\
ProjectOwner: required

**Project Routes**
No | HTTP | Routes | Header | body | Description | Success | error
--- | --- | --- | --- | --- | --- | --- | ---
1 | POST | /projects | token | projectName | Add New Project | 201 Object{ _id, projectName, members (empty array), ProjectOwner } | Object { message: ... } 500 (Internal Server Error)
2 | GET | /projects | token | | Get All Projects Related By Member | 200 [ Object{ _id, projectName, members, ProjectOwner } ] | Object { message: ... } 500 (Internal Server Error)
3 | GET | /projects/:id | token | | Get One Project Details | 200 Object{ _id, projectName, members, ProjectOwner } | Object { message: ... } 500 (Internal Server Error)
4 | POST | /projects/confirmation | token | id, username | Send Email Confirmation to Target Member | Modal Form Closed | Object { message: ... } 500 (Internal Server Error)
5 | GET | /projects/:projectID/:userID |  | projectId, userId | Push Member To Array After Target Member Confirmation |  Redirect To Homepage | Object { message: ... } 500 (Internal Server Error)
6 | PUT | /projects | token | projectId, username | Pull Member From Array Project | Modal Form Closed | Object { message: ... } 500 (Internal Server Error)
7 | DELETE | /projects/:id | token | projectId | Delete a Project by ID Project | 200 - Sukses Delete | Object { message: ... } 500 (Internal Server Error)
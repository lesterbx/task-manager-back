const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { workspaceController, userController, adminController } = require('./src/controllers')
const { auth, admin, begin, success, fail, } = require('./src/middlewares')
const middlewares = (controller) => [begin, controller, success]

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

app.use(auth)

app.post('/workspace', middlewares(workspaceController.create))
app.delete('/workspace/:workspaceID', admin, middlewares(workspaceController.delete))

app.post('/workspace/:workspaceID/user', admin, middlewares(userController.create, success))
app.delete('/workspace/:workspaceID/user/:userID', admin, middlewares(userController.delete, success))

app.post('/workspace/:workspaceID/admin', admin, middlewares(adminController.create))
app.delete('/workspace/:workspaceID/admin/:userID', admin, middlewares(adminController.delete))

app.use(fail)

app.listen(3000, () => console.log('Listening on port 3000!'))

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { workspaceController, userController, adminController } = require('./src/controllers')
const { auth, admin, begin, success, fail, } = require('./src/middlewares')
const middlewares = (controller) => [begin, controller, success]

/**
 * Instanciates the express app.
 */
const app = express()

/**
 * Sets up the plugins for cors support and to parse the request bodies.
 */
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

/**
 * Sets the use for the auth middleware
 */
app.use(auth)

/**
 * Sets the workspace related end points
 */
app.post('/workspace', middlewares(workspaceController.create))
app.delete('/workspace/:workspaceID', admin, middlewares(workspaceController.delete))

/**
 * Sets the user related end points
 */
app.post('/workspace/:workspaceID/user', admin, middlewares(userController.create, success))
app.delete('/workspace/:workspaceID/user/:userID', admin, middlewares(userController.delete, success))

/**
 * Sets the admin related end points
 */
app.post('/workspace/:workspaceID/admin', admin, middlewares(adminController.create))
app.delete('/workspace/:workspaceID/admin/:userID', admin, middlewares(adminController.delete))

/**
 * Sets the error handling middleware
 */
app.use(fail)

/**
 * Starts listening
 */
app.listen(80, () => console.log('Listening on port 80!'))

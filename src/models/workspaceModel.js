const axios = require('axios')
const PouchDB = require('pouchdb')
const workspaceDesign = require('../../couch/design/workspace')
const validateWorkspace = require('../../couch/validators/validateWorkspace')
const config = require('../../config.js')
const { promisifyValidator, workspaceNotExist, couchURL, parseError, checkUserExists } = require('../utils')
const { addWorkspaceToUser, addWorkspaceToAdmin, removeWorkspaceFromUser, removeWorkspaceFromAdmin } = require('../database')
const conflictResolver = require('../conflictResolver')

const dbhost = couchURL(config)

const addWorkspaceSecurity = (workspaceID) => {
  return axios.put(`${dbhost}/${workspaceID}/_security`, { admins: { roles: [`${workspaceID}-admin`] }, members: { roles: [`${workspaceID}-member`] } })
}

const addWorkspaceToUsers = (workspaceID, users) => {
  return Promise.all(users.map((user) => checkUserExists(user)
    .then(() => addWorkspaceToUser(workspaceID, user))))
    .then(() => Promise.resolve())
}

const addWorkspaceToAdmins = (workspaceID, admins) => {
  return Promise.all(admins.map((user) => checkUserExists(user)
    .then(() => addWorkspaceToAdmin(workspaceID, user))))
    .then(() => Promise.resolve())
}

const removeWorkspaceFromUsers = (workspaceID, users) => {
  return Promise.all(users.map((user) => checkUserExists(user)
    .then(() => removeWorkspaceFromUser(workspaceID, user))))
    .then(() => Promise.resolve())
}

const removeWorkspaceFromAdmins = (workspaceID, admins) => {
  return Promise.all(admins.map((user) => checkUserExists(user)
    .then(() => removeWorkspaceFromAdmin(workspaceID, user))))
    .then(() => Promise.resolve())
}

const workspaceModel = {
  create: (workspace) => {
    const newDB = new PouchDB(`${dbhost}/${workspace._id}`)
    if (!workspace._id) return Promise.reject(parseError({ code: 400, reason: 'Missing _id' }))
    if (!workspace.type || workspace.type !== 'workspace') return Promise.reject(parseError({ code: 400, reason: 'Missing or wrong type' }))
    return promisifyValidator(validateWorkspace, workspace)
      .then(() => workspaceNotExist(dbhost, workspace._id))
      .then(() => newDB.put(workspaceDesign))
      .then(() => newDB.put(workspace))
      .then(() => addWorkspaceSecurity(workspace._id))
      .then(() => addWorkspaceToUsers(workspace._id, workspace.users, ))
      .then(() => addWorkspaceToAdmins(workspace._id, workspace.admins))
      .then(() => {
        conflictResolver.add(workspace)
        return Promise.resolve()
      })
      .catch(error => {
        if (workspace._id && !error.exist) new PouchDB(`${dbhost}/${workspace._id}`).destroy()
        if (error.name === 'illegal_database_name') {
          return Promise.reject(parseError({ code: 400, reason: `Invalid workspace name or id` }))
        } else if (error.reason) {
          return Promise.reject(parseError({ code: 400, reason: error.reason }))
        } else {
          return Promise.reject(parseError({ code: 500, reason: error.message }))
        }
      })
  },
  delete: (workspaceID) => {
    const workspaceDB = new PouchDB(`${dbhost}/${workspaceID}`)
    return workspaceDB.get(workspaceID)
      .then((workspace) => removeWorkspaceFromUsers(workspace._id, workspace.users).then(() => removeWorkspaceFromAdmins(workspace._id, workspace.admins)))
      .then(() => workspaceDB.destroy())
      .catch((error) => error.name === 'not_found' ? Promise.reject({ message: 'The workspace doesn\'t exist' }) : error)
  }
}

module.exports = workspaceModel
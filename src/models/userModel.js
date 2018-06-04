const { parseError, checkUserExists } = require('../utils')
const {
  addUserToWorkpsace,
  addWorkspaceToUser,
  removeUserFromWorkspace,
  removeWorkspaceFromUser,
  workspaceHasUser,
  workspaceHasAdmin
} = require('../database')

const userModel = {
  addUser: (workspaceID, email) => {
    return checkUserExists(email)
      .then(() => workspaceHasUser(workspaceID, email))
      .then((hasUser) => !hasUser ? Promise.resolve() : Promise.reject({ reason: 'The user already belongs to the workspace' }))
      .then(() => Promise.all([
        addUserToWorkpsace(workspaceID, email),
        addWorkspaceToUser(workspaceID, email)
      ])).catch((error) => Promise.reject(parseError({ code: 500, reason: error.reason })))
  },
  removeUser: (workspaceID, email) => {
    return checkUserExists(email)
      .then(() => workspaceHasUser(workspaceID, email))
      .then((hasUser) => hasUser ? Promise.resolve() : Promise.reject({ reason: 'The user doesn\'t belongs to the workspace' }))
      .then(() => workspaceHasAdmin(workspaceID, email))
      .then((hasAdmin) => hasAdmin ?  Promise.all([
        removeAdminFromWorkspace(workspaceID, email),
        removeWorkspaceFromAdmin(workspaceID, email)
      ]) : Promise.resolve)
      .then(() => Promise.all([
        removeUserFromWorkspace(workspaceID, email),
        removeWorkspaceFromUser(workspaceID, email)
      ])).catch((error) => Promise.reject(parseError({ code: 500, reason: error.reason })))
  }
}

module.exports = userModel

const { parseError, checkUserExists } = require('../utils')
const {
  addAdminToWorkpsace,
  addWorkspaceToAdmin,
  removeAdminFromWorkspace,
  removeWorkspaceFromAdmin,
  workspaceHasUser,
  workspaceHasAdmin
} = require('../database')

const adminModel = {
  addAdmin: (workspaceID, email) => {
    return checkUserExists(email)
      .then(() => workspaceHasUser(workspaceID, email))
      .then((hasUser) => hasUser ? Promise.resolve() : Promise.reject({ reason: 'The user doesn\'t belongs to the workspace' }))
      .then(() => workspaceHasAdmin(workspaceID, email))
      .then((hasAdmin) => !hasAdmin ? Promise.resolve() : Promise.reject({ reason: 'The admin already belongs to the workspace' }))
      .then(() => Promise.all([
        addAdminToWorkpsace(workspaceID, email),
        addWorkspaceToAdmin(workspaceID, email)
      ])).catch((error) => Promise.reject(parseError({ code: 500, reason: error.reason })))
  },
  removeAdmin: (workspaceID, email) => {
    return checkUserExists(email)
      .then(() => workspaceHasAdmin(workspaceID, email))
      .then((hasAdmin) => hasAdmin ? Promise.resolve() : Promise.reject({ reason: 'The admin doesn\'t belongs to the workspace' }))
      .then(() => Promise.all([
        removeAdminFromWorkspace(workspaceID, email),
        removeWorkspaceFromAdmin(workspaceID, email)
      ])).catch((error) => Promise.reject(parseError({ code: 500, reason: error.reason })))
  }
}

module.exports = adminModel

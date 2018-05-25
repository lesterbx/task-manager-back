const { userModel } = require('../models')

const userController = {
  create: (req, res, next) => {
    userModel.addUser(req.params.workspaceID, req.body.email)
      .then(() => next())
      .catch(next)
  },
  delete: (req, res, next) => {
    userModel.removeUser(req.params.workspaceID, req.params.userID)
      .then(() => next())
      .catch(next)
  }
}

module.exports = userController
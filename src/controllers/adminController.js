const { adminModel } = require('../models')

const adminController = {
  create: (req, res, next) => {
    adminModel.addAdmin(req.params.workspaceID, req.body.email)
      .then(() => next())
      .catch(next)
  },
  delete: (req, res, next) => {
    adminModel.removeAdmin(req.params.workspaceID, req.params.userID)
      .then(() => next())
      .catch(next)
  }
}

module.exports = adminController
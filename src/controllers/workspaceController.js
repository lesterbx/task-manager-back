const { workspaceModel } = require('../models')

const workspaceController = {
  create: (req, res, next) => {
    workspaceModel.create(req.body).then(() => next()).catch(next)
  },
  delete: (req, res, next) => {
    workspaceModel.delete(req.params.workspaceID).then(() => next()).catch(next)
  }
}

module.exports = workspaceController
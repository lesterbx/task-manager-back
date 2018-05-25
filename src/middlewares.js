const logger = require('./logger')
const { parseReq, parseAuthHeader, checkAuth, parseError, checkAdmin } = require('./utils')

const middlewares = {
  auth: (req, res, next) => {
    if (!req.headers.auth) {
      next(parseError({ code: 401, reason: 'Unauthorized' }))
    } else {
      let auth = parseAuthHeader(req.headers.auth)
      checkAuth(auth)
        .then(() => next())
        .catch((error) => next(parseError({ code: 401, reason: error.response.data.reason })))
    }
  },
  admin: (req, res, next) => {
    checkAdmin(parseAuthHeader(req.headers.auth), req.params.workspaceID)
      .then(() => next())
      .catch(() => next(parseError({ code: 401, reason: 'Unauthorized' })))
  },
  begin: (req, res, next) => {
    logger.begin(parseReq(req))
    next()
  },
  success: (req, res, next) => {
    logger.success(parseReq(req))
    res.status(200).end('OK')
  },
  fail: (err, req, res, next) => {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
      res.status(405).end('Method not allowed')
    } else {
      err.statusCode = err.statusCode || 500
      logger.error(parseReq(req), err.message)
      res.status(err.statusCode).end(err.message)
    }
  }
}

module.exports = middlewares
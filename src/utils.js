const PouchDB = require('pouchdb')
const axios = require('axios')
const config = require('../config')

const promisifyValidator = (validator, doc) => {
  try {
    validator(doc)
    return Promise.resolve()
  } catch (e) {
    return Promise.reject({ reason: e.forbidden })
  }
}
const workspaceNotExist = (dbhost, id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${dbhost}/${id}`)
      .then(() => reject({ exist: true, reason: 'The workspace ID is already taken' }))
      .catch(({ response }) => response.data.error === 'not_found' ? resolve() : reject(response.data.error))
  })
}
const couchURL = (config) => {
  return `${config.protocol}://${config.user}:${config.password}@${config.host}:${config.port}`
}
const arr2obj = (array) => {
  return array.reduce((acc, el) => ({ ...acc, [el._id]: el }), {})
}
const removeFromArray = (element) => (arr) => {
  return arr.slice(0, arr.indexOf(element)).concat(arr.slice(arr.indexOf(element) + 1, arr.length))
}
const addToArray = (element) => (arr) => {
  return [...arr, element]
}
const parseReq = (req) => {
  return {
    type: req.path.includes('user') ? 'user' : req.path.includes('admin') ? 'admin' : 'workspace',
    action: req.method === 'POST' ? 'create' : 'delete',
    workspaceID: req.path.split('/')[2] || req.body._id || 'unknown'
  }
}
const parseAuthHeader = (header) => {
  return {
    user: header.split(':')[0],
    password: header.split(':')[1]
  }
}
const checkAuth = ({ user, password }) => {
  return axios.get(`${config.protocol}://${user}:${password}@${config.host}:${config.port}/_session`)
}
const checkAdmin = ({ user, password }, workspaceID) => {
  return axios.get(`${config.protocol}://${user}:${password}@${config.host}:${config.port}/_session`)
    .then(({ data }) => data.userCtx.roles.includes(`${workspaceID}-admin`)
      ? Promise.resolve()
      : Promise.reject())
    .catch(() => Promise.reject())
}
const checkUserExists = (user) => {
  return new PouchDB(`${couchURL(config)}/_users`).get(`org.couchdb.user:${user}`)
    .then(() => Promise.resolve())
    .catch(() => Promise.reject({ reason: `User ${user} doesn't exist` }))
}
const parseError = (error) => {
  let err = new Error(error.reason)
  err.statusCode = error.code
  return err
}

module.exports = {
  promisifyValidator,
  workspaceNotExist,
  couchURL,
  arr2obj,
  removeFromArray,
  addToArray,
  parseReq,
  parseAuthHeader,
  checkAuth,
  checkAdmin,
  parseError,
  checkUserExists
}


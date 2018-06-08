const PouchDB = require('pouchdb')
const config = require('../config')
const { addToArray, removeFromArray, couchURL } = require('./utils')
const dbhost = couchURL(config)

/**
 * Updates a document from the database
 * @param {*} dbname Name of the database
 * @param {*} docID ID of the document to update
 * @param {*} updates Object where the keys are the fields to update and the values are the function to apply for updating
 */
const updateDocument = (dbname, docID, updates) => {
  const db = new PouchDB(`${dbhost}/${dbname}`)
  return db.get(docID).then((doc) =>
    db.put(Object.keys(updates).reduce((finalDoc, field) => ({
      ...finalDoc,
      [field]: updates[field](finalDoc[field])
    }), doc))
  )
}

const database = {
  workspaceHasUser: (workspaceID, email) => {
    return new PouchDB(`${dbhost}/${workspaceID}`).get(workspaceID)
      .then((workspaceDoc) => Promise.resolve(workspaceDoc.users.includes(email)))
  },
  workspaceHasAdmin: (workspaceID, email) => {
    return new PouchDB(`${dbhost}/${workspaceID}`).get(workspaceID)
      .then((workspaceDoc) => Promise.resolve(workspaceDoc.admins.includes(email)))
  },
  addUserToWorkpsace: (workspaceID, email) => {
    return updateDocument(workspaceID, workspaceID, { users: addToArray(email) })
  },
  removeUserFromWorkspace: (workspaceID, email) => {
    return updateDocument(workspaceID, workspaceID, { users: removeFromArray(email) })
  },
  addWorkspaceToUser: (workspaceID, email) => {
    return updateDocument('_users', `org.couchdb.user:${email}`, { workspaces: addToArray(workspaceID), roles: addToArray(`${workspaceID}-member`) })
  },
  removeWorkspaceFromUser: (workspaceID, email) => {
    return updateDocument('_users', `org.couchdb.user:${email}`, { workspaces: removeFromArray(workspaceID), roles: removeFromArray(`${workspaceID}-member`) })
  },
  addAdminToWorkpsace: (workspaceID, email) => {
    return updateDocument(workspaceID, workspaceID, { admins: addToArray(email) })
  },
  removeAdminFromWorkspace: (workspaceID, email) => {
    return updateDocument(workspaceID, workspaceID, { admins: removeFromArray(email) })
  },
  addWorkspaceToAdmin: (workspaceID, email) => {
    return updateDocument('_users', `org.couchdb.user:${email}`, { roles: addToArray(`${workspaceID}-admin`) })
  },
  removeWorkspaceFromAdmin: (workspaceID, email) => {
    return updateDocument('_users', `org.couchdb.user:${email}`, { roles: removeFromArray(`${workspaceID}-admin`) })
  }
}

module.exports = database
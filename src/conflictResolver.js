const PouchDB = require('pouchdb')
const axios = require('axios')
const config = require('../config')
const { couchURL } = require('./utils')
const dbhost = couchURL(config)

PouchDB.plugin(require('pouch-resolve-conflicts'))

const systemDBs = ['_global_changes', '_replicator', '_users']

const resolveConflict = (a, b) => a.timestamp > b.timestamp ? a : b

const filterSystemDBs = (dbnames) => dbnames.filter((db) => !systemDBs.includes(db))

const listenDBsConflicts = (dbnames) => {
  dbnames.forEach(listenDBConflicts)
}

const listenDBConflicts = (dbname) => {
  let db = new PouchDB(`${dbhost}/${dbname}`)
  db.changes({
    live: true,
    include_docs: true,
    conflicts: true
  }).on('change', ({ doc }) => {
    db.resolveConflict(doc, resolveConflict)
  })
}

const conflictResolver = {
  init: () => {
    axios.get(`${dbhost}/_all_dbs`)
      .then(filterSystemDBs)
      .then(listenDBsConflicts)
  },
  add: (dbname) => {
    listenDBConflicts(dbname)
  }
}

module.exports = conflictResolver

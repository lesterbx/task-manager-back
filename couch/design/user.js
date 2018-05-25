const JSONfn = require('json-fn')
const { validateUser } = require('../validators')

module.exports = {
  _id: '_design/user',
  language: 'javascript',
  validate_doc_update: JSONfn.parse(validateUser)
}
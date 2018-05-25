module.exports = function (newDoc, savedDoc) {
  if (!newDoc._deleted) {
    function required(field, message) {
      if (!newDoc[field] || newDoc[field] === '') {
        throw ({ forbidden: message })
      }
    }
    if (newDoc.type === 'workspace') {
      required('title', 'Missing title')
      required('users', 'Missing users')
      required('picture', 'Missing picture')
      required('admins', 'Missing admins')
      required('description', 'Missing description')
    } else if (newDoc.type === 'board') {
      required('title', 'Missing tutle')
    } else if (newDoc.type === 'column') {
      required('title', 'Missing title')
      required('boardID', 'Missing board id')
      required('position', 'Missing position')
    } else if (newDoc.type === 'note') {
      required('text', 'Missing text')
      required('columnID', 'Missing column id')
      required('position', 'Missing position')
    }

  }
}

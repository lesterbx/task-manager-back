module.exports = {
  _id: "_design/workspace",
  language: "javascript",
  validate_doc_update: `function (newDoc, savedDoc) {
        if (!newDoc._deleted) {
          function required(field, message) {
            if (newDoc[field] === null || newDoc[field] === undefined || newDoc[field] === '') {
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
          } else {
            throw ({forbidden: 'Wrong document type'})
          }
        }
      }`,
  updates: {
    timestamp: `function (doc, req) {
      doc.timestamp = Date.now()
      return [doc, 'Timestamped document']
    }`
  },
  views: {
    boards: {
      map: `function (doc) {
        if (doc.type === 'board') {
          emit(doc.timestamp, null);
        }
      }`
    },
    boardContent: {
      map: `function (doc) {
          if (doc.type === 'column') {\
            emit(doc.boardID, null)
          } else if (doc.type === 'note') {
            emit(doc.boardID, null);    
          }  
        }`
    },
    columnNotes: {
      map: `function (doc) {
        if (doc.type === 'note') {\
          emit(doc.columnID, null)
        }
      }`
    }
  }
}
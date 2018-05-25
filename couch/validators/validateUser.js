module.exports = (newDoc, savedDoc) => {
  if(!newDoc._deleted){
    function required(field, message){
      if(newDoc[field] === undefined || newDoc[field] === ''){
        throw({forbidden: message})
      }
    }
    required('firstName', 'Missing first name')
    required('lastName', 'Missing last name')
    required('name', 'Missing email')
    required('workspaces', 'Missing workspaces')
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var nameRegex = /^[a-zA-Z]+$/
    function valid(field, regex, message){
      if(!regex.test(newDoc[field])){
        throw({forbidden: message});
      }
    }
    valid('name', emailRegex, 'Invalid email format')
    valid('firstName', nameRegex, 'First name can only contain letters')
    valid('lastName', nameRegex, 'Last name can only contain letters') 
  }
}

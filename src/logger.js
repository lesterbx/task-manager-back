const logger = {
  begin: ({type, action, workspaceID}) => {
    console.log(`${new Date().toLocaleString()} - New ${type} ${action} request <${workspaceID}>`)
  },
  success: ({type, action, workspaceID}) => {
    console.log(`${new Date().toLocaleString()} - Succesfull ${type} ${action} request <${workspaceID}>`)
  },
  error: ({type, action, workspaceID}, error) => {
    console.log(`${new Date().toLocaleString()} - Error ${type} ${action} request <${workspaceID}>: ${error}`)
  }
}

module.exports = logger
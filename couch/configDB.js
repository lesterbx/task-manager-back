const axios = require('axios')
const directives = require('./directives')
const config = require('../config')
const { couchURL } = require('../src/utils')
const userDesign = require('./design/user')

const dbhost = couchURL(config)

const nodeName = 'couchdb@localhost'

const putDirectives = () => {
  Promise.all(directives.map((directive) =>
    axios.put(`${dbhost}/_node/${nodeName}/_config/${directive.section}/${directive.key}`, directive.value, { headers: { "Content-Type": "text/plain" } })
  ))
    .then(() => console.log('Succesfully setted configuration directives'))
    .catch((error) => console.log('Error putting directives: ', error.message))
}

const putUserDD = () => {
  axios.put(`${dbhost}/_users`, JSON.stringify(userDesign))
    .then(() => console.log('Succesfully setted users deisgn document'))
    .catch((error) => console.log('Error setting users design document: ', error.response.data.reason))
}


putDirectives()
putUserDD()

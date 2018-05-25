import axios from 'axios'
import directives from './directives.json'
import config from './config'
import { couchURL } from './utils' 

const dbhost = couchURL(config)

const configDB = (config, directives) => {
  axios.get(`${dbhost}/_membership`)
}

const nodeName = (host) => {
  return axios.get(`${dbhost}/_membership`).then(({}))
}
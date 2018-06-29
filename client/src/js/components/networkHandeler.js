import fetch from 'unfetch'

const encryption = require('./../../../../shared/encryption.js')({
  fetch: fetch,
  server: 'http://localhost:' + process.env.Web_Server_Port
})
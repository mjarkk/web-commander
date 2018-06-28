// check the incomming content

const fetch = require('node-fetch')
const encryption = require('../shared/encryption.js')({
  fetch: fetch
})
const db = require('./database/db.js')

class Check {
  constructor() {

  }
  checkIncomming(req) {
    return new Promise((resolve, reject) => {
      if (req.body.data && req.body.username) {
        resolve()
      } else {
        reject()
      }
    })
  }
}

module.exports = new Check
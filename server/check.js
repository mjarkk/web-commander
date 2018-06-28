// check the incomming content

const Joi = require('joi')
const fetch = require('node-fetch')
const encryption = require('../shared/encryption.js')({
  fetch: fetch
})
const db = require('./database/db.js')

class Check {
  constructor() {

  }
  checkIncomming(req) {
    return new Promise((resolve, reject, validate) => {
      if (req && req.body && req.body.data && req.body.username) {
        let user = db.user(req.body.username)
        resolve()
      } else {
        reject()
      }
    })
  }
  validate() {

  }
}

module.exports = new Check
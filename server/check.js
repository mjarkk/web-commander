// check the incomming content

const log = require('../shared/log')
const Joi = require('joi')
const fetch = require('node-fetch')
const encryption = require('../shared/encryption.js')({
  fetch: fetch,
  server: 'http://localhost:' + process.env.Web_Server_Port
})
const db = require('./database/db.js')

class Check {
  constructor() {

  }
  checkIncomming(req, validate) {
    return new Promise((resolve, reject) => {
      if (req && req.body && req.body.data && req.body.username) {
        let next = () => {
          let user = db.user(req.body.username)
          resolve()
        }
        if (typeof validate == 'function') {
          Joi.validate(req.body.data, validate(), err => err ? reject(new Error('Input data not validated')) : next())
        } else {
          next()
        }
      } else {
        reject()
      }
    })
  }
}

module.exports = new Check
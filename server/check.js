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
  async checkIncomming(req, validate) {
    let checks = [
      (resolve, reject) => {
        // check if there is post data
        if (
          typeof req == 'object' 
          && typeof req.body == 'object' 
          && typeof req.body.data == 'string' 
          && typeof req.body.username == 'string'
        ) {
          resolve()
        } else {
          reject('post data wrong')
        }
      },
      (resolve, reject) => {
        // try to decrypt the data from the post object
        let user = db.user(req.body.username)
        if (user) {
          encryption.decrypt(req.body.data, user.key)
          .then(data => {
            req.body.data = data
            req['user'] = user 
            resolve()
          })
          .catch(reject)
        } else {
          reject('post data wrong, username doesn\'t exsist')
        }
      },
      (resolve, reject) => {
        // check if the included data is right
        if (typeof validate == 'function') {
          Joi.validate(req.body.data, validate(), err => err ? reject(new Error('Input data not validated')) : resolve())
        } else {
          resolve()
        }
      }
    ]
    return await checks.map(async (check, id) => await new Promise(check))
  }
}

module.exports = new Check
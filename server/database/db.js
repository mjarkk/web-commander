const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs-extra')
const fetch = require('node-fetch')
const encryption = require('../../shared/encryption.js')({
  fetch,
  server: 'http://localhost:' + process.env.Web_Server_Port
})
const path = require('path')

const adapter = new FileSync(path.resolve(__dirname, 'db.json'))
const db = low(adapter)
const log = require('../../shared/log')

db.defaults({
  apps: [], 
  users: []
}).write()

class Database {
  constructor() {
    if (this.users().length == 0) {
      this.addUser('root', 'serverpass', true, true)
      .then(() => {})
      .catch(() => {})
    }
  }
  users() {
    // ABOUT: return all users
    return db.get('users').value()
  }
  user(username) {
    // ABOUT: get user info
    return db.get('users').find({username}).value()
  }
  appsList() {
    // ABOUT: return apps list
    return true
  }
  addApp() {
    // ABOUT: add a new app
    return true
  }
  genUserInfo(password) {
    // ABOUT: generate the user security keys
    let hash = encryption.hash(password, true)
    return ({
      password: hash.hash,
      salt: hash.salt,
      key: encryption.randomString(5)
    })
  }
  addUser(username, password, admin, force) {
    return new Promise((resolve, reject) => {
      let checks = () => {
        // check if the user doesn't already exsist
        return db.get('users')
          .value()
          .reduce((acc, el) => el.username == username ? false : acc, true)
      }
      let run = () => {
        db.get('users')
          .push(Object.assign({}, {username, admin: !!admin}, this.genUserInfo(password)))
          .write()
        resolve(true)
      }
      if (checks()) {
        if (force) {
          run()
        } else {
          if (/.{8}/.test(password)) {
            run()
          } else {
            reject(new Error('Password must be 8 carchs long'))
          }
        }
      } else {
        reject(new Error('User already exists'))
      }
    })
  }
}

module.exports = new Database
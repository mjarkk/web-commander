const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs-extra')
const fetch = require('node-fetch')
const encryption = require('../../shared/encryption.js')({
  fetch: fetch
})
const path = require('path')

const adapter = new FileSync(path.resolve(__dirname, 'db.json'))
const db = low(adapter)

db
  .defaults({ apps: [], users: [] })
  .write()

class Database {
  constructor() {
    
  }
  users() {
    return db.get('users').value()
  }
  appsList() {

  }
  addApp() {
    
  }
  addUser(username, password, force) {
    return new Promise((resolve, reject) => {
      let checks = () => {
        // check if the user doesn't already exsist
        return db.get('users')
          .value()
          .reduce((acc, el) => el.username == username ? false : acc, true)
      }
      let run = () =>
        db.get('users')
          .push({username: username, password: password})
          .write()
        return true
      if (checks()) {
        if (force) {
          run()
        } else {
          if (/.{8}/.test(password)) {
            resolve(run())
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

module.exports = Database
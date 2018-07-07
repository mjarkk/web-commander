// A warpper around fetch

require('dotenv').config()
const fetch = require('node-fetch')
const fs = require('fs-extra')
const path = require('path')
const colors = require('colors')
const inquirer = require('inquirer')
const encryption = require('../shared/encryption.js')({
  fetch: fetch,
  server: 'http://localhost:' + process.env.Web_Server_Port
})

const log = console.log
const config = {
  port: process.env.Web_Server_Port,
  host: 'localhost',
  protocol: 'http'
}

class FetchHandeler {
  constructor() {
    this.status = false
  }
  check() {
    return new Promise((resolve, reject) => {
      if (!this.status) {
        fetch(this.genURI('/status'))
        .then(data => {
          resolve(true)
        })
        .catch(err => {
          log(colors.red.bold('web commander webserver not running!'))
          log(colors.red('type `yarn start` to start the webserver'))
          log(colors.gray('exiting..'))
          process.exit()
          reject('web commander webserver not running!')
        })
      } else {
        resolve(true)
      }
    })
  }
  login(username, password) {
    let saveKey = ''
    return fetchHandeler.check()
    .then(() => (typeof username == 'string' && typeof password == 'string')
      ? new Promise(next => next({username, password}))
      : inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Username'
        },{
          type: 'password',
          name: 'password',
          message: 'Password'
        }
      ])
    )
    .then(credential => 
      encryption.login(credential.username, credential.password)
    )
    .then(key => {
      saveKey = key
      return inquirer.prompt({
        type: 'confirm',
        name: 'storePass',
        message: 'Do you want to save your credentials?',
        default: false
      })
    })
    .then(data => data.storePass
      ? fs.outputJson(path.resolve(__dirname, '.key'), {key: saveKey})
      : new Promise(next => next())
    )
    .catch(err => {
      log(colors.bold('Password and/or username wrong'))
      process.exit()
    })
  }
  json(uri) {
    return (
      this.check()
      .then(o => fetch(this.genURI(uri)))
      .then(r => r.json())
    )
  }
  get(uri) {
    return (
      this.check()
      .then(o => fetch(this.genURI(uri)))
      .then(r => r.text())
    )
  }
  genURI(uri) {
    return `${config.protocol}://${config.host}:${config.port + (uri[0] == '/' ? '' : `/`) + uri}`
  }
}

let fetchHandeler = new FetchHandeler

module.exports = fetchHandeler
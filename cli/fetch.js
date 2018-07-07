// A warpper around fetch

require('dotenv').config()
const fetch = require('node-fetch')
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
    fetchHandeler.check().then(s => {
      let next = (username, password) => encryption.login(username, password)
      if (typeof username == 'string' && typeof password == 'string') {
        next(username, password)
      } else {
        inquirer.prompt([
          {
            type: 'input',
            name: 'username',
            message: 'Username'
          },{
            type: 'password',
            name: 'password',
            message: 'Password'
          }
        ]).then(output => 
          next(output.username, output.password)
        )
      }
    })
    .catch(() => {})
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
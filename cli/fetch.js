const fetch = require('node-fetch')
const colors = require('colors')
const log = console.log

require('dotenv').config()
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

module.exports = new FetchHandeler
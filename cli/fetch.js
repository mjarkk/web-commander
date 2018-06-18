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
    this.json('/status')
    .catch(err => {
      log(colors.red.bold('web commander webserver not running!'))
      log(colors.gray('exiting..'))
      process.exit()
    })
  }
  json(uri) {
    return (
      fetch(this.genURI(uri))
      .then(r => r.json())
    )
  }
  get(uri) {
    return (
      fetch(this.genURI(uri))
      .then(r => r.text())
    )
  }
  genURI(uri) {
    return `${config.protocol}://${config.host}:${config.port + (uri[0] == '/' ? '' : `/`) + uri}`
  }
}

module.exports = new FetchHandeler
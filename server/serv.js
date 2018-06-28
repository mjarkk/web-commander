const log = console.log

const fetch = require('node-fetch')
const encryption = require('../shared/encryption.js')({
  fetch: fetch
})
const db = require('./database/db.js')
const checker = require('./check.js')

class Client {
  constructor(app, conf) {
    this.app = app
    this.conf = conf
    this.router(app)
  }
  router(app) {
    app.get('/api/login/', (req, res) => 
      res.json({status: true})
    )
    app.get('/api/', (req, res) => 
      this.sendErr({res, why: 'want to find out how the api works?, go to the github repo: https://github.com/mjarkk/web-commander'})
    )
    app.get('/status/', (req, res) => 
      res.json({status: true})
    )
    app.get('/addUser/', (req, res) => 
      checker.checkIncomming(req)
      .then(() => encryption.decrypt(req))
      .then(() => db.addUser())
      .catch(err => this.sendErr({err}))
    )
  }
  sendErr(data) {
    if (typeof data == 'object' && data.res) {
      const res = data.res
      let toSend = {
        status: false
      }
      if (typeof data.why != 'undefined') {
        toSend['why'] = data.why
      }
      if (typeof data.err != 'undefined') {
        toSend['err'] = data.err
      }
      res.json(toSend)
    } else {
      if (typeof data == 'object') {
        console.error('No `res` object found in data from sendErr([data]), included data:', data)
      } else {
        console.error('Undefined data object inside the sendErr([data]), included data:', data)
      }
    }
  }
}

module.exports = Client
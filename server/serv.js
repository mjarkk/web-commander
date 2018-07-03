const log = require('../shared/log')
const fetch = require('node-fetch')
const encryption = require('../shared/encryption')({
  fetch: fetch,
  server: 'http://localhost:' + process.env.Web_Server_Port
})
const db = require('./database/db')
const checker = require('./check')
const ExpressHandeler = require('./expressHandeler')

class Client {
  constructor(app, conf) {

    this.app = app
    this.conf = conf
    this.EH = new ExpressHandeler(app)
    this.router(app)

  }
  router(app) {
    app.post('/api/login/:step', (req, res) => {
      if (typeof req.body.data.username != 'string') {
        this.EH.sendErr({err: 'Post data wrong', res})
      } else {
        let user = db.user(req.body.data.username)
        if (req.params.step == 1) {
          res._json(user)
        } else {
          res._json(user)
        }
      }
    })
    app.get('/api/', (req, res) => 
      this.EH.sendErr({
        res, 
        why: 'want to find out how the api works?, go to the github repo: https://github.com/mjarkk/web-commander'
      })
    )
    app.get('/api/status/', (req, res) => 
      res._json({status: true})
    )
    app.post('/api/addUser/', (req, res) => 
      checker.checkIncomming(
        req, 
        Joi => Joi.object().keys({
          username: Joi.string(), 
          password: Joi.string()
        })
      )
      .then(() => encryption.decrypt(req))
      .then(data => db.addUser(data.username, data.password))
      .catch(err => this.EH.sendErr({err, res}))
    )
  }
}

module.exports = Client
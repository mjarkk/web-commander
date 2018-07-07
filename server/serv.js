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
    this.sendErr = this.EH.sendErr
    this.router(app)

  }
  router(app) {
    let vm = this
    
    // required routes
    require('./routes/login')(vm)
    
    app.get('/api/', (req, res) => 
      vm.sendErr({
        res, why: 'want to find out how the api works?, go to the github repo: https://github.com/mjarkk/web-commander'
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
      .catch(err => vm.sendErr({err, res}))
    )
  }
}

module.exports = Client
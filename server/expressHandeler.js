// This module will handle some express.js parts

require('colors')
const log = console.log

class ExpressHandeler {
  constructor(app) {
    // app = express app
    app.use((req, res, next) => {
      console.log('url:', req.originalUrl)
      res['_json'] = JsonData => {
        if (typeof JsonData == 'object' && (JsonData['password'] || JsonData['key'])) {
          log(`\nFound ${ JsonData['password'] ? JsonData['key'] ? 'password and key' :'password' : 'key' } in data to send back`.red.bold)
          log('This is probebly dangerous'.red.bold)
          log(JsonData)
        }
        res.json(JsonData)
      }
      next()
    })
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
      res._json(toSend)
    } else {
      console.error(
        typeof data == 'object'
          ? 'No `res` object found in data from sendErr([data]), included data:'
          : 'Undefined data object inside the sendErr([data]), included data:'
        , data
      )
    }
  }
}

module.exports = ExpressHandeler
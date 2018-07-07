const fetch = require('node-fetch')
const db = require('../database/db')
const checker = require('../check')
const log = require('../../shared/log')
const encryption = require('../../shared/encryption')({
  fetch: fetch,
  server: 'http://localhost:' + process.env.Web_Server_Port
})

module.exports = vm => {
  vm.app.post('/api/login/:step', (req, res) => {
    if ((req.params.step == 1 && typeof req.body.data.username != 'string') || (req.params.step == 2 && typeof req.body.username != 'string')) {
      vm.sendErr({err: 'Post data wrong', res})
    } else {
      let user = db.user((req.body.data && req.body.data.username) ? req.body.data.username : req.body.username)
      if (user) {
        if (req.params.step == 1) {
          encryption.encrypt(user.key, user.password)
          .then(data => {
            res._json({
              status: true,
              getkey: data,
              salt: user.salt
            })
          })
          .catch(() => res.EH.sendErr({res}))
        } else {
          checker.checkIncomming(req, Joi => Joi.object().keys({tryKey: Joi.string()}))
          .then(() => {
            return encryption.encrypt(req.body.data.tryKey, req.user.key)
          })
          .then(res.trueJson)
          .catch(err => 
            vm.sendErr({err: 'something whent wrong', res})
          )
        }
      } else {
        vm.sendErr({res, why: 'user not found'})
      }
    }
  })
}
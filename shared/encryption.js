// This shared module contains all the things to encrypt and decrypt data

const CryptoJS = require('crypto-js')
const pbkdf2 = require('crypto-js/pbkdf2')

const log = console.log

class Encryption {
  constructor(inputs) {
    let un = undefined
    this.key = un
    this.setup = un
    this.type = un
    this.username = un
    this.fetch = inputs.fetch
    this.server = typeof location != 'undefined' 
      ? location.origin
      : inputs.server
  }
  check(type, input, reject) {
    if (type == 'key') {
      if (input || this.key) {
        return true
      } else {
        reject(new Error('No key included to use'))
        return false
      }
    } else {
      reject(new Error('check type is undefined'))
      return false
    }
  }
  encrypt(data, key) {
    // ABOUT: encrpyt something
    // data = data to encrpyt {string, number, object}
    // ?key = the decryption key (not required IF if there is already set a static key) {object, string}
    return new Promise((resolve, reject) => {
      if (this.check('key', key, reject)) {
        resolve(CryptoJS.AES.encrypt(data, this.key ? this.key : key).toString())
      }
    })
  }
  encrpytSend(uri, data, key) {
    // ABOUT: encrpyt and send something to a url
    return this.fetch(`${this.server}${uri[0] == '/' ? uri : '/' + uri}`, {
      body: {
        username: this.username,
        data: this.encrypt(data, key)
      }
    })
    .then(res => res.text())
  }
  decrypt(data, key) {
    // data = encrypted string or express.js `req` object {string}
    // ?key = the decryption key (not required IF if there is already set a static key) {object, string}
    return new Promise((resolve, reject) => {
      if (this.check('key', key, reject)) {
        resolve(CryptoJS.AES.decrypt(
          (data && data.body && data.body.data) ? data.body.data : data, 
          (this.key) ? this.key : key
        ).toString(CryptoJS.enc.Utf8))
      }
    })
  }
  login(username, password) {
    // log(username, password)
  }
  isLogedin() {
    return !!this.key
  }
  setup(Domain) {
    if (Domain) {
      this.Domain = Domain
    }
  }
}

let encryption = inputs => new Encryption(inputs)
module.exports = encryption
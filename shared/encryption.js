// This shared module contains all the things to encrypt and decrypt data

const CryptoJS = require('crypto-js')

const log = console.log

class Encryption {
  constructor(inputs) {
    let un = undefined

    // init variables
    ['key', 'setup', 'type', 'username'].map(el => this[el] = un)
    
    this.fetch = inputs.fetch
    this.server = typeof location != 'undefined' 
      ? location.origin
      : inputs.server
  }
  check(type, input, reject) {
    // check if there is a key to use
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
  randomString(lenPowOf2) {
    // ABOUT: create a random string 
    // ABOUT: the lenght of the string is 2 to the power of `len`
    return CryptoJS.lib.WordArray.random(typeof len == 'number' ? Math.pow(2, lenPowOf2) : 128).toString()
  }
  hash(data, salt) {
    // ABOUT: hash a string
    // data = something that needs to be hashed {string, object}
    // salt = string to use as salt OR a boolean to point out if the string needs to have a random salt
    salt = typeof salt == 'string' 
      ? salt 
      : salt === true 
        ? this.randomString(7) 
        : ''
    let hash = CryptoJS.PBKDF2(data, salt, {keySize: 128, iterations: 200}).toString()
    return ({
      hash,
      salt
    })
  }
  encrypt(data, key) {
    // ABOUT: encrpyt something
    // data = data to encrpyt {string, number, object}
    // ?key = the decryption key (not required IF there is already set a static key) {object, string}
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
    // ABOUT: check if a user has been authenticated
    return !!this.key
  } 
  setup(Domain) {
    // ABOUT: For later use
    if (Domain) {
      this.Domain = Domain
    }
  }
}

let encryption = inputs => new Encryption(inputs)
module.exports = encryption
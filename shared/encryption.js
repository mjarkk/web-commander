// This shared module contains all the things to encrypt and decrypt data

const CryptoJS = require('crypto-js')

const log = console.log

class Encryption {
  constructor(inputs) {
    let un = undefined
    let vm = this

    // init variables
    let keys = ['key', 'setup', 'type', 'username']
    keys.map(el => vm[el] = un)
    
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
  genURI(uri) {
    return (typeof uri == 'string')
      ? `${this.server}${uri[0] == '/' ? uri : '/' + uri}`
      : this.server
  }
  genFetchObj(PostData, options) {
    // ABOUT: generate options for a fetch
    // ABOUT: this includeds settings the headers, credentials and encrpyting the object if needed
    // PostData = {Object, string, number}
    // options = {Object{key, NoEncryption}}
    let NoEncryption = (typeof options == 'object' && options.NoEncryption) ? true : false
    let key = (typeof options == 'object' && options.key) ? options.key : undefined
    return new Promise((reslove, reject) => {
      let send = data => reslove({
        method: 'POST',
        body: JSON.stringify({
          data,
          username: this.username
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      }) 
      if (NoEncryption) {
        send(PostData)
      } else {
        this.encrypt(PostData, key)
          .then(send)
          .catch(reject)
      }
    })
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
    data = typeof data == 'object'
      ? JSON.stringify(data)
      : typeof data == 'number'
        ? `${data}`
        : data
    return new Promise((resolve, reject) => {
      if (this.check('key', key, reject)) {
        resolve(CryptoJS.AES.encrypt(data, this.key ? this.key : key).toString())
      }
    })
  }
  encrpytSend(uri, data, key) {
    // ABOUT: encrpyt and send something to a url
    return this.genFetchObj(data, {key})
      .then(fetchObj => this.fetch(this.genURI(uri), fetchObj))
      .then(res => res.text())
  }
  ConvertToJson(str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return str
    }
    return JSON.parse(str)
  }
  decrypt(data, key) {
    // data = encrypted string or express.js `req` object {string}
    // ?key = the decryption key (not required IF if there is already set a static key) {object, string}
    return new Promise((resolve, reject) => {
      if (this.check('key', key, reject)) {
        let output = CryptoJS.AES.decrypt(
          (data && data.body && data.body.data) ? data.body.data : data, 
          (this.key) ? this.key : key
        ).toString(CryptoJS.enc.Utf8)

        resolve(
          /^[0-9]{0,}$/.test(output)
            ? Number(output)
            : this.ConvertToJson(output)
        )
      }
    })
  } 
  login(username, password) {
    // ABOUT: try to get the decryption key from the server
    // RETURN: promis(obj{username, key})
    log(username, password)
    return new Promise((resolve, reject) => 
      (!this.fetch) 
        ? reject(new Error('NO fetch nog defined in constructor'))
        : this.genFetchObj({username: username}, {NoEncryption: true})
          .then(fetchObj => this.fetch(this.genURI('/api/login/1'), fetchObj))
          .then(res => res.json())
          .then(data => {
            log(data)
            resolve(data)
          })
          .catch(reject)
    )
  } 
  isLogedin() {
    // ABOUT: check if a user has been authenticated
    return !!this.key
  } 
  setup(data) {
    // ABOUT: For later use
    if (typeof data == 'object') {
      this.Domain = data.Domain | this.Domain
      this.key = data.key | this.key
    }
  }
}

let encryption = inputs => new Encryption(inputs)
module.exports = encryption
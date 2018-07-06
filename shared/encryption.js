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
    // uri = <string> 'some/route/123'
    // RETURNS = 'http://localhost/some/route/123'
    return (typeof uri == 'string')
      ? `${this.server}${uri[0] == '/' ? uri : '/' + uri}`
      : this.server
  }
  genFetchObj(PostData, options, uri) {
    // ABOUT: generate options for a fetch
    // ABOUT: this includeds settings the headers, credentials and encrpyting the object if needed
    // PostData = {Object, string, number}
    // options = {Object{
    //    key, = key to decrypt
    //    NoEncryption, = don't encrpyt the fetch
    //    NormalFetch, = do not automaticly detect if the fetch output if text or json
    //    usePostUsername, = use the username from the PostData as default username 
    // }}
    // uri = url where to fetch to
    return new Promise((resolve, reject) => {
      if (typeof options == 'string') {
        uri = options
      }
      let optionsTrue = typeof options == 'object'
      let NoEncryption = (optionsTrue && options.NoEncryption) ? true : false
      let key = (optionsTrue && options.key) ? options.key : undefined
      let send = data => {
        let toSend = {
          method: 'POST',
          body: JSON.stringify({
            data,
            username: (optionsTrue && options.usePostUsername && typeof PostData == 'object' && PostData.username) 
              ? PostData.username 
              : this.username
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        }
        if (uri) {
          this.fetch(uri, toSend)
          .then(res => {
            if (optionsTrue && options.NormalFetch) {
              resolve(res)
            } else {
              return res.text()
            }
          })
          .then(data => {
            return new Promise(reslove => {
              reslove(this.ConvertToJson(data))
            })
          })
          .then(resolve)
          .catch(reject)
        } else {
          resolve(toSend)
        }
      }
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
    if (lenPowOf2 > 15) {
      // don't allow strings bigger than 20 because the browser / nodejs might crash
      return new Error('String can\'t be more than 20')
    }
    let lenght = typeof lenPowOf2 == 'number' ? Math.pow(2, lenPowOf2) : 128 
    return CryptoJS.lib.WordArray.random(lenght).toString()
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
    return ({ hash, salt })
  }
  encrypt(data, key) {
    // ABOUT: encrpyt something
    // data = data to encrpyt {string, number, object}
    // ?key = the decryption key (not required IF there is already set a static key) {object, string}
    data = typeof data == 'object'
      ? JSON.stringify(data)
      : typeof data == 'number'
        ? '' + data
        : data
    return new Promise((resolve, reject) => {
      if (this.check('key', key, reject)) {
        resolve(CryptoJS.AES.encrypt(data, this.key ? this.key : key).toString())
      }
    })
  }
  encrpytSend(uri, data, key) {
    // ABOUT: encrpyt and send something to a url
    return this.genFetchObj(data, {key}, this.genURI(uri))
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
          this.key ? this.key : key
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
    return new Promise((resolve, reject) => 
      (!this.fetch) 
        ? reject(new Error('NO fetch nog defined in constructor'))
        : this.genFetchObj({username}, {NoEncryption: true, usePostUsername: true}, this.genURI('/api/login/1'))
          .then(data => 
            data.status
              ? this.decrypt(data.getkey, this.hash(password, data.salt).hash)
              : reject('Username does not exsist')
          )
          .then(key =>
            this.genFetchObj(
              {tryKey: this.randomString(5), username: username}, 
              {key, usePostUsername: true}, 
              this.genURI('/api/login/2')
            )
          )
          .then(data => log('data:',data))
          .catch(err => {
            log('got error:',err)
            reject(err)
          })
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
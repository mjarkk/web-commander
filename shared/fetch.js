/*

  A fake fetch that just returns the promise
  Made for testing code that uses the fetch command
  This makes it faster to test code that include fetch
  And allows the tests to be ran without a webserver that acts like the full webserver

*/

const rs = require('randomstring')

let binds = {}

const serverAddress = 'http://localhost:9999'

const bind = (data, uri) => {
  // ABOUT: bind a route to data
  // ABOUT: if no uri is included it will generate a random uri and return it
  data = typeof data == 'object' 
    ? JSON.stringify(data) 
    : data
  uri = typeof uri == 'string' 
    ? uri 
    : rs.generate(30)
  binds[uri] = data

  let toReturn = uri
  toReturn.__proto__.uri = () => `${serverAddress}/${uri}`
  return toReturn
}

const genURI = () => {}

const fetch = uri => 
  new Promise((reslove, reject) => {
    if (typeof uri != 'string') {
      reject('No uri defined')
      return false
    }
    uri = uri.replace(serverAddress, '').replace(/\//,'')
    let data = binds[uri]
    if (!data) {
      reject('No data bind to this uri')
      return false
    }
    reslove({
      json: () => new Promise((reslove, reject) => {
        try {
          reslove(JSON.parse(data))
        } catch (error) {
          reject('can\'t parse json objects') 
        }
      }),
      text: () => new Promise(reslove => reslove(data))
    })
  })

module.exports = {
  fetch,
  bind,
  serverAddress
}
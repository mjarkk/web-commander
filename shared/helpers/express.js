/*

a fake express.js "server" for testing
this server transfroms the app.get, app.use and app.post into functions to exsecute withoud making network requests
what will result in mutch faster tests because the testing code doesn't have to wait for network request
aside from that this code is also more clean and easier to debug

usage:

// import this file
import exp from ./express.js

// create a fake express app object
const app = exp.app()

// example route
app.get('/status', (req, res) => {
  res.json({status: true})
})

// to send a fake request to the route above
exp.newReq('/status', (data, err) => {
  
  console.log(data, err)
  // err = <undefined> undefined
  // data = <object> {status: true}

}, {type: 'get'})

*/

let app = {
  get(route, cb) {
    this.registredRoutes.get[route] = cb
  },
  post(route, cb) {
    this.registredRoutes.post[route] = cb
  },
  use(cb) {
    this.millewares.push(cb)
  },
  registredRoutes: {
    post: {},
    get: {}
  },
  millewares: []
}

module.exports = {
  newReq(path, cb, options) {
    /*
      options = {
        type: ("post" | "get" = default) <string>,
        body: <object> post data
      }
      cb = function(data, err)
      path = request path et: /api/status
    */
    let req = {
      originalUrl: path 
    }
    let route = this.getRoute(path)
    let postOrGet = (typeof options == 'object' && [options.type == 'post' || options.type == 'get']) ? options.type : 'get'
    if (typeof options == 'object' && options.body) {
      req['body'] = options.body
    }
    let SCB = data => {
      cb(data, undefined)
    }
    let res = {
      json: SCB,
      send: SCB,
      attachment: SCB,
      download: SCB,
      end: SCB,
      jsonp: SCB,
      sendFile: SCB,
      status: () => undefined,
      get: type => type == 'Content-Type' ? 'application/json' : undefined,
      type: type => type.indexOf('json') != -1 ? 'application/json' : 'text/html',
      location: () => true,
      redirect: () => true,
      set: () => true,
      sendStatus: () => true
    }
    try {
      this.millewares(req, res, (req, res) => {
        app.registredRoutes[postOrGet][route](req, res)
      }) 
    } catch (err) {
      cb(undefined, err)
    }
  },
  millewares(req, res, next) {
    let looper = i => 
      (app.millewares[i])
        ? app.millewares[i](req, res, () => looper(i+1)) 
        : next(req, res)
    looper(0)
  },
  getRoute(path) {
    return path
  },
  genUri() {
    return `http://localhost:${ port }${ path[0] == '/' ? path : `/${path}` }`
  },
  app() {
    return app
  }
}
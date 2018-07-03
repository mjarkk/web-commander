// a express.js wrapper for testing
// useing this wrapper you don't have to use anny port on the pc for testing
// becuase everything is code based (no network request) means this is much faster than a express
// and makes the testing code much cleaner

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
      path = 
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